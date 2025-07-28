---
title: LocalDateTime
createTime: 2025/06/13 18:20:25
permalink: /java/xmpzjost/
---


简单学习一下Java中关于时间的几个类，例如LocalTime，LocalDate， LocalDateTime。

## 一、LocalDateTime源码阅读

类LocalDateTime的定义

```java
public final class LocalDateTime
        implements Temporal, TemporalAdjuster, ChronoLocalDateTime<LocalDate>, Serializable {
}
```

### public static LocalDateTime now()

LocalDateTime不能被new出来，只能使静态方法返回一个LocalDateTime的对象。

用法：`LocalDateTime now1 = LocalDateTime.now();`

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

判断nowDateTime是否在oldDateTime时间之前，是的话，返回true，否则返回false。

用法：`boolean before = nowDateTime.isBefore(oldDateTime)`

```java
    public boolean isBefore(ChronoLocalDateTime<?> other) {
        if (other instanceof LocalDateTime) {
            return compareTo0((LocalDateTime) other) < 0;
        }
        return ChronoLocalDateTime.super.isBefore(other);
    }

```

同上面的isBefore。

`boolean after = nowDateTime.isAfter(oldDateTime)`，判断nowDateTime是否在oldDateTime之后，是的话，返回true，否则返回false。

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

## 二、LocalDate源码

```java
public final class LocalDate
        implements Temporal, TemporalAdjuster, ChronoLocalDate, Serializable {
    private final int year;
    private final short month;
    private final short day;
}
```

### public static LocalDate now()

同`LocalDateTime.now()`，只是返回的对象不同，这里返回的是LocalDate

### pulbic static LocalDate now(ZoneId zone)

传入对应的时区。

```java
public static LocalDate now(ZoneId zone) {
    return now(Clock.system(zone));
}
```

### public static LocalDate of(int year, int month, int dayOfMonth)

通过传入年、月、日的数据来构建一个LocalDate的对象，对年月日进行了有效校验。

```java
public static LocalDate of(int year, int month, int dayOfMonth) {
    YEAR.checkValidValue(year);
    MONTH_OF_YEAR.checkValidValue(month);
    DAY_OF_MONTH.checkValidValue(dayOfMonth);
    return create(year, month, dayOfMonth);
}
```

### public static LocalDate parse(CharSequence text, DateTimeFormatter format)

将text通过formatter格式化成LocalDate。

LocalDate还有一个重载的方法，当format为空的时候，默认使用的是DateTimeFormatter.ISO_LOCAL_DATE，如：2025-06-16

```java
public static LocalDate parse(CharSequence text, DateTimeFormatter formatter) {
    Objects.requireNonNull(formatter, "formatter");
    return formatter.parse(text, LocalDate::from);
}
public static LocalDate parse(CharSequence text) {
    return parse(text, DateTimeFormatter.ISO_LOCAL_DATE);
}
```

### public LocalDate plusYear(long yearsToAdd)

对LocalDate的加减操作。

```java
LocalDate now = LocalDate.now();
LocalDate localDate = now.plusYears(1);
LocalDate localDate1 = now.plusMonths(1);
LocalDate localDate2 = now.plusDays(1);
```

- 操作年：

如果传入的yearsToAdd为空，直接返回当前对象， 如果不为空，校验比返回新的年，返回新的LocalDate对象。

```java
public LocalDate plusYears(long yearsToAdd) {
    if (yearsToAdd == 0) {
        return this;
    }
    int newYear = YEAR.checkValidIntValue(year + yearsToAdd);  // safe overflow
    return resolvePreviousValid(newYear, month, day);
}
```

- 操作月：

如果monthsToAdd为空，直接返回当前对象；否则重新计算年、月数据，最后返回新的LocalDate对象。

```java
public LocalDate plusMonths(long monthsToAdd) {
    if (monthsToAdd == 0) {
        return this;
    }
    long monthCount = year * 12L + (month - 1);  // 算出来所有的月份，
    long calcMonths = monthCount + monthsToAdd;  // safe overflow
    int newYear = YEAR.checkValidIntValue(Math.floorDiv(calcMonths, 12));
    int newMonth = Math.floorMod(calcMonths, 12) + 1;
    return resolvePreviousValid(newYear, newMonth, day);
}
```

- 操作日：

日期操作比较复杂，需要考虑二月28天的情况。

```java
public LocalDate plusDays(long daysToAdd) {
    if (daysToAdd == 0) {
        return this;
    }
    long dom = day + daysToAdd;
    if (dom > 0) {
        if (dom <= 28) {
            return new LocalDate(year, month, (int) dom);
        } else if (dom <= 59) { // 59th Jan is 28th Feb, 59th Feb is 31st Mar
            long monthLen = lengthOfMonth();
            if (dom <= monthLen) {
                return new LocalDate(year, month, (int) dom);
            } else if (month < 12) {
                return new LocalDate(year, month + 1, (int) (dom - monthLen));
            } else {
                YEAR.checkValidValue(year + 1);
                return new LocalDate(year + 1, 1, (int) (dom - monthLen));
            }
        }
    }

    long mjDay = Math.addExact(toEpochDay(), daysToAdd);
    return LocalDate.ofEpochDay(mjDay);
}
```

## 三、LocalTime源码

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

同上面的`LocalDateTime.now()`, `LocalDate.now()`

### public static LocalTime of(int hour, int minute, int second)

通过传入对应hour、minute、second构建对象。

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

```

## 四、Date与LocalDate、LocalTime、LocalDateTime转换

### 4.1、Date转LocalDate等

#### 4.1.1、

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

#### 4.1.2、

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

### 4.2、LocalDate等转Date

#### 4.2.1、java.time.LocalDateTime -> java.util.Date

```java
LocalDateTime now = LocalDateTime.now();
// instant
Instant instant = now.atZone(ZoneId.systemDefault()).toInstant();
Date from = Date.from(instant);
```

#### 4.2.2、java.time.LocalDate -> java.util.Date

```java
LocalDate now = LocalDate.now();
Instant instant = now.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant();
Date from = Date.from(instant);
```
