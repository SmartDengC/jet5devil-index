---
title: Comparator
createTime: 2025/08/12 23:28:37
permalink: /java/sxzjrfpm/
---

今天在写算法题的时候，遇到了需要给Map<Integer, Integer>的容器排序的情况，故此来学习回顾一下。



[Java Comparable和Comparator的区别](https://javabetter.cn/basic-extra-meal/comparable-omparator.html)





## 一、Comparator

源码：

```java
public interface Comparator<T> {
    int compare(T o1, T o2);
    boolean equals(Object obj);
}
```

Comparator也是接口，需要实现compare(o1, o2)方法。



两者之间主要的区别：

- 一个类实现Comparable接口，意味着该类的对象可以直接进行比较，但是比较的方式只有一种（就是类中定义的那种），很单一
- 一个类如果要保持原样，又需要进行不同方式的比较，就可以定制比较器（实现Comparator接口）
- Comparable接口在java.lang包下，而Comparator接口在java.util包下。

## 二、测试代码

```java
package org.hahadeng.basic.SortTest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * 学生类
 *
 * @author 邓聪
 * @since 2025/3/4 17:02
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student implements Comparable<Student>{
    private String name;
    private Integer age;


    @Override
    public int compareTo(Student o) {
        return this.getAge() - o.getAge();
    }

    public static void main(String[] args) {
        List<Student> lit = new ArrayList<>();

        Student s1 = new Student("zs1", 18);
        Student s2 = new Student("zs2", 25);
        Student s3 = new Student("zs3", 16);
        Student s4 = new Student("zs4", 30);

        lit.add(s1);
        lit.add(s2);
        lit.add(s3);
        lit.add(s4);

        int i = s1.compareTo(s3);
        if(i > 0){
            System.out.println(s1.getName() + "比较大");
        } else if (i < 0) {
            System.out.println(s3.getName() + "比较大");
        }else{
            System.out.println("一样大");
        }

        Collections.sort(lit, new Comparator<Student>() {

            @Override
            public int compare(Student o1, Student o2) {
                return o1.getAge() - o2.getAge();
            }
        });

        lit.forEach(System.out::println);
    }
}

```

