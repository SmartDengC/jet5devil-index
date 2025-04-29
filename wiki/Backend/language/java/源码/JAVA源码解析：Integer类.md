---
title: JAVA源码解析：Integer类
createTime: 2025/04/29 15:31:10
permalink: /article/owvjg3p1/
outline: [2,4]
tags:
  - java源码
---

从今天开始认真阅读Java的源码，主要两个目的，一个就是了解Java代码运行的逻辑，第二个就是学习Java源码的代码写法。

<!-- more -->

需要接续的问题：

- final的含义？
- idea窗口最大化？
- idea分屏之前跳转，ctrl + l/r
- 被打断，记录上下文，toString了
- 如何快速进入状态？
- Python分布式定时任务，sf如果要做分布式？
- pd的使用教程

---

Integer类的定义 final，继承Number，实现Comparable接口。

```java
public final class Integer extends Number implements Comparable<Integer> {}
```

### public static String toString(int i)

Integer类型的toString方法，先获取到整数的位数，然后创建一个对应长度的char[]数组，把整数转存到char[]数组里面，最后转化成字符串

```java
public static String toString(int i) {
    if (i == Integer.MIN_VALUE)
        return "-2147483648";
  	// stringSize表示获取到数字的位数
  	// 提前处理负数，不用单独处理0
    int size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
    char[] buf = new char[size];
    getChars(i, size, buf);
    return new String(buf, true);
}
```

#### static int stringSize(int x)

计算整数x的位数，不使用传统的除10来计算，时间复杂度为`O(1)`

```java
final static int[] sizeTable = { 9, 99, 999, 9999, 99999, 999999, 9999999,
                                      99999999, 999999999, Integer.MAX_VALUE };
// Requires positive x
static int stringSize(int x) {
    for (int i = 0;; i++)
        if (x <= sizeTable[i])
            return i + 1;
}
```

Java源代码喜欢使用`for(;;)`来表示无限循环。

```java
for (;;) {

}
```

### public static String toString(int i, int radix)

radix表示基数，比如常见的2进制，如果radix为空，直接调用`toString(i)`



### public static String toBinaryString(int i)

将int类型转化成二进制字符串

```java
public static String toBinaryString(int i) {
    return toUnsignedString0(i, 1);
}
private static String toUnsignedString0(int val, int shift) {
    // assert shift > 0 && shift <=5 : "Illegal shift value";
  	// 求val的二进制位数
    int mag = Integer.SIZE - Integer.numberOfLeadingZeros(val);
    int chars = Math.max(((mag + (shift - 1)) / shift), 1);
    char[] buf = new char[chars];

    formatUnsignedInt(val, shift, buf, 0, chars);

    // Use special constructor which takes over "buf".
    return new String(buf, true);
}
```

### public static int parseInt(String s, int radix)

解析一个对应基数radix的字符串s，比如`Integer.parseInt("1101", 2);`就表示将二进制字符串1101转化成10进制，最后的返回就是13.

### public static int parseInt(String s)

默认10进制

```java
public static int parseInt(String s) throws NumberFormatException {
    return parseInt(s, 10);
}
```

### public static int valueOf(String s)

解析10进制的字符串s

```java
public static Integer valueOf(String s) throws NumberFormatException {
    return Integer.valueOf(parseInt(s, 10));
}
```

### public static int valueOf(String s, int radix)

解析对应基数radix的字符串s

```java
public static Integer valueOf(String s, int radix) throws NumberFormatException {
    return Integer.valueOf(parseInt(s,radix));
}
```

这里用到了Integer的valueOf方法，也就是我们常说的常量池。

#### public static Integer valueOf(int i)

如果i在区间[-128, 127]之间的话，直接从缓存里面获取返回，否则的话，创建一个新的Integer对象。

```java
static final int low = -128;
// high是根据参数动态获取的，于此同时会创建一个high - low + 1 的数组，用来缓存[low, high]的数据。
static final int high;
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

### public int hashcode()

hashcode 直接返回value

```java
@Override
public int hashCode() {
    return Integer.hashCode(value);
}

public static int hashCode(int value) {
    return value;
}
```

### public boolean equals(Object obj)

equals比较的是值是否一样。

```java
public boolean equals(Object obj) {
    if (obj instanceof Integer) {
        return value == ((Integer) obj).intValue();
    }
    return false;
}
```

### public int compareTo(Integer anotherInteger)

```java
public int compareTo(Integer anotherInteger) {
    return compare(this.value, anotherInteger.value);
}

public static int compare(int x, int y) {
    // 三元运算 (x < y)? -1: ((x==y) ? 0 : 1);
    return (x < y) ? -1 : ((x == y) ? 0 : 1);
}
```

### public static int numberOfLeadingZeros(int i)

返回一个数的二进制位前面有多少个0， 例如：5的二进制表示位101，返回29

```java
    public static int numberOfLeadingZeros(int i) {
        // HD, Figure 5-6
        if (i == 0)
            return 32;
        int n = 1;
        if (i >>> 16 == 0) { n += 16; i <<= 16; }
        if (i >>> 24 == 0) { n +=  8; i <<=  8; }
        if (i >>> 28 == 0) { n +=  4; i <<=  4; }
        if (i >>> 30 == 0) { n +=  2; i <<=  2; }
        n -= i >>> 31;
        return n;
    }
```

### public static int numberOfTrailingZeros(int i)

返回一个数二进制位中最低位的1的位置。

```java
    public static int numberOfTrailingZeros(int i) {
        // HD, Figure 5-14
        int y;
        if (i == 0) return 32;
        int n = 31;
        y = i <<16; if (y != 0) { n = n -16; i = y; }
        y = i << 8; if (y != 0) { n = n - 8; i = y; }
        y = i << 4; if (y != 0) { n = n - 4; i = y; }
        y = i << 2; if (y != 0) { n = n - 2; i = y; }
        return n - ((i << 1) >>> 31);
    }
```



### public static int bitCount(int i)

统计一个数的二进制位有多少个1。如5的二进制位101，返回2

```java
    public static int bitCount(int i) {
        // HD, Figure 5-2
        i = i - ((i >>> 1) & 0x55555555);
        i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
        i = (i + (i >>> 4)) & 0x0f0f0f0f;
        i = i + (i >>> 8);
        i = i + (i >>> 16);
        return i & 0x3f;
    }
```

