---
title: Arrays
createTime: 2025/05/06 09:47:33
permalink: /java/hzx9kpgw/
---

Arrays类是在java.util包里面。

## 一、Arrays源码学习

Arrays中主要涉及的方法有：

- sort
- binarySearch
- fill
- copyOf
- copyOfRange
- asList

### static String toString(Object[] a)

Arrays.toString 方法就是方便讲数组转成字符串，使用中括号包裹，通过StringBuilder来实现，循环在后面添加元素，最后通过StringBuilder.toString 返回字符串

```java
public static String toString(Object[] a) {
    if (a == null) {
        return "null";
    } else {
        int iMax = a.length - 1;
        if (iMax == -1) {
            return "[]";
        } else {
            StringBuilder b = new StringBuilder();
            b.append('[');
            int i = 0;
            while(true) {
                b.append(String.valueOf(a[i]));
                if (i == iMax) {
                    return b.append(']').toString();
                }
                b.append(", ");
                ++i;
            }
        }
    }
}
```

### static void sort(int[] a)

Arrays类中提供的排序方法，在原始数组上面进行修改。

```java
// 可以对int[], long[], char[], short[], byte[], float[], double[]等基础类型数组进行排序 
public static void sort(int[] a);
public static void sort(int[] a, int fromIndex, int toIndex);
```

如果需要倒序排序的话，可以传入一个比较器。

```java
public static <T> void sort(T[] a, Comparator<? super T> c) {
    if (c == null) {
        sort(a);
    } else if (Arrays.LegacyMergeSort.userRequested) {
        legacyMergeSort(a, c);
    } else {
        TimSort.sort(a, 0, a.length, c, (Object[])null, 0, 0);
    }

}
```

逆序排序举例：

```java
int[] arr = {3,4,5,2,1};
Integer[] arr1 = Arrays.stream(arr).boxed().toArray(Integer[]::new);

// 方法一：传入一个new出来的比较器
Arrays.sort(arr1, new Comparator < Integer > () {
    @Override
    public int compare(Integer integer, Integer t1) {
        return t1 - integer;
    }
});
// 方法二：lambda
Arrays.sort(arr1, (x, y) -> {
    return y - x;
});
// 方法三：使用Collections.reverseOrder()方法
Arrays.sort(arr1, Collections.reverseOrder());
```

要对对象数组进行排序的话，对象类必须实现Comparable接口，并实现compareTo方法.

```java
public class TreeNode implements Comparable<TreeNode> {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int val) {
        this.val = val;
    }
    @Override
    public int compareTo(TreeNode treeNode) {
        return this.val - treeNode.val;
    }
}
```

```java
TreeNode[] nodes = new TreeNode[3];
nodes[0] = new TreeNode(3);
nodes[1] = new TreeNode(2);
nodes[2] = new TreeNode(1);
Arrays.sort(nodes);
System.out.println(Arrays.toString(nodes));
```

### public static \<T> void sort(T[] a, Comparator<? Super T> c)

这个方法对基础类型的包装类型的排序，可以传入一个比较器，来实现正序或者逆序排序。

还有一个类似的方法：

`public static <T> void sort(T[] a, int fromIndex, int toIndex, Comparator<? Super T> c)`

```java
public static <T> void sort(T[] a, Comparator<? super T> c) {
    if (c == null) {
        sort(a);
    } else {
        if (LegacyMergeSort.userRequested)
            legacyMergeSort(a, c);
        else
            TimSort.sort(a, 0, a.length, c, null, 0, 0);
    }
}
```

比如下面例子；

```java
Integer[] arr2 = new Integer[] {1, 2, 34};
Arrays.sort(arr2, (a, b) -> b - a);
Arrays.sort(arr2, (a, b) -> {
    return b - a;
});
Arrays.sort(arr2, Collections.reverseOrder());
```

### static int binarySearch(long[] a, long key)

最常用的二分查找，需要保持原数组有序。

```java
    public static int binarySearch(int[] a, int key) {
      	// 定义的二分查找的基础方法里面，加入了fromIndex和toIndex的功能
        return binarySearch0(a, 0, a.length, key);
    }

    public static int binarySearch(int[] a, int fromIndex, int toIndex,
                                   int key) {
        rangeCheck(a.length, fromIndex, toIndex);
        return binarySearch0(a, fromIndex, toIndex, key);
    }

    // Like public version, but without range checks.
    private static int binarySearch0(int[] a, int fromIndex, int toIndex, int key) {
        int low = fromIndex;
        int high = toIndex - 1;

        while (low <= high) {
            int mid = (low + high) >>> 1;
            int midVal = a[mid];

            if (midVal < key)
                low = mid + 1;
            else if (midVal > key)
                high = mid - 1;
            else
                return mid; // key found
        }
        return -(low + 1);  // key not found.
    }

```

### static void fill(int[] a, int val)

类似方法：

`public static void fill(int[], int fromIndex, int toIndex, int val)`

```java
public static void fill(int[] a, int val) {
    for (int i = 0, len = a.length; i < len; i++)
      	// 全部填充为val
        a[i] = val;
}
```

### static int[] copyOf(int[] original, int newLength)

复制数组，original表示原来数组，newLength表示新数组的长度。

