---
layout: post
title: "VScode配置教程"
date: 2026-02-25
categories: 技术
author: agppd
---

大部分人入门一门语言大部分是通过IDE类的编译器入门的吧，显然，显示开发中，IDE的弊端明显（如：大部分IDE老旧，编译器更新困难），所以我们常使用文本编译器进行代码的编写，本文档主要讨论VScode的配置

## 准备工作

在[VScode官网](https://code.visualstudio.com/Download)进行下载VScode，下载完成后进行解压安装

## 获取C++编译器（如果你已经拥有，直接跳过，记C++编译器路径为 C_PATH ）

### Windows

在[MSYS2官网](https://www.msys2.org/)进行下载，有时，下载会很慢，所以我们常使用[清华源](https://mirrors.tuna.tsinghua.edu.cn/msys2/distrib/msys2-x86_64-latest.exe)进行下载

安装时，先断网，然后再开始下载

为了方便，我们后记安装路径为 `MSYS2_PATH` 

进入 `MAYS2_PATH` ，为了方便与统一，我们统一部署 `MINGW` ，双击 `MSYS MINGW64`，以后都在里面进行部署

先更新 `pacman` （ARCH系的包管理器）

```bash
pacman -Syu
```

大部分情况下需要关闭后重新更新，接着输入如下内容

```bash
pacman -Su
```

现在，就更新好了（类似于常见的 `apt audate` ）

为了后期部署项目方便，直接安装编译工具链

**64 位**

```bash
pacman -S mingw-w64-x86_64-toolchain
```

**32 位**

```bash
pacman -S mingw-w64-i686-toolchain
```

进入 `MAYS2_PATH` ，记里面的 `mingw32` 为 `C_PATH`

将 `C_PATH\bin` 添加到环境变量


在**管理员：命令提示符**中输入

```bash
setx /M PATH "%PATH%;C_PATH\bin"
```

然后输入如下命令进行重启电脑

```bash
shutdown -r -t 0
```

---

### Linux

这个还真是不太好整

就是各个系的Linux使用各自的包管理器安装编译工具链即可，然后什么都不用管了，记 `bin\gcc` 为 `C_PATH`

---

### 官网下载

~~话说，我如果都没有编译器我怎么编译源代码，但是这已经是最好的保存方法了~~

建议按照官网的方式去镜像站下载源代码压缩包

因为 `git clone` 太慢了，当然，源码不大，只有 `100多MB`

~~嗯………………？100多MB的纯代码？？？？？~~

```txt
Cloning into 'gcc'...
remote: Enumerating objects: 289437, done.
remote: Counting objects: 100% (289437/289437), done.
remote: Compressing objects: 100% (17036/17036), done.
Receiving objects:   0% (377/3333412), 220.01 KiB | 20.00 KiB/s
```

~~3333412，要命啊~~

注：你必须要有最基本的 `C/C++` 编译工具和部分依赖项，从而使得你可以进行编译

Q：我都有编译工具了，为什么还要这么整？
A：我们常用的 `C/C++` 是 `GUN C` 的内容，而 `GCC` 则是 `GNU Compiler Collection` 远不止 `C/C++` 的编译。 ~~虽然OIer下载就是为了C++~~

接下载，主要以 `Linux Debian/Ubuntu` 为例，进行处理，也会附带一些其他系统

#### 前情提要

先安装最基本的工具

**Debian/Ubuntu**  
```bash
sudo apt update
sudo apt install build-essential flex bison
```

**Red Hat/CentOS/Fedora**  
```bash
sudo yum groupinstall "Development Tools"
sudo yum install flex bison
# 或使用 dnf（Fedora）
sudo dnf groupinstall "Development Tools"
sudo dnf install flex bison
```

**macOS**（需安装 Xcode 命令行工具）  
```bash
xcode-select --install
# 然后通过 Homebrew 安装 flex、bison（可选）
brew install flex bison
```

然后访问 [GCC 官网](https://gcc.gnu.org/)，点击 **"Getting GCC"**，选择镜像站点下载最新稳定版源码包（如 `gcc-15.2.0.tar.gz`）。也可用 wget 直接下载：

```bash
wget https://ftp.gnu.org/gnu/gcc/gcc-15.2.0/gcc-15.2.0.tar.gz
# 或使用镜像，如国内镜像：
# wget https://mirrors.tuna.tsinghua.edu.cn/gnu/gcc/gcc-15.2.0/gcc-15.2.0.tar.gz
```

解压：
```bash
tar -xzf gcc-15.2.0.tar.gz
cd gcc-15.2.0
```

GCC 编译依赖 **GMP、MPFR、MPC** 三个数学库。源码目录下提供了便捷脚本 `./contrib/download_prerequisites` 自动下载并解压它们：

```bash
cd gcc-15.2.0
./contrib/download_prerequisites
```

如果网络问题导致下载失败，可手动下载对应包并解压到当前目录。脚本会创建软链接，确保配置时能找到

**重要**：不要在源码目录直接运行 `configure`，建议在源码目录外创建一个独立的构建目录，避免污染源码

```bash
cd gcc-15.2.0
mkdir build && cd build
```

运行 `configure` 脚本，指定安装路径（例如 `/usr/local/gcc-15.2.0`）和需要编译的语言（这里只编译 C 和 C++）：

```bash
../configure --prefix=/usr/local/gcc-15.2.0 \
             --enable-languages=c,c++ \
             --disable-multilib   # 如果不需要32位库，加上此选项可减少编译时间
```

其他常用选项：
- `--enable-checking=release`：禁用额外检查，优化性能。
- `--with-system-zlib`：使用系统 zlib（如果有）
- `--program-suffix=-15.2`：给生成的可执行文件添加后缀（如 `g++-15.2`），避免与系统自带的 g++ 冲突

完整选项可参考 [官方安装指南](https://gcc.gnu.org/install/configure.html)。

#### 编译

在 `build` 目录下执行：
```bash
make -j$(nproc)   # 使用所有 CPU 核心加速编译
```
- `$(nproc)` 返回 CPU 核心数，可根据机器负载调整，例如 `-j4`。
- 编译过程会输出大量信息，耐心等待。如果中途失败，可检查错误提示（通常是缺少依赖），然后重新运行 `make` 

如果实在看不懂提示，找 `AI` 吧，记得找个有深度思考能力的 `AI`

#### 安装

没啥可说的，就是正常安装

```bash
sudo make install
```

#### 设置环境变量

安装完成后，需要将新 GCC 的 `bin` 目录加入 `PATH`，并设置库路径以便系统找到动态库

编辑 shell 配置文件（如 `~/.bashrc` 或 `~/.zshrc`），添加：
```bash
export PATH=/usr/local/gcc-15.2.0/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/gcc-15.2.0/lib64:$LD_LIBRARY_PATH   # 64位系统通常为 lib64
export MANPATH=/usr/local/gcc-15.2.0/share/man:$MANPATH               # 可选，添加 man 手册
```
然后使配置生效：
```bash
source ~/.bashrc   # 或重新登录终端
```

然后，使用 `g++ --version` 验证安装

终于说完了！！！

---

## 配置VScode

### 配置C/C++

按下 `Ctrl + Shift + X` ，打开拓展，搜索 `C/C++` ，然后下载官方的插件，然后写一个 `Hello World!` ，如下

```cpp
#include<stdio.h>
#include<iostream>

int main(){
    std::cout<<"Hello World!";
    printf("Hello World!");int a,b;
    scanf("%d%d",&a,&b),std::cin>>a>>b;
    std::cout<<a+b;printf("%d",a+b);
}
```

如果此时VScode右上角出现小箭头（运行），那么就让它自己配置，然后就可以使用了  ~~本文完~~

如果失败了，在项目文件夹根目录下新建一个叫 `.vscode` 的文件夹，创建一个叫 `tasks.json` 的文件，按照如下格式编写（我们使用 `G++` ，愿意使用 `GCC + 参数` 的自行修改）

```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: g++.exe 生成活动文件",
            "command": "C_PATH\\g++.exe",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
                // 其实就是编译参数，每个后面要有英文逗号
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "调试器生成的任务。"
        }
    ]
}
```

Q：这样的可以编译中文文件吗？

A：分情况，VScode不行，命令行行（使用MINGW）

比如：

```bash
g++ -o run.exe 你好.cpp -g -Wall -std=c++17
```

就行，~~就是不知道终端里怎么输入中文~~

**如果，你使用的是你以前IDE的编译器，请自己在C/C++里添加头文件路径！！！否则VScode会无端报错**

### 推荐插件

其实，插件这个东西，应该自己玩，但是吧，我还是想说一下语言翻译插件

以中文为例：同 `C/C++` 插件的安装方式，搜 `Chinese` 然后下载

---

到此为止，VScode最基础的内容介绍完毕