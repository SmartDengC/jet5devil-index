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

### Arrays.sort(int[] a)

都是静态方法，直接使用类名.方法名使用

下面这些都是对基础了类型，默认生序的。

```java
public static void sort(int[] a);
public static void sort(int[] a, int fromIndex, int toIndex);
// ...
// 可以对int[], long[], char[], short[], byte[], float[], double[]等基础类型数组进行排序
// 
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

### public static int binarySearch(long[] a, long key)

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

### public static void fill(int[] a, int val)

类似方法：

`public static void fill(int[], int fromIndex, int toIndex, int val)`

```java
public static void fill(int[] a, int val) {
    for (int i = 0, len = a.length; i < len; i++)
      	// 全部填充为val
        a[i] = val;
}
```

### public static int[] copyOf(int[] original, int newLength)

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

### public static int[] copyOfRange(int[] original, int from, int to)

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

### public static \<T> List\<T> asList(T... a)

T... a底层转化为T[] x的数组。

```java
public static <T> List<T> asList(T... a) {
  	// 这里的ArrayList不是java.util里面的类，是Arrays类中的内部类
    return new ArrayList<>(a);
}
```

### public static String toString(int[] a)

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

### public static InStream stream(int[] array)

```java
public static IntStream stream(int[] array) {
    return stream(array, 0, array.length);
}
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
