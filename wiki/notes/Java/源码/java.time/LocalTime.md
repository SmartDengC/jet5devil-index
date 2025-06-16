---
title: LocalTime
createTime: 2025/06/13 18:20:38
permalink: /java/xohookko/
---

```java
public final class LocalTime
        implements Temporal, TemporalAdjuster, Comparable<LocalTime>, Serializable {
}
```

LocalTime定义了许多常用的变量，比如每天多少小时、每小时多少分钟、每分钟多少秒等等。

```java
static final int HOURS_PER_DAY = 24;
static final int MINUTES_PER_HOUR = 60;
static final int MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;
static final int SECONDS_PER_MINUTE = 60;
static final int SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
static final int SECONDS_PER_DAY = SECONDS_PER_HOUR * HOURS_PER_DAY;
static final long MILLIS_PER_DAY = SECONDS_PER_DAY * 1000L;
static final long MICROS_PER_DAY = SECONDS_PER_DAY * 1000_000L;
```

私有变量，小时、分钟、秒。

```java
private final byte hour;
private final byte minute;
private final byte second;
```

### public static LocalTime now()

静态方法now()和now(ZoneId zone)都是返回一个当前时间点的LocalTime对象。

```java
public static LocalTime now() {
    return now(Clock.systemDefaultZone());
}
public static LocalTime now(ZoneId zone) {
    return now(Clock.system(zone));
}
public static LocalTime now(Clock clock) {
    Objects.requireNonNull(clock, "clock");
    final Instant now = clock.instant(); // called once
    return ofInstant(now, clock.getZone());
}
```

### public static LocalTime of(int hour, int minute, int second)

返回对应hour、minute、second的对象。

```java
public static LocalTime of (int hour, int minute, int second) {
    HOUR_OF_DAY.checkValidValue(hour);
    if ((minute | second) == 0) {
        return HOURS[hour]; // for performance
    }
    MINUTE_OF_HOUR.checkValidValue(minute);
    SECOND_OF_MINUTE.checkValidValue(second);
    return new LocalTime(hour, minute, second, 0);
}
```

### public static LocalTime parse(CharSequence text)

解析文本时间。

`public static LocalTime parse(CharSequence text, DateTimeFormatter formatter)`

```java
public static LocalTime parse(CharSequence text) {
    return parse(text, DateTimeFormatter.ISO_LOCAL_TIME);
}
public static LocalTime parse(CharSequence text, DateTimeFormatter formatter) {
    Objects.requireNonNull(formatter, "formatter");
    return formatter.parse(text, LocalTime::from);
}
```

### public LocalTime plusHours(long hoursToAdd)

`pulbic LocalTime plusMinutes(long minutesToAdd)`

`public localTime plusSeconds(long seconds)` 

```java
public LocalTime plusHours(long hoursToAdd) {
    if (hoursToAdd == 0) {
        return this;
    }
    int newHour = ((int) (hoursToAdd % HOURS_PER_DAY) + hour + HOURS_PER_DAY) % HOURS_PER_DAY;
    return create(newHour, minute, second, nano);
}
```



