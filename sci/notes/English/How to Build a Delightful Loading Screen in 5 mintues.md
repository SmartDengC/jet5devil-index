---
title: How to Build a Delightful Loading Screen in 5 mintues
author: 邓聪的小破站
createTime: 2024/02/02 16:25:01
permalink: /English/p3zygtnx/
tags:
  - css
  - English
---

[How to build a delightfule loading screen in 5 mintues](https://www.freecodecamp.org/news/how-to-build-a-delightful-loading-screen-in-5-minutes-847991da509f)

First, here is what we will build. Set your timer!

Does this look familiar?

if yes, that is because you've seen this somewhere

Let us learn a few things by..

Now let's go!

## 1.The Markup

The markup required for this is quite simple, Here it is:

```html
<section class="loading">
  For new sidebar colors, click your workspace name, then Preferences > Sidebar
  > Theme

  <span class="loading__author"> - Your friends at Slack</span>
  <span class="loading__anim"></span>
</section>
```

Simple huh?

if you are not sure why the class name have weird dashes， i explained the reason behidn that in [this article](https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849)

The result of this is the simple view below.

## 2.Center the content

The result is not the prettiest of stuff to behold. Let us have the entire .loading section elemetn entered in the page

```css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

## 3.Style the Loading text

I know. We will get to the animated stuff soon. For now , let us style the .loading text to look a lot better.

```css
.loading {
  max-width: 50%;
  line-height: 1.4;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}
```

## 5.Create the animated loader

The much-anticipated step is here. This is going to be the longest of steps, because i will be spending some time to make sure you understand how it works.

if you get stuck, drop a comment and i will be happy to help.

Hey, have a look at the loader again.

You will notic that half of its stroke is blue and the other half is grey. Okay, that is sored out. Also html elements are not rounded by default. Everythings is a box element. the first real challenge will by how to give the .loading_anim element half borders.

Don't worry if you don't understandard this yet. i will come batch to it.

First, let us sort out the dimensions of the loader.

```css
.loading__anim {
  width: 35px;
  height: 35px;
}
```

RIght now, the loader is on the same lines as the text. That is because it is a span element which happens to be an html inline element.

Let us make sure the loader seats on another line , that is it begins on another line as opposed to the default behavior of inline elements.

```css
.loading__anim {
  width: 35px;
  height: 35px;
  display: inline-block;
}
```

Finally, lets make sure the loader has some border set.

```css
.loading__anim {
  width: 35px;
  height: 35px;
  display: inline-block;
  border: 5px solid rgbas(189, 189, 189, 0.25);
}
```

## New word and New Phrase

- Weird dashes 奇怪的破折号

- Animate 动画

- Get stuck 卡住
