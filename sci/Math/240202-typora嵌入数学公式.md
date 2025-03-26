---
title: Typora嵌入数学公式
author: 邓聪的小破站
createTime: 2024/02/02 11:00:52
permalink: /article/la1ewimi/
tags: 
  - math
---

讲真的，没有写数学方面的文章，真的不知道在md文件里面如果嵌入数学公式，简单学一下，后面好用。

<!-- more -->

在typora里面，分为行内和块两种方式；

行内的话直接在 `$$`中间写就可以，像是这样子 `$\sqrt[3]{4}$`, 实际就会展示成这样子 $\sqrt[3]{4}$; 

块的话，输入$$ 然后==回车==，就会出现输入公式的地方。

参考：[Typora数学公式汇总（Markdown）](https://zhuanlan.zhihu.com/p/261750408)

## 一、上下标，正负无穷

| 数学表达式 | LaTeX代码 |
| :--------: | :-------: |
|   $x^2$    |    x^2    |
|   $y_1$    |    y_1    |
|  $\infty$  |  \infty   |



## 二、加减乘，分式，根式，省略号

|  数学表达式   |  LaTeX代码  |
| :-----------: | :---------: |
|   $a+b-c*d$   |   a+b-c*d   |
|  $a\div{b}$   |  a\div{b}   |
|   $a\pm{b}$   |   a\pm{b}   |
| $\frac{a}{b}$ | \frac{a}{b} |
|  $\sqrt{b}$   |  \sqrt{b}   |
|   $\cdots$    |   \cdots    |
|               |             |



## 三、三角函数

|   数学表达式   |  LaTeX代码   |
| :------------: | :----------: |
| $\sin{\theta}$ | \sin{\theta} |
| $\cos{\theta}$ | \cos{\theta} |
| $\tan{\theta}$ | \tan{\theta} |
| $\cot{\theta}$ | \cot{\theta} |



## 四、矢量，累加累乘，极限



|            数学表达式             |            LaTeX表达式            |
| :-------------------------------: | :-------------------------------: |
|             $\vec{F}$             |              \vec{F}              |
|       $\sum_{i=1}^{n}{a_i}$       |        \sum_{i=1}^{n}{a_i}        |
|      $\prod_{i=1}^{n}{a_i}$       |       \prod_{i=1}^{n}{a_i}        |
| $\lim_{a\rightarrow+\infty}{a+b}$ | `\lim_{a\rightarrow+\infty}{a+b}` |



## 五、希腊字母

| 数学表达式 | LaTeX代码 |
| :--------: | :-------: |
|  $\alpha$  |  \alpha   |
|  $\beta$   |   \beta   |
|  $\gamma$  |  \gamma   |
|  $\delta$  |  \delta   |
| $\epsilon$ | \epsilon  |
|   $\eta$   |   \eta    |
|  $\theta$  |  \theta   |
|  $\kappa$  |  \kappa   |
|   $\mu$    |    \mu    |
|   $\pi$    |    \pi    |
|   $\pi$    |    \nu    |
|   $\chi$   |   \chi    |



## 六、关系运算符

| 数学表达式 | LaTeX代码 |
| :--------: | :-------: |
|   $\leq$   |   \leq    |
|   $\geq$   |   \geq    |



## 七、矩阵

### 1、简单矩阵

使用`\begin{matrix}...\end{matrix}`生成，每一行以\\结尾表示换行，元素间以 &间隔，式子的表示序号`\tag{2}`(右边的序号)
$$
\begin{matrix}
1&2 \\
4&5 \\

\end{matrix} \tag{1}
$$


### 2、带左右括号的矩阵（大中小括号）

方法一： 在\begin{}之前和\end{}之后添加左右括号的代码。
$$
\left\{
\begin{matrix}
1 &2 \\
3&4 \\
\end{matrix}
\right\} \tag{2}
$$


小括号，中括号类似
$$
\left(
\begin{matrix}
1&2 \\
3&4\\
\end{matrix}
\right)
$$


## 测试vuepress的数学表达式的展示情况

在vuepress的网页中，能够直接展示出来数学表达式的正确语法，这样的话，我就可以不用使用react那个blog框架了




$$
(x^2 + x^y )^{x^y}+ x_1^2= y_1 - y_2^{x_1-y_1^2}
$$



$$
\sqrt[3]{4}
$$

$$
I = \int_0^{2\pi} \sin(x)\,dx
$$

Let $f\colon[a,b]\to\R$ be Riemann integrable. Let $F\colon[a,b]\to\R$ be $F(x)=\int_{a}^{x} f(t)\,dt$. Then $F$ is continuous, and at all $x$ such that $f$ is continuous at $x$, $F$ is differentiable at $x$ with $F'(x)=f(x)$. 

H~2~0  下标`H~2~O`

x^2^  上标 `x^2^`

==key==  高亮 `==key==`


## (a/b)+(c/d) ?= (a+b)/(b+c)

在实现功能的时候突然遇到一个这个问题，但是太久没有学数学了，折磨简单的问题我现在也没有办法一下子回答上来，在这里简单做下记录。

刚才回回到家，灵光一现发现，我要证明上面的等式是否成立很困难，但是我要证明这个等式不相等的话就很简单，直接带入一些数字就能够直接推翻这个等式。
假如 a=1, b=2, c=3, d=4
$$
(1/2) + (3/4) = 5/4
$$

$$
(1+2)/(3+4) = 3/7
$$

我们很容易的就发现这两个等式的结果是不一样的，也间接的表明上方等式不成立。

