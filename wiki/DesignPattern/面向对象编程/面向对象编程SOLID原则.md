---
title: 面向对象编程SOLID原则
createTime: 2025/07/19 22:46:16
permalink: /design-pattern/wxhyx6rw/
---

SOLID原则是面向对象class设计的五条原则。



背景

SOLID首先由著名的科学家Robert C Martion在论文中提出。Bob大叔也是畅销书《代码整洁之道》和《架构整洁之道》的作者。

SOLID是以下原则的缩写：

- S 单一职责原则
- O 开闭原则
- L 里氏替换原则
- I 接口隔离原则
- D 依赖倒置原则



## 单一职责原则

单一职责原则的描述：一个class应该只做一件事，一个class应该只有一个变化的原因。

如果class是一个数据容器，比如Book class或者Student class，考虑到这个实体有一些字段，应该只有我们更改了数据定义时才能够修改这些字段。

```java
public class Invoice {

    private Book book;
    private int quantity;
    private double discountRate;
    private double taxRate;
    private double total;

    public Invoice(Book book, int quantity, double discountRate, double taxRate) {
        this.book = book;
        this.quantity = quantity;
        this.discountRate = discountRate;
        this.taxRate = taxRate;
        this.total = this.calculateTotal();
    }
    public double calculateTotal() {
        double price = ((book.price - book.price * discountRate) * this.quantity);
        double priceWithTaxes = price * (1 + taxRate);
        return priceWithTaxes;
    }
    public void printInvoice() {
        System.out.println(quantity + "x " + book.name + " " + book.price + "$");
        System.out.println("Discount Rate: " + discountRate);
        System.out.println("Tax Rate: " + taxRate);
        System.out.println("Total: " + total);
    }
    public void saveToFile(String filename) {
        // Creates a file with given name and writes the invoice
    }
}
```

这个Invoice类由三个方法，一个是calculateTota方法，计算总价格；一个printInvoice方法，打印发票信息到控制台；一个saveToFile负责将发票写到一个文件里面。

这个类违反了SRP原则，应该将printInvoice方法和saveToFile拆分出类。

```java

public class InvoicePrinter {
    private Invoice invoice;

    public InvoicePrinter(Invoice invoice) {
        this.invoice = invoice;
    }

    public void print() {
        System.out.println(invoice.quantity + "x " + invoice.book.name + " " + invoice.book.price + " $");
        System.out.println("Discount Rate: " + invoice.discountRate);
        System.out.println("Tax Rate: " + invoice.taxRate);
        System.out.println("Total: " + invoice.total + " $");
    }
}
```



```java
public class InvoicePersistence {
    Invoice invoice;
    public InvoicePersistence(Invoice invoice) {
        this.invoice = invoice;
    }
    public void saveToFile(String filename) {
        // Creates a file with given name and writes the invoice
    }
}
```



现在class结构遵从单一职责原则，每个clas为我们应用的一个部分负责。



## 开闭原则

开闭原则要求“class应该对扩展开放，对修改关闭“。

修改意味着修改存在的代码，扩展意味着添加新的功能。

这个原则想要表达的是：我们应该能在不动class已经存在的代码的前提下添加新的功能。这是因为当我们修改存在的代码时，我们就会面临着创建潜在bug的风险。因此，如果可能，应该避免碰通过测试的可靠的生产环境的代码。



老板提出一个需求，需要将发票信息保存到数据库，你可能会写如下代码：

```java
public class InvoicePersistence {
    Invoice invoice;

    public InvoicePersistence(Invoice invoice) {
        this.invoice = invoice;
    }

    public void saveToFile(String filename) {
        // Creates a file with given name and writes the invoice
    }

    public void saveToDatabase() {
        // Saves the invoice to database
    }
}
```

但是这样的，并没有把class设计的易于未来扩展，为了添加这一特性，需要修改InvoicePersistence class.

如何重构符合开闭原则？

```java
interface InvoicePersistence {
    public void save(Invoice invoice);
}
```

把InvoicePersistence类改成接口，并添加save方法，每个持久化class都实现这个save方法。

