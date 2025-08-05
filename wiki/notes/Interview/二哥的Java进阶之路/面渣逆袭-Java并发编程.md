---
title: 面渣逆袭-Java并发编程
createTime: 2025/08/05 00:26:44
permalink: /interview/r1x58pfd/
---

[面渣逆袭-Java并发编程](https://javabetter.cn/sidebar/sanfene/javathread.html)

## 基础

### 1、并行和并发有什么区别？

- 并行时多核cpu上的多任务处理，多个任务在同一时间真正的同时执行。
- 并发是单核cpu上多任务处理，多个任务在同一时间段内交替执行，通过时间片轮转实现交替执行，用于解决io密集型任务的瓶颈

**你是如何理解线程安全的？**

如果一段代码被多个线程执行，还能够得到正确的答案，那么这段代码或者方法就是线程安全的。

- 原子性：一个操作要么完全执行，要么完全不执行。（可以使用synchornized保证原子性）
- 可见性：当一个线程修改了共享变量，其他线程能够立即看到变化。（可以使用volatile保证可见性）
- 有序性：要确保线程不会因为死锁、饥饿等问题导致无法继续执行

### 2、说说进程和线程的区别？

进程是操作系统分配资源的最小单位。简单来说，就是我们电脑上启动的一个应用。

线程是进程中的独立执行单元，多个线程可以共享进程中的资源，如内存；每个线程都有自己独立的程序计数器、虚拟机栈。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/sanfene/javathread-3.png)

**线程之间是如何进行通信的？**

原则上可以通过消息传递和共享内存两种方式来实现。java采用的是共享内存的并发模型。

一句话来概括就是：共享变量存储在主内存中，每个线程的私有本地内存，存储的是这个共享变量的副本。

线程a和线程b要通信，要经历两个步骤：

- 线程a把本地内存A中的共享变量副本刷新到主内存中。
- 线程b到主内存中读取线程a刷新过的共享变量，在同步到自己的共享变量副本中。

### ⭐️ 3、说说线程有几种创建方式？

创建线程的方式有下面三种：

- 继承Thread，并重写run方法

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(getName() + "线程执行:" + i);
        }
    }

    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        MyThread t2 = new MyThread();
        MyThread t3 = new MyThread();
        t1.setName("线程1");
        t2.setName("线程2");
        t3.setName("线程3");

        t1.start();
        t2.start();
        t3.start();
    }
}

