---
title: Runnable
createTime: 2025/06/02 10:40:49
permalink: /java/f1xdhynz/
---

今天在学习多线程的时候看到了Runnable这个接口，简单了解一下。

Runnable接口只有一个抽象方法，就是run方法。

```java
public interface Runnable {
    /**
     * When an object implementing interface {@code Runnable} is used
     * to create a thread, starting the thread causes the object's
     * {@code run} method to be called in that separately executing
     * thread.
     * <p>
     * The general contract of the method {@code run} is that it may
     * take any action whatsoever.
     *
     * @see     java.lang.Thread#run()
     */
    public abstract void run();
}
```

在后面看到的Thread类是实现了Runnable接口。

Thread和Runnable有什么区别呢？

- Thread是类，Runnable是接口，如果一个类已经继承了某个类，想要实现线程功能只能实现Runnable接口
- Thread多表示线程，Runnable多表示为任务。
