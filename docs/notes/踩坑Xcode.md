mac上不知咋，就出现了问题。

Svn 就用不了了

```
svn: E200029: Couldn't perform atomic initialization
svn: E200030: SQLite 编译为 3.39.5，但是运行于 3.39.4
```

大概的意思就是编译是一个版本，运行是另外一个版本，版本不匹配

```
brew update
brew reinstall sqlite svn --build-from-source
```

但是执行出来又是需要xcode command line



```
==> Reinstalling sqlite
Error: Xcode alone is not sufficient on Ventura.
Install the Command Line Tools:
  xcode-select --install
```



然后就是死活登陆不上苹果的developer网站，最后看到这篇文章。

[登陆apple developer出现 您的apple ID 暂时不符合使用此应用程序的条件](https://blog.csdn.net/qq_34081968/article/details/109518918)

然后就是用新邮箱注册了一个新账号，然后登陆上了。

[苹果开发者官网的下载专区](https://developer.apple.com/download/all/)





[develop.apple.com](https://developer.apple.com/)





```
(base) ➜ sqlite-autoconf-3460100 brew uninstall sqlite
Error: Refusing to uninstall /usr/local/Cellar/sqlite/3.46.1
because it is required by docutils, php, python@3.10, python@3.12, python@3.13, python@3.9 and scons, which are currently installed.
You can override this and force removal with:
  brew uninstall --ignore-dependencies sqlite
(base) ➜ sqlite-autoconf-3460100 brew uninstall --ignore-dependencies sqlite
Uninstalling /usr/local/Cellar/sqlite/3.46.1... (12 files, 4.8MB)
```



最后还是没有解决，从13.0的版本升级到了13.7的版本，竟然就好了。

Sqlite3 的版本变成了

```
(base) ➜ Downloads sqlite3 --version
3.39.5 2022-10-14 20:58:05 554764a6e721fab307c63a4f98cd958c8428a5d9d8edfde951858d6fd02daapl
```

