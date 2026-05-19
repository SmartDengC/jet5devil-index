---
title: AtomicBoolean
createTime: 2025/06/14 22:31:20
permalink: /java/ir9b5pou/
---
```java
package dhh.project.config.myaqs;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.LockSupport;

/**
 * 手写锁
 *
 * @author 邓聪
 * @since 2025/6/3 15:15
 */
public class MyLock {

    AtomicBoolean flag = new AtomicBoolean(false);

    Thread owner = null;

    // Node head = new Node();
    // Node tail = head;
    AtomicReference<Node> head = new AtomicReference<>(new Node());
    AtomicReference<Node> tail = new AtomicReference<>(head.get());

    public void lock() {
        // 从false变成true，表示拿到了锁
        if (flag.compareAndSet(false, true)) {
            owner = Thread.currentThread();
            System.out.println(Thread.currentThread().getName() + "线程拿到锁了！");
            return;
        }
        // 没有拿到锁，将线程放到连⌚️的末尾
        // current 表示当前需要放到链表末尾的节点
        Node current = new Node();
        current.thread = Thread.currentThread();
        while (true) {
            // 因为是多线程，需要实时获取到尾节点
            Node currentTail = tail.get();
            if (tail.compareAndSet(currentTail, current)) {
                System.out.println(Thread.currentThread().getName() + "线程放到链表末尾了！");
                currentTail.next = current;
                current.pre = currentTail;
                break;
            }
        }

        // 等待锁释放
        while (true) {
            //
            if (current.pre == head.get() && flag.compareAndSet(false, true)) {
                owner = Thread.currentThread();
                head.set(current);
                current.pre.next = null;
                current.pre = null;
                System.out.println(Thread.currentThread().getName() + "线程被唤醒后，拿到锁了！");
                break;
            }
            LockSupport.park();
        }
    }

    public void unlock() {
        // 判断解锁是否是拥有锁的线程
        if (owner != Thread.currentThread()) {
            throw new RuntimeException("当前线程没有持有锁");
        }
        Node headNode = head.get();
        Node next = headNode.next;
        flag.set(false);
        if (next != null) {
            System.out.println(Thread.currentThread().getName() + "唤醒了" + next.thread.getName() + "线程");
            LockSupport.unpark(next.thread);
        }
    }

    class Node {
        Node pre;
        Node next;
        Thread thread;
    }
}
```
