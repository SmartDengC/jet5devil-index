---
title: LocalDateTime
createTime: 2025/06/13 18:20:25
permalink: /java/xmpzjost/
---


简单学习一下LocalDateTime。

## 一、LocalDateTime源码阅读

类LocalDateTime的定义

```java
public final class LocalDateTime
        implements Temporal, TemporalAdjuster, ChronoLocalDateTime<LocalDate>, Serializable {

}
```

### public static LocalDateTime now()

LocalDateTime不能被new出来，只能使静态方法返回一个LocalDateTime的对象。

```java
public static LocalDateTime now() {
    return now(Clock.systemDefaultZone());
}
public static LocalDateTime now(Clock clock) {
    Objects.requireNonNull(clock, "clock");
    final Instant now = clock.instant(); // called once
    ZoneOffset offset = clock.getZone().getRules().getOffset(now);
    return ofEpochSecond(now.getEpochSecond(), now.getNano(), offset);
}
```

### pulbic LocalDate toLocalDate()

返回LocalDateTime 中的LocalDate部分内容。

```java
private final LocalDate date;
@Override
public LocalDate toLocalDate() {
    return date;
}
```

### public LocalTime toLocalTime()

获取到LocalDateTime中LocalTime部分内容。

```java
@Override
public LocalTime toLocalTime() {
    return time;
}
```





