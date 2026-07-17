---
layout: post
title: "非递归线段树"
date: 2026-07-17
categories: [数据结构,工程]
author: agppd
---

<h4><center><font color="red"> 实际开发的可以跳过本文章，如果你执意要读，请看文末 </font></center></h4>

## 写在前面

实际上，非递归版本就是模拟了**栈**

## 一、记号与数据结构定义

我们定义原始数组为 $A[0..n-1]$。定义一个结合律运算 $\oplus$（例如求和 $\sum$、最大值 $\max$、最小值 $\min$），并定义单位元 $I$（求和为 $0$，最大值为 $-\infty$）。

在非递归实现中，我们强制将原数组补全至一颗**完美二叉树**。令 $N$ 为最小的 $2$ 的幂，且 $N \ge n$。

> 声明数组 $T[1..2N-1]$。树根为 $T[1]$，节点 $i$ 的左儿子为 $2i$，右儿子为 $2i+1$。叶子节点位于 $T[N .. N+n-1]$，多余叶子 $T[N+n .. 2N-1]$ 填充为 $I$。

## 二、建树

### 递归版本
递归采用**分治**：先处理左右子树，再将结果合并（后序遍历）。

<pre><code class="language-pseudocode">
\begin{algorithmic}[1]
\Require $A[0..n-1]$，当前节点编号 $p$，区间 $[l, r]$
\Ensure 填充 $T[p]$ 的值
\If{$l = r$}
    \State $T[p] \gets A[l]$
    \State \Return
\EndIf
\State $mid \gets \lfloor (l+r)/2 \rfloor$
\State \textsc{Build}$(2p, l, mid)$
\State \textsc{Build}$(2p+1, mid+1, r)$
\State $T[p] \gets T[2p] \oplus T[2p+1]$ \Comment{合并左右子树}
\end{algorithmic}
</code></pre>

### 非递归版本
递归的回溯顺序是“先叶子，后根”。非递归把叶子先铺好，直接从最后一个内部节点（$N-1$）倒序遍历到 $1$，**恰好模拟了递归栈的回溯过程**。

<pre><code class="language-pseudocode">
\begin{algorithmic}[1]
\Require $A[0..n-1]$，运算 $\oplus$，单位元 $I$
\Ensure 数组 $T$ 与补全大小 $N$
\State $N \gets 1$
\While{$N < n$}
    \State $N \gets N \times 2$ \Comment{找到最小的 $2$ 的幂}
\EndWhile
\State 分配数组 $T[1..2N-1]$
\For{$i \gets 0$ \To $n-1$} \Comment{复制原始数据到叶子}
    \State $T[N+i] \gets A[i]$
\EndFor
\For{$i \gets n$ \To $N-1$} \Comment{多余叶子填单位元}
    \State $T[N+i] \gets I$
\EndFor
\For{$i \gets N-1$ \Downto $1$} \Comment{自底向上合并，逆序是精髓}
    \State $T[i] \gets T[2i] \oplus T[2i+1]$
\EndFor
\State \Return $(T, N)$
\end{algorithmic}
</code></pre>

> 递归中最后执行合并的是编号最大的内部节点（靠近叶子），非递归正好从 $N-1$ 开始倒序，保证任意节点 $i$ 的儿子 $2i, 2i+1$ 都大于 $i$，因此在访问 $i$ 时，儿子们已经更新完毕。

## 三、单点更新（Point Update）：从寻路到爬升

### 递归版本
递归找到叶子，修改后沿原路返回并合并。

<pre><code class="language-pseudocode">
\begin{algorithmic}[1]
\Require 当前节点区间 $[l, r]$，目标位置 $pos$，新值 $val$
\If{$l = r$}
    \State $T[p] \gets val$
    \State \Return
\EndIf
\State $mid \gets \lfloor (l+r)/2 \rfloor$
\If{$pos \le mid$}
    \State \textsc{Update}$(2p, l, mid, pos, val)$
\Else
    \State \textsc{Update}$(2p+1, mid+1, r, pos, val)$
\EndIf
\State $T[p] \gets T[2p] \oplus T[2p+1]$ \Comment{回溯合并}
\end{algorithmic}
</code></pre>

### 非递归版本
非递归不再递归下探，而是**直接跳转到叶子**（下标 $N+pos$），然后一路除以 $2$ 向上爬升，循环体内执行合并。

