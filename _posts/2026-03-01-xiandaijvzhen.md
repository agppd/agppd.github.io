---
layout: post
title: "矩阵相关的算法优化"
date: 2026-03-01
categories: [理论,算法]
author: _endl_
---

这里就是有一点，做乘法的时候 j , k 反过来枚举会快一点。

[P3390【模板】矩阵快速幂](https://www.luogu.com.cn/problem/P3390)

矩阵快速幂。

### 矩阵加速

考虑一个 DP 式子: $dp_i=dp_{i-1}+dp_{i-2}$。

可以矩阵存一下$\begin{bmatrix} dp_{i-1} & dp_{i-2}  \end{bmatrix}$。然后让这个矩阵乘以$\begin{bmatrix} 1 & 1 \\1 & 0  \end{bmatrix}$，就可以得到$\begin{bmatrix} dp_{i} & dp_{i-1}  \end{bmatrix}$，然后$\begin{bmatrix} 1 & 1 \\1 & 0  \end{bmatrix}^{n-2} \times \begin{bmatrix} dp_{2} & dp_{1}  \end{bmatrix}$最后成出来的ans.mp[1][1]就是答案了。[P1962 斐波那契数列](https://www.luogu.com.cn/problem/P1962)。然后[P1939 矩阵加速（数列）](https://www.luogu.com.cn/problem/P1962)跟这个是差不多的。

一般就都是先想暴力dp，然后看这个式子怎么用矩阵加速。

### 定长最短路计数

给你一张图，问你走k步，从s到t最短路有多少种。

直接把图打到邻接矩阵，人家让你走多少步直接几次幂，答案就是ans.mp[s][t]。

### 定长最短路长度

给你一张图，问你走k步，从s到t最短路是多少。

考虑把矩阵改成加和取min来达到求最短路要求。因为矩乘满足结合律和分配律，min也满足结合律，然后也是人家让你走多少步直接几次幂，答案仍然是ans.mp[s][t]。

[P2886 [USACO07NOV] Cow Relays G](https://www.luogu.com.cn/problem/P2886)。这题要离散化一下点。

### 限长最短路计数

给你一张图，问你最多走k步，从s到t最短路有多少种。

给每一个点打一个边权为0的自环，然后按定长跑就好了。

### 限长最短路长度

给你一张图，问你最多走k步，从s到t最短路是多少。

![](https://cdn.luogu.com.cn/upload/image_hosting/xmgthjmx.png)
这个图画的太神秘了。

就是你给每一个点对应的给他自己i连向i+n，再让i+n自环。然后按定长做，有些细节不太一样。