---
title: DateTimeFormatter
createTime: 2025/06/13 15:04:57
permalink: /java/12j22dnd/
---




DateTimeFormatter 是线程安全的。

[【Java 8 新特性】Java DateTimeFormatter 日期时间格式化器](https://blog.csdn.net/qq_31635851/article/details/120132776)

[DateTimeFormatter](https://liaoxuefeng.com/books/java/datetime/datetime-formatter/)

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





通过一个Builder的方法来构建对象。

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