<pre><code class="language-pseudocode">
\begin{algorithmic}[1]
\Require $T, N$，目标位置 $pos$（$0$-based），新值 $val$
\Ensure 更新后的 $T$
\State $i \gets N + pos$
\State $T[i] \gets val$
\State $i \gets \lfloor i / 2 \rfloor$ \Comment{跳到父节点}
\While{$i \ge 1$}
    \State $T[i] \gets T[2i] \oplus T[2i+1]$
    \State $i \gets \lfloor i / 2 \rfloor$ \Comment{继续向上}
\EndWhile
\end{algorithmic}
</code></pre>

> 递归调用栈隐式保存了从根到叶的路径，非递归直接用 $i = \lfloor i/2 \rfloor$ 显式地“原路返回”。

## 四、区间查询

### 递归版本
递归判断当前节点区间是否被查询区间 $[L, R]$ 完全覆盖。

<pre><code class="language-pseudocode">
\begin{algorithmic}[1]
\Require 当前区间 $[l, r]$，目标区间 $[L, R]$
\Ensure 区间合并结果 $res$
\If{$L \le l$ 且 $r \le R$} \Comment{完全包含}
    \State \Return $T[p]$
\EndIf
\State $mid \gets \lfloor (l+r)/2 \rfloor$
\State $res \gets I$
\If{$L \le mid$}
    \State $res \gets res \oplus \textsc{Query}(2p, l, mid, L, R)$
\EndIf
\If{$R > mid$}
    \State $res \gets res \oplus \textsc{Query}(2p+1, mid+1, r, L, R)$
\EndIf
\State \Return $res$
\end{algorithmic}
</code></pre>

### 非递归版本
将查询闭区间 $[L, R]$ 映射为叶子下标 $l = L+N$，$r = R+N$。我们不再关心节点代表的区间范围，而是利用**下标奇偶性**判断边界节点是左儿子还是右儿子：

- 若 $l$ 是右儿子（即 $l \bmod 2 = 1$），则其父节点区间会向左超出查询范围，不能取父节点，只能单独取 $T[l]$，并将 $l$ 右移一位。
- 若 $r$ 是左儿子（即 $r \bmod 2 = 0$），则其父节点区间会向右超出，单独取 $T[r]$，并将 $r$ 左移一位。

<pre><code class="language-pseudocode">
\begin{algorithmic}[1]
\Require $T, N$，查询区间 $[L, R]$（$0$-based，闭区间）
\Ensure 区间合并结果 $res$
\State $l \gets L + N$
\State $r \gets R + N$
\State $res \gets I$
\While{$l \le r$}
    \If{$l \bmod 2 = 1$} \Comment{$l$ 是右儿子，无法被父亲包含}
        \State $res \gets res \oplus T[l]$
        \State $l \gets l + 1$ \Comment{向右收缩}
    \EndIf
    \If{$r \bmod 2 = 0$} \Comment{$r$ 是左儿子，无法被父亲包含}
        \State $res \gets res \oplus T[r]$
        \State $r \gets r - 1$ \Comment{向左收缩}
    \EndIf
    \State $l \gets \lfloor l / 2 \rfloor$ \Comment{上升到父区间}
    \State $r \gets \lfloor r / 2 \rfloor$
\EndWhile
\State \Return $res$
\end{algorithmic}
</code></pre>

> - 递归中 $\text{Query}$ 命中“完全包含”时直接返回，非递归中当 $l$ 是右儿子（或 $r$ 是左儿子）时，**这两个节点恰好就是一个完全在目标区间内的“整块子树”**，其效果完全等价于递归中返回的那个 $T[p]$。
> - 递归通过函数参数 $[l, r]$ 隐式爬升，非递归通过 $l \gets \lfloor l/2 \rfloor, r \gets \lfloor r/2 \rfloor$ 显式爬升。

## 五、关于区间修改

### 递归版本的优势
递归是**自顶向下**，因此可以在进入子节点前轻松地将父节点的懒标记下传（**PushDown**），修改后再自底向上合并（**PushUp**）。这是递归线段树最能发挥优势的地方。

### 非递归版本的问题
非递归是**自底向上**的。当我们定位到需要修改的区间节点时，我们缺乏从根节点到该节点路径上的上下文，**无法执行向下的标记传递**。若强行实现，必须：
1. 计算出从根到目标叶子的路径序列。
2. 从根开始向下依次 **PushDown**。
3. 再进行自底向上的修改和 **PushUp**。

这会导致代码复杂度大幅增加，违背了非递归简洁的初衷。因此，若涉及区间修改与查询，选择递归版本；若仅为单点修改与区间查询，选择非递归版本。
