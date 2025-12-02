---
title: JAVA问题集：找寻问题的答案
author: 邓聪的小破站
createTime: 2024/08/01 10:09:40
permalink: /article/u1ugmp0a/
tags: 
  - java
  - 问题集
---

记录JAVA使用中遇到的问题，看下去，说不定你能在里面找到问题的答案。

- [熊爷的计算机小讲座](https://www.bilibili.com/video/BV1Cz42197vL?spm_id_from=333.788.player.switch&vd_source=35e7dde81183ac464990a0a0ab794bce)

- [codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x)

- [构建自己的系统大全（中午翻译）](https://www.wuzao.com/codecrafters-io/build-your-own-x/README.md)

<!-- more -->

## 一、字符串（String）

### 1.1、数字转化成指定位数的字符串，不足的进行补零

[java将数字转换为指定位数的字符串](https://blog.51cto.com/u_16213466/7876568)

#### 1.1.1、String.format()方法转换

```java
String.format("%04d", 22);  // "0022"
String.format("%05d", 22);  // "00022"
```

0代表前面要补的字符， 4表示字符串的长度， d表示参数为整数类型。

#### 1.1.2、DecimalFormat类转换

```java
DecimalFormat df = new DecimalFormat("0000");  // 0的位数表示最后输出位数
String result = df.format(22); // "0022"
```

"0000"表示将数据格式化为4位长度的字符串，不足4位时使用0填充，超过4位不做处理。

#### 1.1.3、StringBuilder类拼接字符串

```java
int len = 4, num = 22;
StringBuilder sb = new StringBuilder();
sb.append(num);
while(sb.length()<len){
  sb.insert(0, "0");
}
String result = sb.toString();
```

## 二、日期（Date，Calendar）

### 2.1、获取到日期的年月日

```java
// Date 
Date date = new Date();
int year = Integer.parseInt(String.format("%tY", date));
int month = Integer.parseInt(String.format("%tm", date));
int day = Integer.parseInt(String.format("%td", date));
int hour = Integer.parseInt(String.format("%tH", date));
int minute = Integer.parseInt(String.format("%tM", date));
int second = Integer.parseInt(String.format("%tS", date));

// Calendar
Calendar calendar = Calendar.getInstance();
int year = calendar.get(Calendar.YEAR);
// 月份是从0开始算的
int month = calendar.get(Calendar.MONTH) + 1;
int day = calendar.get(Calendar.DAY_OF_MONTH);
int dayMin = calendar.getActualMinimum(Calendar.DAY_OF_MONTH);
int dayMax = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
```

## 三、进制

### 3.1、10进制与2进制转换

- 10进制转2进制字符

```java
String string = Integer.toString(10, 2);  // 1010
String binaryString = Integer.toBinaryString(10);  // 1010
```

- 2进制字符转10进制

  - 使用java的API实现

  ```java
  int num = Integer.parseInt(binaryString, 2);
  ```

  - 手写转换

  ```java
  public int convert(String binary) {
      // 1101 -> 1 * 2 ^ 0 + 0 * 2 ^ 1 + 1 * 2 ^ 2 + 1 * 2 ^ 3
      int len = binary.length();
      int ans = 0;
      for (int i = 0; i < len; i++) {
          int n = binary.charAt(len - i - 1) - '0';
          /// 1 << i 表示 Math.pow(2, i)
          ans += n * (1 << i);
      }
      return ans;
  }
  ```

```java
int i = 1 << 2; // 4 左移操作，等价于 Math.pow(2, 2) = 4
```

## 四、数据类型

### 4.1、Map

### 4.1.1、将Map的values转化成List

`HashMap#values() `返回的是一个`java.util.Collection\<V>`， 并不能强制转化到ArrayList中。

需要`new ArrayList(HashMap.values())`

#### 4.1.2、Collector.toMap()

toMap方法在有多个key的时候，会报错，这个时候可以使用`toMap(key, value, (o, n) -> n);`直接返回新值。



[Java 数据长度获取方式对比：length属性、length()和size()方法](https://blog.csdn.net/DaPiCaoMin/article/details/136851235)

字符串使用cha r[]实现的，字符串提供了一个length()的方法，用来获取char[]数组的长度

```java
private final char value[];
public int length() {
    return value.length;
}
```

数组的话，默认有一个length的属性，可以直接调用。

集合的话，维护了一个size的属性，但是返回长度是用size()方法。

```java
private int size;
public int size() {
    return size;
}
```

## 五、集合

### 1、求两个集合的交集

优化代码就是用小的集合来驱动大的集合。

```java
public Set < Integer > intersection(Set < Integer > s1, Set < Integer > s2) {
    // 小的集合驱动大的集合
    boolean b = s1.size() > s2.size();
    Set < Integer > cloneSet = new HashSet < Integer > (b ? s2 : s1);
    cloneSet.retainAll(b ? s1 : s2);
    return cloneSet;
}
```



## 六、对象

### 1、动态的给一个对象的字段赋值

假如我有一个person的对象，我想根据列表里面定义的字段动态的添加属性值。

通过类.getDeclaredFieled(fieldName) 来获取到字段对象，setAccessible(true) 表示可访问，然后用set赋值。

需要抛出NoSuchFieldException, IllegalAccessException错误。

```java
    public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
        Person person = new Person();

        Map<String, String> fieldValues = new HashMap<String, String>() {{
            put("name", "哈哈好心态");
            put("sex", "men");
        }};

        for (Map.Entry<String, String> entry : fieldValues.entrySet()) {
            Field declaredField = Person.class.getDeclaredField(entry.getKey());
            // 设置字段可访问
            declaredField.setAccessible(true);
            declaredField.set(person, entry.getValue());
        }

        System.out.println(person.toString());
    }
```

### 2、对象的深浅拷贝

自己的需求就是，从数据库里面查询出来一个对象， 需要复制一个新的对象，并修改某些字段的值，然后在存入到数据库。

还有就是第三方的拷贝库的使用。

不管是深拷贝还是浅拷贝，都是通过Object类的clone()方法来完成的。

Cloneable是一个标记接口，里面没有代码。

- 浅拷贝：浅拷贝会在对上创建一个新的对象（区别于引用拷贝的一点），不过，如果原对象内部的属性是引用类型的话， 浅拷贝会直接复制对象的引用地址，也就是说拷贝对象和原对象公用同一个内部对象
- 深拷贝：深拷贝会完全复制整个对象，包括这个对象所包含的内部对象。
- ![](https://oss.javaguide.cn/github/javaguide/java/basis/shallow&deep-copy.png)

浅拷贝，如果类中有其他类的引用，浅拷贝之后，两者都还是指向同一个，其中修改一个，之后输出都会修改。（出去字符串特殊的性质）。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/core-points/deep-copy-02.png)

深拷贝，引用类型字段也会克隆一份，当改变任何一个对象，另外一个对象不会随之改变。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/core-points/deep-copy-03.png)

通过clone方法实现过于笨重，通过序列化实现拷贝，每个要序列化的类都要实现Serializable，和Cloneable一样，是一个标记接口，没有代码。


```java
@Data
public class Person implements Cloneable, Serializable {

    private String name;
    private String sex;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public Object deepClone() throws IOException, ClassNotFoundException {
        // 序列化
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);

        oos.writeObject(this);

        // 反序列化
        ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
        ObjectInputStream ois = new ObjectInputStream(bis);
        return ois.readObject();
    }

}
```

```java
public class PersonService {
    public void testClone() throws CloneNotSupportedException, IOException, ClassNotFoundException {
        Person person = new Person();

        // 通过Cloneable拷贝
        Person clone = (Person) person.clone();

        // 通过自定义的deepClone拷贝
        Person o = (Person) person.deepClone();
    }
}

```

