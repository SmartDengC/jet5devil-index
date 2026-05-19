---
title: DateTimeFormatter
createTime: 2025/06/13 15:04:57
permalink: /java/12j22dnd/

---

这里简单学习一下类DateTimeFormmater。

DateTimeFormatter 是线程安全的。

[【Java 8 新特性】Java DateTimeFormatter 日期时间格式化器](https://blog.csdn.net/qq_31635851/article/details/120132776)

[DateTimeFormatter](https://liaoxuefeng.com/books/java/datetime/datetime-formatter/)

## DateTimeFormmater源代码

```java
public static final DateTimeFormatter ISO_LOCAL_DATE;
public static final DateTimeFormatter ISO_OFFSET_DATE;
public static final DateTimeFormatter ISO_DATE;
public static final DateTimeFormatter ISO_LOCAL_TIME;
public static final DateTimeFormatter ISO_OFFSET_TIME;
public static final DateTimeFormatter ISO_TIME;
public static final DateTimeFormatter ISO_LOCAL_DATE_TIME;
public static final DateTimeFormatter ISO_OFFSET_DATE_TIME;
public static final DateTimeFormatter ISO_ZONED_DATE_TIME;
public static final DateTimeFormatter ISO_DATE_TIME;
public static final DateTimeFormatter ISO_ORDINAL_DATE;
public static final DateTimeFormatter ISO_WEEK_DATE;
public static final DateTimeFormatter ISO_INSTANT;
public static final DateTimeFormatter BASIC_ISO_DATE;
public static final DateTimeFormatter RFC_1123_DATE_TIME;
```

DateTimeFormmater是LocalDateTime相关的格式化类，下面是类中定义的快捷的格式化样式的简单说明：



- ISO_LOCAL_DATE：格式：`yyyy-MM-dd`  ，适用于只包含日期的本地时间（没有时区信息或时间）。例如：`2025-07-28`

- ISO_OFFSET_DATE：格式：`yyyy-MM-dd+hh:mm`，适用于包含偏移量的日期。它包含日期和时区偏移。例如：`2025-07-28+02:00`

- ISO_DATE  格式：`yyyy-MM-dd`，适用于日期格式，类似于 `ISO_LOCAL_DATE`，它通常是一个标准的 ISO 日期格式。

- ISO_LOCAL_TIME：  格式：`HH:mm:ss`，适用于只包含时间的本地时间（没有日期和时区信息）。例如：`14:30:45`

- ISO_TIME 格式：`HH:mm:ss`， 适用于时间格式，通常没有日期信息。

- ISO_LOCAL_DATE_TIME  格式：`yyyy-MM-dd'T'HH:mm:ss` ，适用于本地的日期时间，既有日期部分，也有时间部分。没有时区信息。例如：`2025-07-28T14:30:45`
- ISO_OFFSET_DATE_TIME  格式：`yyyy-MM-dd'T'HH:mm:ss+hh:mm`  ，适用于包含偏移量的日期时间，包括日期、时间和时区偏移。例如：`2025-07-28T14:30:45+02:00`

- ISO_DATE_TIME     格式：`yyyy-MM-dd'T'HH:mm:ss` ，适用于日期和时间的格式，类似于 `ISO_LOCAL_DATE_TIME`，但通常具有更严格的标准。

- ISO_ORDINAL_DATE：格式：`yyyy-DDD`，适用于按照一年中的第几天表示日期的格式。例如：`2025-210`，其中 210 表示该年中的第 210 天。

- ISO_WEEK_DATE     格式：`yyyy-Www-D`， 适用于 ISO 周日期格式，表示年份、周数和星期几。例如：`2025-W30-2`，表示 2025 年第 30 周的星期二。

- ISO_INSTANT     格式：`yyyy-MM-dd'T'HH:mm:ss.SSSZ`  
     适用于精确到毫秒的时间格式，并包含时区信息。常用于表示时间戳。例如：`2025-07-28T14:30:45.123+02:00`



像是上面定义这些变量，是通过一个Builder的方法来构建对象的。

```java
public static final DateTimeFormatter ISO_LOCAL_DATE;
static {
    ISO_LOCAL_DATE = new DateTimeFormatterBuilder()
            .appendValue(YEAR, 4, 10, SignStyle.EXCEEDS_PAD)
            .appendLiteral('-')
            .appendValue(MONTH_OF_YEAR, 2)
            .appendLiteral('-')
            .appendValue(DAY_OF_MONTH, 2)
            .toFormatter(ResolverStyle.STRICT, IsoChronology.INSTANCE);
}
```



### 测试用例

```java
    @Test
    public void test2() {
        DateTimeFormatter fm = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String format = fm.format(LocalDateTime.now());
        // 年月日 时分秒
        System.out.println(format);

        DateTimeFormatter.ofPattern("HH:mm:ss");
        // 2025-06-13
        DateTimeFormatter isoDate = DateTimeFormatter.ISO_DATE;
        // 2025-06-13T14:53:12.362352
        DateTimeFormatter fm2 = DateTimeFormatter.ISO_DATE_TIME;
        // 2025-06-13T14:54:21.303763
        DateTimeFormatter fm3 = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        // 20250613
        DateTimeFormatter fm4 = DateTimeFormatter.BASIC_ISO_DATE;
        // 14:55:26.365629
        DateTimeFormatter fm5 = DateTimeFormatter.ISO_LOCAL_TIME;

        System.out.println(LocalTime.now());
        System.out.println(fm5.format(LocalDateTime.now()));

        // LocalDate 是年月日
        // LocalDateTime 是年月日时分秒
        // LocalTime 是时分秒
    }
```



## DateTimeFormmater类方法

### public static DateTimeFormatter ofPattern(String pattern)

通过传入一个字符串类型的格式化串创建DateTimeFormatter对象。

```java
public static DateTimeFormatter ofPattern(String pattern) {
    return (new DateTimeFormatterBuilder()).appendPattern(pattern).toFormatter();
}
```

Date转LocalDate

Date对象表示特定的日期和时间，而LocalDate(Java8)对象只包含没有任何时间信息的日期。
因此，如果我们只关心日期而不是时间信息，则可以在Date和LocalDate之间进行转换。

```java
@Test
public void test3() {
    Date date = new Date();
    // 返回当前系统默认的时区
    ZoneId zoneId = ZoneId.systemDefault();

    // atZone()方法返回在指定时区,从该Instant生成的ZonedDateTime
    ZonedDateTime zonedDateTime = date.toInstant().atZone(zoneId);
    LocalDate localDate = zonedDateTime.toLocalDate();
    LocalTime localTime = zonedDateTime.toLocalTime();
    LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
}
```

[java中Date与LocalDate、LocalDate、LocalDateTime互相转化](https://blog.csdn.net/nhjdcsdn/article/details/121648532)

[day048:LocalDateTime中增加、减少、直接修改时间的方法、计算时间间隔的方法](https://blog.csdn.net/m0_57466457/article/details/124848967)





```java
String t1 = "2025-01-11 00:00:00";
String t2 = "2025-01-11 11:00:00";
LocalTime parse = fm.parse(t1, TemporalQueries.localTime());
LocalDate parse1 = fm.parse(t1, TemporalQueries.localDate());

LocalDateTime query = fm.parse(t1).query(LocalDateTime::from);
LocalDateTime query1 = fm.parse(t2).query(LocalDateTime::from);
int i = query.compareTo(query1);
System.out.println(i);
```