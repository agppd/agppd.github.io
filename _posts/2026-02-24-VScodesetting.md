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

~~话说，我现在才说是不是有点坑人~~



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