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

## 获取C++编译器（如果你已经拥有，直接跳过）

在[MSYS2官网](https://www.msys2.org/)进行下载，有时，下载会很慢，所以我们常使用[清华源](https://mirrors.tuna.tsinghua.edu.cn/msys2/distrib/msys2-x86_64-latest.exe)进行下载

安装时，先断网，然后再开始下载

为了方便，我们后记安装路径为 `MSYS2_PATH` 

进入 `MA