```java
public class DatabasePersistence implements InvoicePersistence {

    @Override
    public void save(Invoice invoice) {
        // Save to DB
    }
}
```



```java
public class FilePersistence implements InvoicePersistence {

    @Override
    public void save(Invoice invoice) {
        // Save to file
    }
}
```



## 里氏替换原则

里氏替换原则描述的是：子类应该能够替换为它的基类。

意思就是：给定class B是class A的子类，在预期传入class A的对象的任何方法传入class B的对象，方法都不应该有异常。

假定子类继承了父类的一切，子类可以扩展行为，但不会收窄。当class违背了这一原则，会导致一些难以发现的讨厌bug。



有一个矩形类：

```java
class Rectangle {
	protected int width, height;

	public Rectangle() {
	}

	public Rectangle(int width, int height) {
		this.width = width;
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getArea() {
		return width * height;
	}
}
```

我们都知道正方形是特殊的矩形：

下面是一个正方形类，继承矩形类：

```java
class Square extends Rectangle {
	public Square() {}

	public Square(int size) {
		width = height = size;
	}

	@Override
	public void setWidth(int width) {
		super.setWidth(width);
		super.setHeight(width);
	}

	@Override
	public void setHeight(int height) {
		super.setHeight(height);
		super.setWidth(height);
	}
}
```

因为我们重载了setter方法，使宽和高任何一个改变，都会改变另外一方，这样一来，我们就违背了里氏替换原则，比如用下面方法测试：

```java
class Test {

   static void getAreaTest(Rectangle r) {
      int width = r.getWidth();
      r.setHeight(10);
      System.out.println("Expected area of " + (width * 10) + ", got " + r.getArea());
   }

   public static void main(String[] args) {
      Rectangle rc = new Rectangle(2, 3);
      getAreaTest(rc);

      Rectangle sq = new Square();
      sq.setWidth(5);
      getAreaTest(sq);
   }
}
```

在第一个测试中，我们创建了一个宽为 2 高为 3 的矩形，然后调用 **getAreaTest**，预期输出为 20，但是当传入一个正方形时出错了。这是因为调用测试里的 **setHeight** 函数会同时设置 width，导致输出结果不符预期。



## 接口隔离原则

隔离意味着保持独立，接口隔离原则是关于接口的独立。

该原则描述了很多客户端**特定的接口优于一个多用途接口**。客户端不应该强制实现他们不需要的函数。



定义一个停车场类

```java
public interface ParkingLot {

	void parkCar();	// Decrease empty spot count by 1
	void unparkCar(); // Increase empty spots by 1
	void getCapacity();	// Returns car capacity
	double calculateFee(Car car); // Returns the price based on number of hours
	void doPayment(Car car);
}

class Car {

}
```

停车场接口组合了两个事情：停车相关逻辑（停车、取车、获取车位信息）以及支付相关逻辑。

但是上面的类太具体了，既是免费停车也必须实现不相关的支付方法。

```java
public class FreeParking implements ParkingLot {

	@Override
	public void parkCar() {
		
	}

	@Override
	public void unparkCar() {

	}

	@Override
	public void getCapacity() {

	}

	@Override
	public double calculateFee(Car car) {
		return 0;
	}

	@Override
	public void doPayment(Car car) {
		throw new Exception("Parking lot is free");
	}
}
```



优化略，图片未加载，重新找事例。



## 依赖倒置原则

依赖倒置原则描述的是：我们的class应该依赖接口和抽象类，而不是依赖具体的类和函数。

Bob大叔总结：

> 如果OCP声明了OO体系接口的目标，那么DIP则声明了主要机制

这两个原则息息相关，我们在讨论开闭原则之前也用到了这一模式。

我们想要我们的类开放扩展，因此我们需要明确我们的依赖的是接口而不是具体的类，我们的PersistenceManager class 依赖InvoicePersistence而不是实现了这个接口的class。



## 参考文章

[面向对象编程的 SOLID 原则](https://www.freecodecamp.org/chinese/news/solid-principles/)