```



- 实现Runnable接口，并重写run方法

```java
public class MyThreadImpl implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread().getName() + "线程执行:" + i);
        }
    }

    public static void main(String[] args) {
        MyThreadImpl t1 = new MyThreadImpl();
        MyThreadImpl t2 = new MyThreadImpl();
        MyThreadImpl t3 = new MyThreadImpl();
        Thread thread1 = new Thread(t1, "线程1");
        Thread thread2 = new Thread(t2, "线程2");
        Thread thread3 = new Thread(t3, "线程3");
        thread1.start();
        thread2.start();
        thread3.start();
    }
}
```

- 实现Callable接口，重写call方法，这种方式可以通过FutureTask获取任务执行的返回值。

```java
public class CallerTask implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "hello world";
    }

    public static void main(String[] args) {
        // 创建异步任务
        FutureTask<String> task = new FutureTask<>(new CallerTask());

        // 这个任务交给线程来执行，执行完之后任务会有一个返回值。
        new Thread(task).start();
        try {
            // 等待执行完成，并获取返回结果
            String result = task.get();
            System.out.println(result);

        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}

```

**run方法和start方法有什么区别？**

- run()：封装线程执行的代码，直接调用相当于调用普通方法
- start()： 启动线程，然后由jvm调用此线程的run方法。

**继承Thread的方式好还是实现Runnable接口好？**

Runnable好

- java单继承 的问题
- 适合多个相同的代码去处理统一资源的情况，把线程、代码和数据有效的分离 ，更符合面向对象的设计思想。Callable和Runnable相似，但可以返回一个结果



方法：

- sleep()：使当前执行的线程暂停毫秒数，也就是进入休眠的状态

```java
try{
  Thread.sleep(1000);
}catch(InterruptedException e){
  e.printStackTrace();
}
```

- Join()：等待这个线程执行完直呼才会轮到后续线程得到cpu的执行权，使用这个也要捕获异常。

```java
    public static void main(String[] args) {
        MyThreadImpl t1 = new MyThreadImpl();

        // 传入一个实现Runnable的对象
        Thread thread = new Thread(t1, "helll");
        thread.start();

        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 只有当thread执行完之后，才会执行thread1线程
        Thread thread1 = new Thread(t1, "hello world");
    }
```

- setDaemon： 将此线程标记为守护线程，就是服务其他的线程， 像java中的垃圾回收线程，就是典型的守护线程。
- yield：是一个静态方法，用于暗示当前线程愿意放弃当前的时间片，允许其他线程执行。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/wangzhe-thread-04.png)

### 6、线程有几种状态？

6种

新建、就绪、运行、阻塞、等待、终止

- NEW：新建状态，通过new Thread创建
- RUNNABLE：调用start，线程进入可运行状态。
- BLOCKED：
- WAITING：线程进入等待状态，调用wait
- TIME_WAITING：
- TERMINATED：终止状态



## 文章详解

### synchronized关键字

[把synchronized关键字讲的那叫一个透彻](https://javabetter.cn/thread/synchronized-1.html)



### 乐观锁CAS

[一文彻底搞清楚Java实现CAS的原理](https://javabetter.cn/thread/cas.html)

如何保证原子性呢？

常见的做法就是加锁。

在java中，我们可以使用synchronized关键字和CAS来实现加锁的效果。

synchironized是悲观锁，随着jdk版本的升级，synchronized关键字已经轻量化了许多，但是依然是悲观锁。



悲观锁：总是认为每次访问共享资源时会发生冲突，所以必须对每次数据操作加上锁，以保证临界区的程序同一时间只能有一个线程执行。

乐观锁：假设对共享资源的访问没有冲突，线程可以不停的执行，无需加锁也无需等待，一旦多个线程发生冲突，乐观锁通常使用一种称为CAS的技术来保证线程执行的安全性。（乐观锁天生免疫死锁）

- 乐观锁用于读多写少的环境，避免频繁加锁影响性能
- 悲观锁多用于写多读少的环境，避免频繁失败和重试影响性能。

**什么是CAS？**

- v：要更新的变量
- e：预期值
- n：新值

判断v是否等于e，如果等于e，就将v修改成n，否则的话，什么都不做。

CAS是原子操作，他是一种系统源语，是一条CPU的原子指令，从cpu层面保证了它的原子性。

当多个线程同时使用CAS操作一个变量时，只有一个会胜出，并成功更新，其余均会失败，但失败的线程并不会被挂起，仅是被告知失败，并且允许再次尝试，当然也允许失败的线程放弃操作。

**CAS的原理？**

Unsafe类，里面是一些native的方法，不同的操作系统，实现CAS的原理是不一样的。

**CAS如何实现原子操作？**

`java.util.concurrent.atomic`包里面有一些原子类，像是AtomicInteger、AtomicLong等等。

**CAS的三大问题？**

尽管CAS提供了一种有效的手段，但是也存在一些问题，比如ABA问题、长时间自旋、多个共享变量的原子操作。

- ABA问题：就是一个值原来是A，变成了B，又变回了A，这个时候用CAS是检查不出来变化的，但实际上却被更新了两次。解决思路是在变量前面追加上版本号或者时间戳。
- 长时间自旋：CAS多于自旋结合，如果自旋CAS长时间不成功，会占用大量的cpu资源。（解决思路是让jvm支持处理器提供的pause指令），pause指令能够让自旋失败时，cpu睡眠一小段时间在继续自旋，从而使读操作频率降低，为解决内存顺序冲突而导致的cpu流水线重拍的代价小一点。
- 多个共享变量的原子操作：一个共享变量CAS能保证原子性，但是多个共享变量CAS就无法保证原子性了，通常有两种方法解决，1使用AtomicReference类保证对象之间的原子性，把多个变量放到一个对象里面进行CAS操作；2使用锁，锁内部的临界区代码可以保证只有当前线程能操作。
