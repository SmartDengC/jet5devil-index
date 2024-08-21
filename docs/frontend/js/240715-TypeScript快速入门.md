---
title: TypeScript快速入门
author: 邓聪的小破站
createTime: 2024/07/15 00:22:58
permalink: /notes/zfa9o069/
tags: 
  - typescript
---

[TS官网](https://www.typescriptlang.org/)

[TS官网PlayGround](https://www.typescriptlang.org/play/)

[20分钟TS进阶，无废话快速提升水平 前段速看](https://www.bilibili.com/video/BV1q64y1j7aH/?spm_id_from=333.788&vd_source=35e7dde81183ac464990a0a0ab794bce)

1 ts类型规定，有哪些类型， string?

```typescript
let str: string
let str1: string = 'abc'
```

```typescript
let numArr = [1, 2, 3]
const resut = numArr.find(item => item>2) as number
console.log(resut * 4)
```



基础类型

- string
- number
- boolean
- null
- undefined



联合类型

```typescript
let v4: string | null = null
```

```typescript
let v5: 1 | 2 | 4 = 3
```



## 数组，元组，枚举

数组

```typescript
let n2: number[] = [1,2,3]
let n3: Array<string> = ['a', 'b', 'c']
```

元组

```typescript
let t1: [string, number, string?] = ['a', 1, '3']
```

枚举

```typescript
enum MyEnum{
    A,
    B,
    C
}
console.log(MyEnum[0])
console.log(MyEnum.A)
```



## 函数

```typescript
function myfunc(a=10, b: string, c?:boolean, ...res: number[]): number{
    return 10
}

const f = myfunc(20, 'a', true, 1,1,3)
```

## 接口

```typescript
interface Obj{
    name: string, 
    age: number
}

const obj: Obj = {
    name: 'a',
    age: 10
}
```

## 类型

```typescript
type MyType = string | number
let a: MyType = 'abc'
let b: MyType = 10
```

## 范型

```typescript
function myFun<T>(a: T, b: T){
    return [a, b]
}

myFun<number>(1, 2)
myFun<string>('a','b')
```



## 进阶内容

```typescript
// 接口重载
function hello(name: string): string
function hello(age: number): string

function hello(value: string | number): string {
  if (typeof value === 'string') {
    return 'string'
  }
  else if (typeof value === 'number') {
    return 'number'
  }
  else {
    return 'invalid'
  }
}

hello('nohup')
hello(18)

// 接口继承
interface Parent {
  prop1: string
  prop2: number
}

interface Child extends Parent {
  prop3: string
}

const obj: Child = {
  prop1: 'deng',
  prop2: 1,
  prop3: 'hello world',
}

// 类的修饰符
class Article {
  title: string
  content: string
  time?: string
  author: 'deng'

  constructor(title: string, content: string) {
    this.title = title
    this.content = content
  }
}

const a = new Article('标题', '内容')


// 内部器
class User{
  private _password: string = ''
  
  get password() {
    return '****'
  }
  set password(newPassword) {
    this._password = newPassword
  }
}

const user = new User()
console.log(user.password)

// 抽象类
abstract class Anilmal{
  abstract name: string
  abstract sound(): void
  move() {
    console.log('移动')
  }
}
class Cat extends Anilmal{
  name: string = '小猫'
  override sound(): void {
  }
}

```

