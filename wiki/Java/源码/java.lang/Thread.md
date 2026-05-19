---
title: Thread
createTime: 2025/06/02 10:40:54
permalink: /java/6z6ytej8/
---

Thread类实现了Runnable接口，所以需要实现run方法。

Thread的定义：

```java
public class Thread implements Runnable {
  
}
```

## 一、方法定义

### public void run()

```java
private Runnable target;

@Override
public void run() {
    if (target != null) {
        target.run();
    }
}
```

