---
title: Linux命令大全，从入门到放弃
createTime: 2025/08/12 10:15:43
permalink: /article/c4rxpuzv/
cover: /cover/linux-index-cn.png
outline: [2,4]
tags:
- linux
---

记录学习Linux的命令，以及在工作中，“兼职”运维人员过程中学到的管理Linux的知识。

<!-- more -->

Linux 快速入门包括基本操作如文件管理、权限设置、用户管理、软件安装和系统监控。掌握常用命令，如 `ls`、`cd`、`cp`、`rm`、`ps` 等，可以帮助用户高效使用 Linux 系统，提升操作和管理能力。

## 一、搜索篇

### 1.1、find

今天就简单的聊一下find这个命令在日常工作中的一些简单用途

- 磁盘占用100%时查找占用空间比较大的文件（这个也是我常用的）
- 在目录下找到指定内容的文件

**磁盘占用100%时查找占用空间比较大的文件？**

其实很多时候，你需要了解的当前系统下存在哪些大文件，如果超多 1G 或者 100M 的文件；那么如何把这些大文件搜索出来呢？下面命令我们只能看到超过 800M 大小的文件名称，如果我们需要对查找的结果按照文件的大小排序，那么可以使用下面命令：  
`find . -type f -size +800M -print0 | xargs -0 du -h | sort -nr`

**find -print0 和 xargs -0 原理及用法**

我们为什么要配套使用 `-print0` 和 `xargs -0`?

 有些文件名称中间是带有空格的，这样的话原本的find就会看成是两个文件，但是它是一个文件。

```shell
(base) ➜ a find . -name '*.log'
./file a.log
(base) ➜ a find . -name '*.log'  | xargs rm
rm: ./file: No such file or directory
rm: a.log: No such file or directory
(base) ➜ a find . -name '*.log'  -print0 | xargs -0 rm
```

我们单独使用find的时候，find会在输出的每一条结果后面加一个`\n`，就是加一个换行符，这样我们看到的才是一行一行的，比如这样：

```shell
(base) ➜ guide (dev0) ✗ find . -name '*' -type f
./ubuntu系统创建用户及赋予权限.md
./2024-3-21-整合三个项目的过程和思路.md
```

但是这样我们不好处理，所以使用`-print0`将输出的内容置换到一行，本质上`-print0`是在每一行后面添加NULL字符，而不是换行符：

```shell
(base) ➜ guide (dev0) ✗ find . -name '*' -type f -print0
./ubuntu系统创建用户及赋予权限.md./2024-3-21-整合三个项目的过程和思路.md
```

然后`xargs -0` 表示 xargs 用 NULL 来作为分隔符。这样前后搭配就不会出现空格和换行符的错误。选择 NULL 作为分隔符，是因为一般编程语言把 NULL 作为字符串结束的标志，所以文件不可能以 NULL 结尾，这样确保万无一失。

**如何查找 Linux 下的大目录**

有的时候我们需要看下那个目录占用的总空间大， 我们用 `ls -alh` 只能看到当前一层的大小，我们可以用 du 来实现， 这里有一个--max-depth 的参数，就是只输出一层记录：`du -h --max-depth=1`
如果想要排序可以加上 sort -n 的参数， 例如`du -h --max-depth=1 | sort -nr `  r表示从小到大输出

**在目录下找到指定内容的文件**

这个时候我们需要在文件的内部进行搜索，这个使用使用find就很好。

`find ./ -name '*' -type f | xargs grep "hello world"`

大概得意思就是搜索当前目录下，类型是文件的所有文件，输出包含hello world文本的文件。

**find 扩展说明**

```shell
# 在某个路径下查找文件。在/etc下查找'*.log'的文件
find /etc -name '*.log'
# 扩展：列出某个路径下所有的文件，包括子目录
find /etc -name '*'
# find 使用正则表达式
find ./ -name '[a-z][0-9].log'
find ./ -type d(f)
find ./ -size +800M
```

