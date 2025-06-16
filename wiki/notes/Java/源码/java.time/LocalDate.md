---
title: LocalDate
createTime: 2025/06/13 18:20:18
permalink: /java/uam7qzxg/
---



```java
public final class LocalDate
        implements Temporal, TemporalAdjuster, ChronoLocalDate, Serializable {
    private final int year;
    private final short month;
    private final short day;
}

```

## 一、源码

### public static LocalDate now()

```java
public static LocalDate now() {
    return now(Clock.systemDefaultZone());
}
    public static LocalDate now(Clock clock) {
        Objects.requireNonNull(clock, "clock");
        final Instant now = clock.instant();  // called once
        return ofInstant(now, clock.getZone());
    }

```

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

### public static LocalDate parse(CharSequence text)

将text解析成为LocalDate对象，默认使用ISO_LOCAL_DATE。（2025-06-16）

```java
public static LocalDate parse(CharSequence text) {
    return parse(text, DateTimeFormatter.ISO_LOCAL_DATE);
}
```

### public static LocalDate parse(CharSequence text, DateTimeFormatter format)

将text通过formatter格式化成LocalDate。

```java
public static LocalDate parse(CharSequence text, DateTimeFormatter formatter) {
    Objects.requireNonNull(formatter, "formatter");
    return formatter.parse(text, LocalDate::from);
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
