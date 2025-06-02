---
title: ThreadPoolExecutor
createTime: 2025/06/02 11:55:18
permalink: /java/scetytsz/
---

参考：

- [Java 多线程：彻底搞懂线程池](https://blog.csdn.net/u013541140/article/details/95225769)

## 一、ThreadPoolExecutor源码

### public void shutdown()

```java
public void shutdown() {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        checkShutdownAccess();
        advanceRunState(SHUTDOWN);
        interruptIdleWorkers();
        onShutdown(); // hook for ScheduledThreadPoolExecutor
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
}
```

### public List\<Runnable> shutdownNow()

```java
public List<Runnable> shutdownNow() {
    List<Runnable> tasks;
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        checkShutdownAccess();
        advanceRunState(STOP);
        interruptWorkers();
        tasks = drainQueue();
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
    return tasks;
}
```

### 拒绝策略

当线程池的线程数达到最大线程时，且还在向阻塞队列中添加任务时，需要执行拒绝策略。

拒绝策略需要实现RejectedExecutionHandler接口，并实现rejectedExecution(Runnable r, ThreadPoolExecutor e)方法。下面是框架定义好的四种拒绝策略。

#### 1、CallerRunsPolicy

由调用线程处理该任务。

```java
public static class CallerRunsPolicy implements RejectedExecutionHandler {

    public CallerRunsPolicy() { }

    /**
     * Executes task r in the caller's thread, unless the executor
     * has been shut down, in which case the task is discarded.
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
      	// 判断线程池e是否被关闭，isShutDown方法返回true表示线程池已经停止接收新任务，但还会执行已提交的任务
      	// 如果线程池还在运行，就会在当前调用者的进程中执行这个被拒绝的任务
      	// 也就是说，被拒绝的任务不会被丢弃，而是有提交任务的线程（当前线程）执行
        if (!e.isShutdown()) {
            r.run();
        }
    }
}
```

#### 2、AbortPolicy

直接抛出异常。

```java
public static class AbortPolicy implements RejectedExecutionHandler {

    public AbortPolicy() { }

    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        throw new RejectedExecutionException("Task " + r.toString() +
                                             " rejected from " + e.toString());
    }
}
```

#### 3、DiscardPolicy

rejectedExecution方法体中什么也不做，直接抛弃当前任务（最新的任务）。

```java
public static class DiscardPolicy implements RejectedExecutionHandler {
    public DiscardPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
    }
}
```

#### 4、DiscardOldestPolicy

抛弃进入队列最长时间的任务。

```java
public static class DiscardOldestPolicy implements RejectedExecutionHandler {
    public DiscardOldestPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
      	// 判断线程池是否运行
        if (!e.isShutdown()) {
          	// 抛弃队首元素
            e.getQueue().poll();
          	// 执行当前任务
            e.execute(r);
        }
    }
}
```

## 二、手写线程池

### 2.1、MyThreadPool类

```java
package dhh.project.config;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * 手写线程池
 *
 * @author 邓聪
 * @since 2025/6/2 00:20
 */
public class MyThreadPool {

    // 任务阻塞队列
    BlockingQueue<Runnable> blockingQueue;

    // 核心线程的数量
    private final int corePoolSize;
    // 最大线程数量
    private final int maxSize;
    // 辅助线程多久没有获取到任务自动关闭
    private final int timeOut;
    // 时间单位
    private final TimeUnit timeUnit;
    // 拒绝策略
    private final RejectHandler rejectHandler;

    public MyThreadPool(int corePoolSize, int maxSize, int timeOut, TimeUnit timeUnit, BlockingQueue<Runnable> blockingQueue, RejectHandler rejectHandler) {
        this.corePoolSize = corePoolSize;
        this.maxSize = maxSize;
        this.timeOut = timeOut;
        this.timeUnit = timeUnit;
        this.blockingQueue = blockingQueue;
        this.rejectHandler = rejectHandler;
    }

    List<Thread> coreList = new ArrayList<>();
    List<Thread> supportList = new ArrayList<>();


    public void execute(Runnable commands) {
        // 如果核心线程数量小于核心线程池大小，则创建核心线程
        if (coreList.size() < corePoolSize) {
            Thread thread = new CoreThread();
            coreList.add(thread);
            thread.start();
        }
        // 如果任务阻塞队列成功加入任务，则直接返回
        if (blockingQueue.offer(commands)) {
            return;
        }
        // 如果核心线程数量加辅助线程数量小于最大线程池大小，则创建辅助线程
        if (coreList.size() + supportList.size() < maxSize) {
            // 创建辅助线程
            Thread thread = new SupportThread();
            supportList.add(thread);
            thread.start();
        }
        // 如果任务阻塞队列加入任务失败，则执行拒绝策略
        if (blockingQueue.offer(commands)) {
            rejectHandler.reject(commands, this);
        }

    }

    class CoreThread extends Thread {
        @Override
        public void run() {
            while (true) {
                try {
                    // 从任务阻塞队列中取出任务并执行
                    Runnable command = blockingQueue.take();
                    command.run();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    class SupportThread extends Thread {
        @Override
        public void run() {
            while (true) {
                try {
                    // 从任务阻塞队列中取出任务并执行，如果超时则返回null
                    Runnable command = blockingQueue.poll(timeOut, timeUnit);
                    // 如果取出的任务为null，则说明辅助线程没有获取到任务，自动关闭
                    if (command == null) {
                        break;
                    }
                    command.run();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
            System.out.println(Thread.currentThread().getName() + "线程结束了!");
        }
    }
}

```

### 2.2、RejectHandler接口

```java
package dhh.project.config;

/**
 * 拒接策略
 *
 * @author 邓聪
 * @since 2025/6/2 11:28
 */
public interface RejectHandler {

    void reject(Runnable rejectCommand, MyThreadPool myThreadPool);
}
```

### 2.3、ThrowRejectHandler实现类

```java
package dhh.project.config;

public class ThrowRejectHandler implements RejectHandler {
    @Override
    public void reject(Runnable rejectCommand, MyThreadPool myThreadPool) {
        throw new RuntimeException("阻塞队列满了！");
    }
}
```

### 2.4、DiscardRejectHandler实现类

```java
package dhh.project.config;

public class DiscardRejectHandler implements RejectHandler {
    @Override
    public void reject(Runnable rejectCommand, MyThreadPool myThreadPool) {
        myThreadPool.blockingQueue.poll();
        myThreadPool.execute(rejectCommand);
    }
}
```

### 2.5、主方法

```java
package dhh.project;

import dhh.project.config.DiscardRejectHandler;
import dhh.project.config.MyThreadPool;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * 线程池
 *
 * @author 邓聪
 * @since 2025/6/1 23:06
 */
public class MyThreadPoolTest {

    public static void main(String[] args) throws InterruptedException {
        // 单元测试还测试不出来，只有main才能？
        MyThreadPool myThreadPool = new MyThreadPool(2, 4, 1, TimeUnit.SECONDS, new ArrayBlockingQueue<>(2), new DiscardRejectHandler());
        for (int i = 0; i < 5; i++) {
            final int fi = i;
            myThreadPool.execute(() -> {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                System.out.println(Thread.currentThread().getName() + "-" + fi);
            });
        }
        System.out.println("主线程没有被阻塞");
    }
}
```

### 2.6、问题

- 你能给线程池增加一个shutdown的功能吗？
- 面试官问你：你怎么理解拒绝策略？如何回答
- JDK的线程池还有一个ThreadFactory的参数，它是干什么的？
