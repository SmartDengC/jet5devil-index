---
title: Iterm2配置主题和Oh-My-Zsh
author: 邓聪的小破站
createTime: 2024/07/14 17:12:12
permalink: /notes/n75otk8a/
tags: 
  - iterm2
  - dracula
  - oh-my-zsh
---


在mac上，一直实用的是iterm2，简单记录一下配置新的iterm2的一个过程，主要是dracula的主题和Oh-my-zsh的bash环境。

<!-- more -->

## 一、配置主题

进到dracula的[官方网站](https://draculatheme.com/iterm)，往下滑就可以看到具体的一个安装步骤。

### 1.1 安装使用git

If you are a git user, you can install the theme and keep up to date by cloning the repo:

如果你是一个git用户，你可以安装主题并通过clone repo来保持更新

```
git clone https://github.com/dracula/iterm.git
```

### 1.2 安装手册

Download using the [GitHub`.zip`download](https://github.com/dracula/iterm/archive/master.zip) option and unzip them.

通过github下载zip的文件，然后解压它

#### Activating theme

启用主题

1. *iTerm2 > Preferences > Profiles > Colors Tab*;  // 配置的路径
2. Open the *Color Presets...* drop-down in the bottom right corner;  // 打开Color Presets 然后往下滑
3. Select *Import...* from the list;  // 选择导入
4. Select the `Dracula.itermcolors` file;  // 然后选择刚才下载下来的文件中的Dracula.itermcolors文件
5. Select the *Dracula* from *Color Presets...*. 💜。// 然后选择Dracula

## 二、配置oh-my-zsh

[Oh-my-zsh官网](https://ohmyz.sh/#install)

还是去到官网，点击install oh-my-zsh， 就会看到下面的命令， 随便执行一个就行。

:::code-tabs
@tab Install oh-my-zsh via curl

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

@tab Install oh-my-zsh via wget

```bash
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

::: 

https://github.com/sirius1024/iterm2-with-oh-my-zsh?tab=readme-ov-file

### oh-my-zsh插件

- autojump

- Zsh-syntax-highlighting

  - ```bash
    cd ~/.oh-my-zsh/custom/plugins/
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
    vi ~/.zshrc
    ```

  - 确保zsh-syntax-highlighting是最后一个

  - ```bash
    plugins=(
    	git
    	zsh-syntax-highlighting
    )
    ```

  - source 

- git

- Zsh-autosuggestions

  - ```bash
    cd ~/.oh-my-zsh/custom/plugins/
    git clone https://github.com/zsh-users/zsh-autosuggestions
    vi ~/.zshrc
    ```

  - ```bash
    plugins=(
    	git
    	zsh-syntax-highlighting
    	zsh-autosuggestions
    )
    ```

- extract

- Colored-man-pages

- cp

- Zsh-completions

### oh-my-zsh主题 [Zsh](http://zsh.org/)

[dracula zsh](https://draculatheme.com/zsh)

#### Install using Git

If you are a git user, you can install the theme and keep up to date by cloning the repo:

```
git clone https://github.com/dracula/zsh.git
```

And creating a symbolic link to [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh/)'s theme folder:

```
ln -s $DRACULA_THEME/dracula.zsh-theme $OH_MY_ZSH/themes/dracula.zsh-theme
```

*P.S.: Remember that you should replace `$DRACULA_THEME` and `$OH_MY_ZSH` with the actual directories for this command to work.*

#### Install manually

1. Download using the [GitHub .zip download](https://github.com/dracula/zsh/archive/master.zip) option and unzip them.
2. Move `dracula.zsh-theme` file to [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh/)'s theme folder: `oh-my-zsh/themes/dracula.zsh-theme`.
3. Move `/lib` to [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh/)'s theme folder: `oh-my-zsh/themes/lib`.

#### Activating theme

Go to your `~/.zshrc` file and set `ZSH_THEME="dracula"`.

#### Install using [zplug](https://github.com/zplug/zplug)

Just add `zplug "dracula/zsh", as:theme` to your `~/.zshrc` file.