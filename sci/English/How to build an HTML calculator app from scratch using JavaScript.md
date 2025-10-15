---
title: How to build an HTML calculator app from scratch using JavaScript
author: 邓聪的小破站
createTime: 2024/02/03 15:12:36
permalink: /English/7o5d9ro3/
---

[Origin Site ](https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98)

This is an ==epic== where you learn how to build a calculator from scratch. we will focus on the javascript you need to wirte-how to think about building the calculator, how to write the code, and eventually, how to clean up your code.

## The ==prerequirsites==

Before you attempt follow through the lesson, please make sure you have a ==decent== command of Javascript. Minimally, you need to know these things:

1 if/else statements > if(condition){} else{}

2 for loops > for(let i=0; i<len(10); i++){}

3 JavaScript functions > function name(para){}

4 Arrow functions > hello = () => {return "hello world"}

5 && and || operators

6 how to change the text with the textContent property > innerHTML

## Before you begin

I ==urge== you to try and build the calculator yourself before following the lesson. it is good practice, because you will train yourself to think like a developer.

Come back to this lesson once ,you have tried fro one hour(does nota matter whether you succeed or fail. when you try, you think, and that will help you absorb the lesson in double quick time)

With that, let us begin by understanding how a calculator works.

## Building the calculator

First, we want to build the calculator.

The calculator consist of two parts: the display and the keys.

```html
<div class="calculator">
  <div class="calculator__display">0</div>
  <div class="calculator__keys">...</div>
</div>
```

We can use CSS grid to make the keys. Since they are arranged in a grid-like format. This has already been done for you in the starter file. You can find the starter file at this pen.

```css
.calculator__keys {
  display: grid;
}
```

To help us identify operator, decimal, clear and equal keys, we are going to supply a data-accton attribute that describes what they do .

```html
<div class="calculator__keys">
  <button class="key--operator" data-action="add">+</button>
  <button class="key--operator" data-action="subtract">-</button>
  <button class="key--operator" data-action="multiply">*</button>
  <button class="key--operator" data-action="divide">/</button>

  <button>7</button>
  <button>8</button>
  <button>9</button>
  <button>4</button>
  <button>5</button>
  <button>6</button>
  <button>1</button>
  <button>2</button>
  <button>3</button>
  <button>0</button>
  <button data-action="decimal">.</button>
  <button data-action="clear">AC</button>
  <button class="key--equal" data-actio="calculate">=</button>
</div>
```

## Listening to key-press

Five things can happen when a person gets hold of a calcultor. They can hit:

1 a number key

2 an operator key(+, -, \*, /)

3 the decimal key

4 the equals key

5 the clear key

the first steps to building this calculator are to be able to (1) listen for all keypresses and (2) ==determine== the type of key that is pressed. in this case, we can use an event ==delegation== pattern to listen, since keys are all children of .calculator\_\_keys

```js
const calculator = document.querySelector(".calculator"); // gain display
const key = document.querySelector(".calculator__keys");
keys.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    // DO Something
  }
});
```

Next, we can use the data-action attribute to determine the type of key that is clicked.

```js
const key = e.target;
const action = key.dataset.action;
```

if the keys does not have a data-action attribute, it must be a number key.

```js
if (!action) {
  console.log("number key");
}
```

if the key has a data-action that is either add, subtract, multiply or divide, we know the key is as operator.

```js
if (
  action === "add" ||
  action === "subtract" ||
  action === "multiply" ||
  action === "divide"
) {
  console.log("operator key!");
}
```

if the key's data-action is decimal, we know the use clicked on the decimal key.

Following the same thought process. if the key'is data-action is clear, we know the user clicked on the clear(the one that says AC) key. If the key's data-action is calculate, we know the user clicked on the equals key.

```js
if (action === "decimal") {
  console.log("decimal key!");
}
if (action === "clear") {
  console.log("clear key!");
}
if (action === "calculate") {
  console.log("equal key!");
}
```

At this point ,you should get a console.log response from every calculator key.

## Building the happy path

Let us consider what the average person would do when they pick up a calculator. This "what the average person would do "is called the happy path.

Let us call our average person Mary.

When Mary picks up a calculator, she could hit any of these keys:

...

it can be overwhilming to consider five types of keys at once, so let's take it step by step.

## When a user hits a number key

At this point, if the calculator show 0(the default number), the target number should replace zero.

if the calculator show a non-zero number, the target number should be append to the displayed number.

Here, we need to know two things:

1 the number of the key that was clicked

2 the current displayed number

We can get these tow values through the textContent property of the clicked key and .calculator\_\_display, respectively.

```js
const display = document.querySelector(".calculator__display");
keys.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayNum = display.textConten;
  }
});
```

If the calculator shows 0, we want to replace the calcullator's display with the clicked key. We can do so by replacing the display's textContent property.

```js
if (!action) {
  if (displayNum === "0") {
    display.textContent = keyContent;
  }
}
```

if the calculators shows a non-zero number, we want to append the clicked key to the displayd number. To append a number, we concatenate a string .

```js
if (!action) {
  if (displayNum === "0") {
    display.textContent = keyContent;
  } else {
    display.textContent = displayNum + keyContent;
  }
}
```

At this point, Mary may click either of these key:

1 a decimal key

2 an operator key

let's say Mary hits the decimal key.

## When a user hits the decimal key

When Mary hits the decimal key, a decimal should appear on the display, if Mary hits any number after hitting a decimal key, the number should be append on the display as well.

To create this effect, we can concatenate . To the displayed number

```js
if (action === "decimal") {
  display.textContent = displayNum + ".";
}
```

Next, let us say Mary continues her calculation by hitting an operator key.

## When a user hits an operator key

If mary hits an operator key, the operator should be hightligted so mary knows the operator is active.

To do so, we can add the `is-depressed` class to the operator key.

```js
if (
  action === "add" ||
  action === "subtract" ||
  action === "multiply" ||
  action === "divide"
) {
  key.classList.add("is-depressed");
}
```

once Mary has hit an operator key, she will hit another number key.

## When a user hits a number key after an operator key

When Mary...

## New word or New phrase

- epic 壮举
- prerequirsites 预先 pre require site
- decent 体面的 adj
- determine 确定 v
- delegation 代表