## 二、文本处理篇

### 2.1、grep 

三剑客的功能非常强大，我们只需要掌握它们分别擅长的领域即可：**grep擅长查找，sed擅长取行和替换，awk擅长取列。**

计划将时间拉长来学习这三个命令，从今天7月8号开始。

推荐阅读的文章： [玩转文本三剑客：grep/sed/AWK的高效用法和实战技巧](https://mp.weixin.qq.com/s/nro1cS7Fj1FM6qmTC0k0GA) 

grep（global regular expression）命令用于**查找文件**里面**符合条件**的**字符串或者正则表达式**。

grep指令用于查找内容包含指定的范本样式的文件，如果发现某文件的内容符合所指定的范本样式，预设grep指令会把含有范本样式的那一列显示出来。若不指定任何文件名，或是所给予的文件名为-， 则grep指令会从标准输入设备读取数据。

**命令**

:::details

-d<动作>： 当指定要查找的是目录而非文件的时候，必须使用这项参数，否则grep指令将回报信息并停止动作。

-r：此参数的效果和指定“-d recurse”参数相同。

-n：显示匹配行的行号。

-B：除了显示符合样式的那一行之外，并显示该行之前的内容。

-c：计算符合样式的列数， 如果有\n将字符串换行，将会多算一个。

-C： 除了显示匹配指定模式的行之外，还会显示该行之前和之后的如果干行。

-e：指定字符串做为查找文件内容的样式。`grep -e '^hello' file.txt`

-E：启用正则表达式

-i：查找不区分大小写`grep -i "hellO" file.txt`

-w：只显示全字符合的列，就是全部匹配才算

-n：在显示符合样式的那一行的同时，输入该行的列数编号。

-l：输入匹配上的文件的文件名称

:::

**实例**

1 在文件file.txt中查找字符串hello， 并打印匹配的行：

```bash
grep hello file.txt
```

2 在文件夹dir中递归查找所有文件中匹配正则表达式“pattern”的行，并打印匹配行所在的文件名和行号：

```bash
grep -r -n pattern dir/
```

3 在标准输入中查找字符串“world”， 并只打印匹配的行数：

```bash
echo "hello world" | grep -c world
```

4 在当前目录中，查找后缀有file字样的文件中包含test字符串的文件，并打印出该字符串的行;

```bash
grep test *file 
```

5 以递归的方式查找符合条件的文件。例如，查找指定目录/etc/acpi及其子目录下所有文件中包含字符串“update”的文件，并打印出该字符串所在的内容；

```bash
grep -r update /etc/acpi
```

6 在文件内容查找与正则表达式匹配的行：

```bash
grep -e '正则表达式' 文件名
grep -e "apple" -e "banana" file.txt // 查找包含apple或者banana的行
grep -e "^hello" -e "world\$" file.txt  // 查找以hello开头或者world结尾的内容
```

7 从根目录开始查找所有扩展名为.log的文本文件，并找到包含ERROR的行：

```bash
find / -type f -name "*.log" | xargs grep "ERROR"  // -type 表示类型， -name 名字
```

**这里为什要用xargs？** 第一因为有些命名不是从标注输入获取的数据源。参考：[Linux xargs命令的理解和使用](https://blog.csdn.net/lujian1989/article/details/91986298) 

我们看两个例子

```bash
(base) ➜ jet5devil-index (dev0) ✗ echo '--help' | cat
--help
(base) ➜ jet5devil-index (dev0) ✗ echo '--help' | xargs cat
cat: illegal option -- -
usage: cat [-belnstuv] [file ...]
```

对于第一个命令就是说，echo的内容当作了cat处理的文件内容；简单来理解就是，有一个文件 tmp.txt，它的内容及时--help

第二个的话，就是吧--help做为cat的一个命令参数来运行

场景

1 系统报警显示了时间，但是日志文件太大了无法直接cat查看。（查询含有特定文本的文件，并拿到这些文本所在的行）。

```bash
grep -n '2024-07-08 00:01:11' *.log
```

2 获取到错误信息的行数，需要输出上下20行的内容

```bash
grep -C 20 'hello world' *.log
```

### 2.2、awk

awk是一种处理文本文件的语言，是一个强大的文本分析工具。

语法

 ```bash
awk options 'pattern {action}' file
 ```

- Options： 是一些选项，用于控制awk行为
  - -F：指定输入字段分隔符，默认是空格；例如： `awk -F ':' '{print $1}' demo.txt`， -F后面的分隔符可以不用单引号包，可以直接 `-F:`
  - -v <变量名>=<值>：设置awk内部的变量
  - -f：
  - -v：显示awk的版本信息
  - -h：显示awk的帮助信息

- pattern：用于匹配输入数据的模式。如果省略，则awk将对所有行进行操作
- {action}：是在匹配到模式的行上执行的动作，如果省略，则默认动作是打印整行

实例

```bash
awk '{print $0}' demo.txt
```

上面实例，de mo.txt是awk要处理的文件，前面单引号内部有一个大括号，里面就是每一行处理的动作print $0, 其中，print是打印命令，\$0代表当前行，因此上面的命令执行的结果就是把每一行原样打印出来。

```bash
echo 'this is a test' | awk '{print $0}'  // 输出 this is a test
echo 'this is a test' | awk '{print $1}'  // 输出 this
```

awk会根据空格和制表符，将每一行分成若干字段，一次用\$1, \$2, \$3 代表第一个字段，第二个字段，第三个字段等等。

变量

变量NF表示当前有多少个字段，因此\$NF就代表最后一个字段。

```bash
echo 'this is a test' | awk '{print $NF}'  // 输入 test
```

$(NF-1)就表示倒数第二个字段，下面print命令里面的都好，表示输出的时候，两个部分之间使用空格分开。

```bash
awk -F ':' '{print $1, $(NF-1)}' demo.txt
```

变量NR表示当前处理的是第几行。

```bash
awk -F ':' '{print NR ")" $1}' demo.txt  // 输出行数 + ) + 第一个字段
```

awk的其他内置变量如下：（需要区分大小写）

- FILENAME： 当前文件名
- FS：字段分隔符，默认是空格和制表符
- RS：行分隔符，用于分隔每一行，默认是换行符
- OFS：输出字段分隔符
- ORS：输出记录分隔符
- OFMT：输出输出的格式，默认为%.6g

函数

awk还提供了一些内置函数，方便对原始数据处理。

```bash
awk -F ':' '{print toupper($1)}' demo.txt  // toupper() 将字符转为大写
```

其他常用函数：

- `tolower()`： 字符串转为小写
- `length()`：返回字符串长度 `awk 'length>3' log.txt`
- `substr()`：返回子字符串
- `sin()`：正弦
- `cos()`：余弦
- `sqrt()`：平方根
- `rand()`：随机数

条件

awk允许指定输入条件，结果只输入满足条件的行。`awk '条件 动作' 文件名`

```bash
awk -F ':' '/usr/ {print $1}' demo.txt  // print前面是一个正则表达式，只输出usr的行
awk -F ':' 'NR % 2 == 1 {print $1}' demo.txt  // 只输出奇数行， 这里NR % 2 == 就是选择奇数行
awk -F ':' 'NR > 3 {print $1}' demo.txt  // 只输出行数大于三的行
awk -F ':' '$1 == "root" {print $0}' demo.txt  // 只输出第一个字段是root的行
awk -F ':' '$1 == "root" || $1 == "bin" {print $0}' demo.txt // 输出第一个字段是root或者是bin的行
```

IF语句

awk提供if语句，用于编写复杂的的条件

```bash
awk -F ':' '{if($1 > "a") print $0}' demo.txt  // 输出第一个字段第一个字符大于a的行
awk -F ':' '{if($1 > "a") print $1; else print "---"}' demo.txt  // 使用if else语句
```

扩展

1计算当前文件夹下面所有`*.log`文件的大小， `ls -l *.txt | awk '{sum += $5} END {print sum}'`

### 2.3、sed

参考：[Linux | sed文本处理，从入门到精通，看这一篇就够了](https://blog.csdn.net/m0_59388634/article/details/122047377)

Linux sed 命令是利用脚本来处理文本文件， sed可依照脚本的指令来处理/编辑文本文件，主要用来自动编辑一个或者多个文件/简化对文件的反复操作/便携转换程序。

对于sed命令，他不会修改原始文件的内容，是将原始文件内容做处理之后输出出来。

语法

参数说明

:::details

sed [-hnv] \[-e\<script\>\]\[-f\<script文件>][文本文件]

-e\<script> 指定script的来处理输入的文本文件。

-f\<script文件> 指定script文件来处理输入的文本文件。

-h 帮助

-n 仅展示script处理后的结果， 只显示匹配并处理过的行（就是说只展示处理的行，没处理的行就不展示）

:::

```bash
sed -n '5p' demo.txt  // 展示第五行
sed -n '1,5p' demo.txt  // 展示第1到第5行
sed -n '1p;5p' demo.txt  // 展示第一行和第五行
sed -n '5, 100!p' demo.txt // 取反 取第1行到第4行
sed -n '2, +2p' demo.txt  // 显示第2行和其后面的两行
sed -n '$p' demo.txt // 展示最后一行
sed -n '1~3p' demo.txt // 从第一行起，每件个3行输出一行
```

-V 显示版本信息

-r 表示启用扩展正则表达式，`echo "123abc" | sed -r 's/[0-9]+/num/'` -> numabc

动作说明

a 新增， a的后面可以接字符串，这些字串会在新的一行出现，目前是下一行。

c 取代， c的后面可以接字串， 

d 删除，因为是删除，所以d后面不接任何东西。

i 插入， i后面可以接字串，会在新的一行出现，目前是上一行。

p 打印

s 取代， 可以直接进行取代的工作。s可以搭配正则表达式，例如 1,20s/old/new/g 

实例

sed命令将所有的空格换成等于=， `sed 's/ /=/g' example.txt`

将数字换成字母d ， `sed 's/[0-9]/d/g' example.txt`

原始文件：

```bash
(base) ➜ github cat demo.txt
Linux
Solaris
Ubuntu
Fedora
RedHat
```

删除所有的字母a。`sed 's/a//g' demo.txt`， 删除掉第一个字母 a `sed 's/a//' demo.txt`， g表示global的意思，如果带上这个参数就是对所有匹配上的内容使用。

2 移除每一行的第一个字母  `sed 's/^.//' demo.txt` ， `.`表示匹配一个字符，`^`表示以什么开头的意思； `sed 's/.//' demo.txt`也可以达到相同的效果，因为sed是从头开始匹配的。

3 移除每一行的最后一个字母 `sed 's/.$//' demo.txt`， `$`会匹配每一行的结尾。

4 同时移除每一行开头第一个字母和结尾第一个字母 `sed 's/.//;s/.$//' demo.txt`， sed命令结合多个操作指令时，每个指令通过 `;` 分隔。

5 删除每一行的第一个到第n个字符 `sed -r 's/.{4}//' demo.txt` `.{n}`匹配n次一个任意的字符。

## 三、系统防护篇

### 3.1、iptables

Linux 中，`iptables` 和 `firewalld` 是常用的防火墙管理工具。`iptables` 提供基于规则的网络流量控制，而 `firewalld` 提供更加简洁和动态的防火墙管理方式，支持区域和服务配置，适合不同的网络安全需求。

今天遇到一个线上的问题，就是某一个ip连接数据库的时候，占用了很多的数据库连接，需要控制这个ip对数据库的连接。

开始想的就是通过防火墙，把这个ip墙掉。

后面是通过pg库修改ip的最大链接数，这里还是扩展记录一下linux的防火墙命令的使用。

```sql
ALTER USER "test" CONNECTION LIMIT 100;  -- 修改某个用户的连接数，开始的时候用户没有加双引号，找不到用户
SELECT rolconnlimit FROM pg_roles WHERE rolname = 'test';  -- 查看用户的连接数
```

查看是否安装了iptables

```
which iptables
whereis iptables
```

iptables相关命令：

```shell
iptables -L //查看现有的规则，-L是列出当前规则的参数，默认显示规则连

iptables -A INPUT -s ip地址  -j DROP
```

### 3.2、firewalld

查看防火墙状态

```
systemctl status firewalld 
# 或
firewall-cmd --state
```

[Linux查看防火墙状态及开启关闭命令](https://blog.csdn.net/qq_36640713/article/details/106553833)

### 3.3、top

今天在处理线上CPU占满问题的时候，常常会用到top这个命令来排查占用CPU多的线程信息，top也是每个linux系统中自带的命令，想htop有的系统是不自带的，还需要安装，就比较麻烦了。

top命令的使用还是很简单的，直接输入top命令，我们来看一下输出的信息。

```
top - 19:06:42 up 286 days,  3:40,  1 user,  load average: 1.88, 1.64, 1.60
Tasks: 118 total,   1 running,  73 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.5 us,  0.7 sy,  0.0 ni, 98.2 id,  0.5 wa,  0.0 hi,  0.2 si,  0.0 st
KiB Mem :  3514912 total,   622140 free,   696100 used,  2196672 buff/cache
KiB Swap:        0 total,        0 free,        0 used.  2526276 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                                                                                                                                                                                                  
13684 root      20   0  731688  25652   4700 S   1.7  0.7 594:47.21 barad_agent                                                                                                                                                                                                              
 2715 root      20   0       0      0      0 I   0.3  0.0   0:00.01 kworker/u4:1                                                                                                                                                                                                             
13683 root      20   0   66544  12520   4012 S   0.3  0.4  70:17.24 barad_agent                                                                                                                                                                                                              
20679 root      20   0  435560  47672   8180 S   0.3  1.4 108:23.73 uvicorn                                                                                                                                                                                                                  
29769 root      20   0 1125708 190124  22808 S   0.3  5.4 523:08.53 YDService
```

`top - 19:06:42 up 286 days`：表示系统启动了多久

`load average: 1.88, 1.64, 1.60`：表示1分钟，5分钟，10分钟的平均负载。

`Tasks: 118 total,   1 running,  73 sleeping,   0 stopped,   0 zombie`：表示任务情况，zombie表示僵尸进程。

`%Cpu(s):  0.5 us,  0.7 sy, 0.5 wa`：主要就关注这三个，us表示用户占用的cpu，sy表示系统占用的cpu，wa表示等待输入输出的cpu占用。

`KiB Mem :  3514912 total,   622140 free,   696100 used,  2196672 buff/cache`： 下面就是内存情况，total总物理内存，free表示空闲的，used表示使用的，buff表示缓存的内存量。

`top -c` 根据cpu的使用情况排序

`strace -p pid`

`perf top -p pid`

进入到top之后，键入"1" 查看每个CPU的使用情况。

## 四、统计篇

### 4.1、wc

Linux 中，`wc` 命令用于统计文件或标准输入的字数、行数、字符数等信息。通过与管道结合使用，可以快速分析文本文件的内容，常用于文本处理和数据分析中。

在linux中，wc（word count）命令常用于计算文件的行数、字数和字节数，日常操作以及脚本编程中经常使用到。

1.1、常用参数

:::details

-l，--lines：显示行数

-w，--words：显示字数

-m，--chars：显示字符数

-c，--bytes：显示字节数

-L，--max-line-length： 显示最长行的长度

:::

1.2、不带参数

```shell
(base) ➜ gitee wc a.txt
     204     695    6286 a.txt
```

输出包含四项，分别代表：行数、字数、字节数、文件

1.3、带参数

计算行数：

```shell
(base) ➜ gitee wc -l a.txt
     204 a.txt
```

计算字数：

```shell
(base) ➜ gitee wc -w a.txt
     695 a.txt
```

计算字符数：

```shell
(base) ➜ gitee wc -m a.txt
    6286 a.txt
```

计算最长行：

```shell
(base) ➜ gitee wc -L a.txt
     160 a.txt
```

### 4.2、head

Linux head命令用于查看文件的开头部分的内容，有一个常用的参数-n用于显示行数，默认为10，即显示10行的内容。

2.1、基本参数

- -q 隐藏文件名
- -v 显示文件名
- -c<数目> 显示的字节数
- -n<行数> 显示的行数

```shell
head a.txt  // 显示文件前10行
head -n 10 a.txt // 如上
head -n 5 a.txt  // 显示文件前5行
```

2.2、配合管道符使用

```shell
ls | head -2  // 查看当前文件下前两个文件
```

### 4.3、sort

Linux sort命令用于将文本文件内容加以排序，sort可针对文本文件的内容，以行为单位来排序。

3.1、参数说明

- -n 依照数值的大小排序
- -r以相反的顺序来排序

```shell
sort a.txt
sort -nr a.txt
```

3.2、管道符

```shell
ls | sort -nr
```

### 4.4、du

Linux du（disk usage）命令用于显示目录或者文件的大小，du会显示指定的目录或文件所占用的磁盘空间。

下面列举几个工作中常用的参数：

- -h， 以K、M、G为单位，提高信息的可读性
- -s，仅显示指定目录或文件的总大小，而不显示其子目录的大小。
- --max-depth=\<目录层数>，超过指定层数的目录后，予以忽略。

```shell
// 查看某一文件夹的大小
du -sh directoryname 
// 查看某个文件夹及其子目录的大小，mac使用 -d 1 来表示--max-depth=1
du -h --max-depth=1 directoryname 
```

## 五、网络篇

### 5.1、curl

`wget`和`curl`是linux下常用的命令行工具。`wget`用于从网络上下载文件，支持断点续传；而`curl`是一个用于数据传输的工具，支持多种协议，功能更为灵活，适合用于API调用和复杂的HTTP请求操作。

其次在代码开发过程中，难免会遇到在服务器上面请求接口的时候，掌握使用post、get的请求方式就很重要。

<!-- more -->

[Linux curl命令最全详解](https://blog.csdn.net/wuhuagu_wuhuaguo/article/details/90764856#t0)

1.1、curl操作get、post

1.1.1、get请求

```shell
curl https://www.baidu.com/  # 如果这里的url指向一个文件或者一副图可以直接下载到本地
curl -i https://www.baidu.com/  # 显示全部信息
curl -I https://www.baidu.com/  # 只显示头部信息
curl -v https://www.baidu.com/ # 显示get请求全过程解析

curl -H "token: _token" https://www.baidu.com/ # 添加请求头
```

1.1.2、post请求

```shell
curl -X POST https://your-api-endpoint.com \
-H "Content-Type: application/json" \
-d '{
    "start_month": "2024-01",
    "end_month": "2024-05",
    "body": [
        {
            "dept": "HZ",
            "time": "2024年01月",
            "value": 18420.9,
            "energy": "水"
        }
    ]
}'
```

- -X post 请求方式
- -H 请求头
- -d 参数

### 5.2、wget

2.1、wget命令的基础用法

```
wget [选项] [URL]

# URL是要下载的文件地址
```

常用的选项说明：

- -c：继续下载中断的文件，支持断点续传
- -O 文件名：将下载的文件保存为指定的文件名
- -P 目录：将下载的文件保存到指定的目录
- -b：后台下载，将下载任务放到后台执行
- -q：静默模式，减少输出信息
- -v：详细模式，增加输出信息
- -h：显示帮助信息
- -y：在执行操作时自动回答yes

2.2、wget实现get、post调用

2.2.1、get请求

wget会将url的内容存入文件

```shell
wget https://www.baidu.com/  # 默认文件名
wget https://www.baidu.com/ -P aimPath -O fileName   # 指定存放的路径和文件名
wget --header="token: _token" https://www.baidu.com/  # get请求添加请求头
```

2.2.2、post请求

```shell
wget --post-data 'user=foo&password=bar' http://www.baidu.com
```

2.3、相关例子

2.3.1、密码和认证

wget只能处理利用用户名/密码方式限制访问的网站，可以利用下面两个参数：

- --http-user=USERNAME // 设置HTTP用户
- --http-passwd=PASSWD  // 设置HTTP密码

对于需要证书做认证的网站，只能利用其他下载工具，例如curl。

## 六、压缩篇

### 6.1、zip

zip命令最简单的使用方法就是：

```shell
zip archive.zip file.txt  // 压缩单个文件
zip archive.zip file1.txt file2.txt // 压缩多个文件
```

下面简单举几个例子说明

```shell
zip -r archive.zip dir_name  // 压缩一个目录以及所有的子目录文件
```

- -r：递归压缩文件夹

```shell
zip -r archive.zip dir_name -x "*.log"  // 压缩dir_name目录下除了以log结尾的文件
```

- -x：排除文件（不压缩进去）

```shell
zip -u archive.zip file.txt  // 更新压缩文件，将file.txt压缩到archive.zip文件下
zip -r elm_model.zip elm_model -x 'elm_model/.venv/*'
```

- -u：更新压缩文件

```shell
zip -l archive.zip // 查看压缩文件的内容
```

- -l：列出文件内容

```shell
zip -9 archive.zip file.txt file.txt // 指定压缩级别，-0为无压缩，-9为最高压缩
```

- -0：无压缩
- -9：最高压缩

```shell
zip -qm dist.zip dist
```

- -q：表示quiet，即静默模式，执行压缩时不会显示额外的输出信息，只有在错误时才会显示信息
- -m：表示move，将原始文件移动到压缩文件中，而不是仅仅复制，这意味这压缩文件会包含所有文件的内容，但原始文件会被删除。

### 6.2、unzip

unzip解压zip文件的命令

```shell
unzip archive.zip // 解压到当前文件
unzip -d /tmp archive.zip // 解压到指定目录/tmp下面
```

- -d：指定将解压后的文件存放目录

```shell
unzip -n -d /tmp archive.zip // -n 表示不覆盖存在的命令
```

- -n：不覆盖存在的文件

```shell
unzip -l archive.zip  // 查看一下压缩文件里面有哪些文件，不解压
```

- -l：列出文件内容

```shell
unzip -t archive.zip // 查看压缩文件是否受损
```

- -t：检查文件是否受损

```shell
unzip -o -d /tmp archive.zip // 将文件解压到/tmp目录，如果存在相同文件，要求覆盖存在的文件
```

- -o：覆盖存在的文件

## 七、基础业务

### 2.1、Linux用户组相关

```shell
groupadd test # 创建组
usermod -aG docker $USER  # 修改用户组
```

### 2.2、新建的用户授予root权限

```shell
# 修改/etc/sudoers为可编辑
chmod -v u+w /etc/sudoers

# vim /etc/sudoers, 修改文件内容，NOPASSWD表示在使用sudo的时候不用输密码
test ALL=(ALL)       NOPASSWD:ALL

# 将文件修改成只读
chmod -v u-w /etc/sudoers
```

[修改用户为root权限](https://blog.csdn.net/wngpenghao/article/details/105568894)

### 2.3、修改文件、文件夹的所有者

```sh
chown newuser filename
chown newuser directoryname  # 只修改directoryname这一个文件的拥有者
chown -R newuser directoryname  # 修改directoryname文件夹及其下所有文件的拥有者
```