```java
public static int[] copyOf(int[] original, int newLength) {
  	// 创建一个长为newLength的新数组
    int[] copy = new int[newLength];
  	// 通过底层System.arraycopy方法将元素拷贝到新数组里面。
    System.arraycopy(original, 0, copy, 0, Math.min(original.length, newLength));
    return copy;
}
```

补充内容：

```java
    int[] arr = new int[]{3, 2, 4, 1, 5};
    int[] arr2 = new int[10];
    // srcPos + length 
    System.arraycopy(arr, 0, arr2, 1, 3);

    // [from, to)
    int[] ints = Arrays.copyOfRange(arr, 1, 2);

    for (int x : arr2) {
        System.out.println(x);
    }
```

### static int[] copyOfRange(int[] original, int from, int to)

顾名思义。

```java
public static int[] copyOfRange(int[] original, int from, int to) {
  	// to - from表示数组长度
    int newLength = to - from;
    if (newLength < 0)
        throw new IllegalArgumentException(from + " > " + to);
    int[] copy = new int[newLength];
    System.arraycopy(original, from, copy, 0, Math.min(original.length - from, newLength));
    return copy;
}
```

### static \<T> List\<T> asList(T... a)

T... a底层转化为T[] x的数组。

```java
public static <T> List<T> asList(T... a) {
  	// 这里的ArrayList不是java.util里面的类，是Arrays类中的内部类
    return new ArrayList<>(a);
}
```

### static String toString(int[] a)

通过StringBuilder 循环拼接数组元素。

```java
public static String toString(int[] a) {
    if (a == null)
        return "null";
    int iMax = a.length - 1;
    if (iMax == -1)
        return "[]";

    StringBuilder b = new StringBuilder();
    b.append('[');
    for (int i = 0; ; i++) {
        b.append(a[i]);
        if (i == iMax)
            return b.append(']').toString();
        b.append(", ");
    }
}
```

### static InStream stream(int[] array)

```java
public static IntStream stream(int[] array) {
    return stream(array, 0, array.length);
}
```

### static void fill(Object[] a, Object val)

使用val填充数组a。

感觉有点像变异的while循环。

```java
public static void fill(Object[] a, Object val) {
    int i = 0;
    for(int len = a.length; i < len; ++i) {
        a[i] = val;
    }
}
```

它这个fill方法为什么要这么写for循环呢？和我们常规思路写出来的循环应该没有什么区别吧？

```java
int len = a.length;
for(int i = 0;i<len;++i){
  ...
}
```

举例说明：

定义一个数组，然后把数组的每一个值都设置成10

```java
int[] arr = new int[10];
Arrays.fill(arr, 10);
```

### static \<T> void setAll(T[] array, IntFunction<? Extends T> generator)

使用提供的生成器函数设置指定数组的所有元素以计算每个元素

```java
public static <T> void setAll(T[] array, IntFunction<? extends T> generator) {
    Objects.requireNonNull(generator);
    for(int i = 0; i < array.length; ++i) {
        array[i] = generator.apply(i);
    }
}
```

举例说明，下面的g是一个列表数组，然后使用setAll方法，将每一个元素都默认设置成一个数组。

```java
List<Integer>[] g = new ArrayList[10];
Arrays.setAll(g, x -> new ArrayList<>());
```



## 二、Arrays内部类ArrayList

```java
    private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable
    {
        private static final long serialVersionUID = -2764017481108945198L;
        private final E[] a;

        ArrayList(E[] array) {
            a = Objects.requireNonNull(array);
        }

        @Override
        public int size() {
            return a.length;
        }

        @Override
        public Object[] toArray() {
            return a.clone();
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T[] toArray(T[] a) {
            int size = size();
            if (a.length < size)
                return Arrays.copyOf(this.a, size,
                                     (Class<? extends T[]>) a.getClass());
            System.arraycopy(this.a, 0, a, 0, size);
            if (a.length > size)
                a[size] = null;
            return a;
        }

        @Override
        public E get(int index) {
            return a[index];
        }

        @Override
        public E set(int index, E element) {
            E oldValue = a[index];
            a[index] = element;
            return oldValue;
        }

        @Override
        public int indexOf(Object o) {
            E[] a = this.a;
            if (o == null) {
                for (int i = 0; i < a.length; i++)
                    if (a[i] == null)
                        return i;
            } else {
                for (int i = 0; i < a.length; i++)
                    if (o.equals(a[i]))
                        return i;
            }
            return -1;
        }

        @Override
        public boolean contains(Object o) {
            return indexOf(o) != -1;
        }

        @Override
        public Spliterator<E> spliterator() {
            return Spliterators.spliterator(a, Spliterator.ORDERED);
        }

        @Override
        public void forEach(Consumer<? super E> action) {
            Objects.requireNonNull(action);
            for (E e : a) {
                action.accept(e);
            }
        }

        @Override
        public void replaceAll(UnaryOperator<E> operator) {
            Objects.requireNonNull(operator);
            E[] a = this.a;
            for (int i = 0; i < a.length; i++) {
                a[i] = operator.apply(a[i]);
            }
        }

        @Override
        public void sort(Comparator<? super E> c) {
            Arrays.sort(a, c);
        }
    
```
