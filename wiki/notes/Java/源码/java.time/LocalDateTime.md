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

具体的LocalDate操作可以参考： [LocalDate](./LocalDate.md)

```java
private final LocalDate date;
@Override
public LocalDate toLocalDate() {
    return date;
}
```

### public LocalTime toLocalTime()

获取到LocalDateTime中LocalTime部分内容。

具体的LocalTime操作可以参考： [LocalTime](./LocalDate.md)

```java
@Override
public LocalTime toLocalTime() {
    return time;
}
```

### public boolean isBefore(ChronoLocalDateTime<?> other)

`nowDateTime.isBefore(oldDateTime)`

判断nowDateTime是否在oldDateTime时间之前，是的话，返回true，否则返回false。

```java
    public boolean isBefore(ChronoLocalDateTime<?> other) {
        if (other instanceof LocalDateTime) {
            return compareTo0((LocalDateTime) other) < 0;
        }
        return ChronoLocalDateTime.super.isBefore(other);
    }

```

同上面的isBefore。

`nowDateTime.isAfter(oldDateTime)`，判断nowDateTime是否在oldDateTime之后，是的话，返回true，否则返回false。

```java
public boolean isAfter(ChronoLocalDateTime<?> other) {
    if (other instanceof LocalDateTime) {
        return compareTo0((LocalDateTime) other) > 0;
    }
    return ChronoLocalDateTime.super.isAfter(other);
}
```

### public static LocalDateTime(CharSequence text, DateTimeFormatter formatter)

通过LocalDateTime.parse将字符串时间转化成LocalDateTime时间

```java
public static LocalDateTime parse(CharSequence text, DateTimeFormatter formatter) {
    Objects.requireNonNull(formatter, "formatter");
    return formatter.parse(text, LocalDateTime::from);
}
```

要求格式化字符串不能为空，然后使用formatter来格式化时间。



## 二、Date与LocalDate、LocalTime、LocalDateTime转换

### 2.1、Date转LocalDate等

#### 2.1.1、

```java
public static void date2Local() {
    // 新建一个Date对象
    Date date = new Date();

    // 获取到默认时区
    ZoneId zoneId = ZoneId.systemDefault();
    // 将Date转化成具有时区的ZoneDateTime对象。
    ZonedDateTime zonedDateTime = date.toInstant().atZone(zoneId);
    LocalDate localDate = zonedDateTime.toLocalDate();
    LocalTime localTime = zonedDateTime.toLocalTime();
    LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
}
```

#### 2.1.2、

```java
public void date2Local2() {
    // 新建一个Date对象
    Date date = new Date();

    // 获取当前系统默认的时区
    ZoneId zoneId = ZoneId.systemDefault();
    // 转化
    LocalDateTime localDateTime = LocalDateTime.ofInstant(date.toInstant(), zoneId);
    LocalDate localDate = LocalDate.ofInstant(date.toInstant(), zoneId);
    LocalTime localTime = LocalTime.ofInstant(date.toInstant(), zoneId);
}
```

### 2.2、LocalDate等转Date

#### 2.2.1、java.time.LocalDateTime -> java.util.Date

```java
LocalDateTime now = LocalDateTime.now();
// instant
Instant instant = now.atZone(ZoneId.systemDefault()).toInstant();
Date from = Date.from(instant);
```

#### 2.2.2、java.time.LocalDate -> java.util.Date

```java
LocalDate now = LocalDate.now();
Instant instant = now.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant();
Date from = Date.from(instant);
```
