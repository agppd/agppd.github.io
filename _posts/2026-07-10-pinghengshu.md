---
layout: post
title: "平衡树"
date: 2026-07-10
categories: [技术,工程,理论,数据结构]
author: agppd
---

**代码（包括伪代码）由DS生成**

**部分内容参考DS给出的理论与思路进行编写**

**关于术语：来自于CSDN**

# 第一部分 Splay

## 1. Splay 树的基本概念

### 1.1 二叉搜索树性质
Splay 树首先是一棵**二叉搜索树（BST）**，即对于任意节点 $x$：
- 左子树中所有节点的键值均小于 $x$ 的键值；
- 右子树中所有节点的键值均大于 $x$ 的键值；
- 中序遍历得到键值的有序序列。

### 1.2 伸展

By DS

Splay 树区别于普通 BST 的唯一特性是：**每次对节点 $x$ 进行查找、插入或删除等访问后，都需要执行“伸展”操作，将 $x$ 旋转到根节点**。即使访问失败（如查找不存在的键），也会对访问路径上的最后一个节点（或前驱/后继）进行伸展。

伸展操作由一系列 **单旋转（single rotation）** 和 **双旋转（double rotation）** 组成，依据节点与其父节点及祖父节点的相对位置分为三种基本情况（即 **Zig**、**Zig‑Zig**、**Zig‑Zag**）。这些旋转不仅将目标节点提升至根，同时也会降低树的深度，从而改善后续操作的效率。

---

## 2. 旋转操作

**旋转**是 BST 的基本局部调整工具，不会改变 BST 的性质。Splay 树中仅使用两种单旋转：**右旋（Zig）** 和 **左旋（Zag）**，它们互为镜像。

### 2.1 右旋
设节点 $p$ 为其左孩子 $c$ 的父节点，且 $c$ 的右子树为 $B$。右旋后，$c$ 成为子树的新根，$p$ 成为 $c$ 的右孩子，原 $c$ 的右子树 $B$ 变为 $p$ 的左子树。 

**伪代码**（以节点 $p$ 为旋转中心，对其左孩子 $c$ 进行右旋）：

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Function{rotate-Commentright}{$p$}
    \State $c \gets p.left$
    \If{$c = null$}
        \Return
    \EndIf
    \State $p.left \gets c.right$
    \If{$c.right \neq null$}
        \State $c.right.parent \gets p$
    \EndIf
    \State $c.parent \gets p.parent$
    \If{$p.parent = null$}
        \State $root \gets c$
    \ElsIf{$p = p.parent.left$}
        \State $p.parent.left \gets c$
    \Else
        \State $p.parent.right \gets c$
    \EndIf
    \State $c.right \gets p$
    \State $p.parent \gets c$
\EndFunction
\end{algorithmic}
</code></pre>
{% endraw %}


### 2.2 左旋
对称地，设 $p$ 为其右孩子 $c$ 的父节点，$c$ 的左子树为 $B$。左旋后，$c$ 成为新根，$p$ 成为 $c$ 的左孩子，原 $c$ 的左子树 $B$ 变为 $p$ 的右子树。  
**伪代码**（对 $p$ 的右孩子 $c$ 进行左旋）：

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Function{rotate-Commentleft}{$p$}
    \State $c \gets p.right$
    \If{$c = null$}
        \Return
    \EndIf
    \State $p.right \gets c.left$
    \If{$c.left \neq null$}
        \State $c.left.parent \gets p$
    \EndIf
    \State $c.parent \gets p.parent$
    \If{$p.parent = null$}
        \State $root \gets c$
    \ElsIf{$p = p.parent.left$}
        \State $p.parent.left \gets c$
    \Else
        \State $p.parent.right \gets c$
    \EndIf
    \State $c.left \gets p$
    \State $p.parent \gets c$
\EndFunction
\end{algorithmic}
</code></pre>
{% endraw %}

---

## 3. 伸展操作详解

伸展操作的目的是将指定节点 $x$ 通过一系列旋转移动至树根。根据 $x$ 与其父节点 $p$ 和祖父节点 $g$（若存在）的关系，分为三种情形，不断迭代直至 $x$ 成为根。

### 3.1 情形一：Zig（单旋）
当 $x$ 的父节点 $p$ 就是根节点时，只需执行一次单旋转（若 $x$ 是 $p$ 的左孩子则右旋，否则左旋），使得 $x$ 成为根。

### 3.2 情形二：Zig‑Zig（同侧双旋）
当 $x$ 与其父节点 $p$ 以及 $p$ 与其父节点 $g$ 的父子关系**相同**（即 $x$ 是 $p$ 的左孩子且 $p$ 是 $g$ 的左孩子，或 $x$ 是 $p$ 的右孩子且 $p$ 是 $g$ 的右孩子）时，先对 $g$ 进行单旋转，再对 $p$ 进行单旋转。例如 $x$ 为 $g$ 的左子树的左孩子，则先右旋 $g$，再右旋 $p$。

### 3.3 情形三：Zig‑Zag（异侧双旋）
当 $x$ 与其父节点 $p$ 以及 $p$ 与其父节点 $g$ 的父子关系**不同**（即 $x$ 是 $p$ 的右孩子而 $p$ 是 $g$ 的左孩子，或 $x$ 是 $p$ 的左孩子而 $p$ 是 $g$ 的右孩子）时，先对 $p$ 进行旋转（使得 $x$ 上升），再对 $g$ 进行旋转（此时 $x$ 与 $g$ 同侧，再次旋转）。例如 $x$ 是 $g$ 的左子树的右孩子，则先左旋 $p$，再右旋 $g$。

**伸展操作的完整伪代码**：

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Function{splay}{$x$}
    \While{$x.parent \neq null$}
        \State $p \gets x.parent$
        \State $g \gets p.parent$
        \If{$g = null$}  \Comment{Zig}
            \If{$x = p.left$}
                \State \Call{rotate-Commentright}{$p$}
            \Else
                \State \Call{rotate-Commentleft}{$p$}
            \EndIf
        \Else
            \If{$(x = p.left) \equiv (p = g.left)$}  \Comment{Zig-Zig 同侧}
                \If{$x = p.left$}
                    \State \Call{rotate-Commentright}{$g$}
                \Else
                    \State \Call{rotate-Commentleft}{$g$}
                \EndIf
                \If{$x = p.left$}
                    \State \Call{rotate-Commentright}{$p$}
                \Else
                    \State \Call{rotate-Commentleft}{$p$}
                \EndIf
            \Else  \Comment{Zig-Zag 异侧}
                \If{$x = p.left$}
                    \State \Call{rotate-Commentright}{$p$}
                \Else
                    \State \Call{rotate-Commentleft}{$p$}
                \EndIf
                \If{$x = g.left$}
                    \State \Call{rotate-Commentright}{$g$}
                \Else
                    \State \Call{rotate-Commentleft}{$g$}
                \EndIf
            \EndIf
        \EndIf
    \EndWhile
    \State $root \gets x$
\EndFunction
\end{algorithmic}
</code></pre>
{% endraw %}


**实现优化**：实际代码中，常常将 Zig‑Zig 和 Zig‑Zag 分别处理，但上述逻辑清晰。更常见的写法是：

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Comment{优化写法（通常用于实际实现）}
\While{$p \neq null$}
    \If{$g = null$}  \Comment{Zig}
        \State \Call{rotate}{$p, x-Commentside$}
    \ElsIf{$(x \text{ 是 } p \text{ 的左孩子}) \equiv (p \text{ 是 } g \text{ 的左孩子})$}  \Comment{Zig-Zig}
        \State \Call{rotate}{$g, side$}
        \State \Call{rotate}{$p, side$}
    \Else  \Comment{Zig-Zag}
        \State \Call{rotate}{$p, x-Commentside$}
        \State \Call{rotate}{$g, opposite-Commentside$}
    \EndIf
    \State 更新 $p, g$ 等
\EndWhile
\end{algorithmic}
</code></pre>
{% endraw %}

---

## 4. 基本操作

### 4.1 查找
查找键值 $k$ 的过程与普通 BST 相同，从根开始比较，若等于则找到；若小于则进入左子树，大于则进入右子树；若遇到空节点则查找失败。  
**关键**：无论查找成功与否，在返回之前，必须对**最后访问的非空节点**（成功时为该节点，失败时为其父节点）执行 `splay` 操作，将其提升为根。如果树为空，则直接返回空。

### 4.2 插入
插入操作分为两步：
1. 按 BST 规则插入新节点 $z$（键值为 $k$），若 $k$ 已存在，可覆盖或忽略（视需求而定）。
2. 对 $z$ 执行 `splay(z)`，将新节点旋转至根。

注意：若 $k$ 已存在且不允许重复，则可以在找到后直接 `splay` 该节点，不插入新节点。

### 4.3 删除
删除操作有多种实现方式，这里介绍最常用的“**删除根后合并左右子树**”的方法：
1. 先对要删除的键值 $k$ 执行 `find(k)`，若查找成功，则该节点已被伸展到根；若查找失败，则无需删除（但可能已经伸展了最后一个节点）。
2. 若根节点的键值不等于 $k$（即 $k$ 不存在），则删除结束。
3. 若根节点即为待删节点：
   - 记录根节点 $r$，分别取其左子树 $L$ 和右子树 $R$。
   - 将 $L$ 和 $R$ 从 $r$ 断开，并清空 $r$ 的左右指针。
   - 若左子树为空，则新的根为 $R$，并置 $R.parent = null$；若右子树为空，则新根为 $L$。
   - 否则，在左子树中找到最大值节点 $m$（即左子树最右节点），对其执行 `splay(m)`，此时 $m$ 成为左子树的根，且其右子树为空（因为它是最大值）。然后将右子树 $R$ 作为 $m$ 的右孩子，并更新 $R.parent = m$，最后 $m$ 成为整棵树的新根。

另一种常见删除方法：找到前驱或后继来替换，但上述方法利用伸展操作更自然。

### 4.4 合并
将两棵 Splay 树 $T-Comment1$ 和 $T-Comment2$ 合并，要求 $T-Comment1$ 中所有键值均小于 $T-Comment2$ 中所有键值。操作步骤：
1. 在 $T-Comment1$ 中查找最大节点（向右遍历到最右），然后对其进行 `splay`，使该最大节点成为 $T-Comment1$ 的根，且其右子树为空。
2. 将 $T-Comment2$ 的根作为该最大节点的右子树，并更新父指针。
3. 返回 $T-Comment1$ 的根（即合并后的根）。

### 4.5 分裂
将一棵 Splay 树按键值 $k$ 分裂为两棵树 $T-Comment1$（键值 $\le k$）和 $T-Comment2$（键值 $> k$）：
1. 若树为空，则两棵均为空。
2. 先执行 `find(k)`（或查找 $k$ 的前驱/后继）。更稳健的做法：插入一个临时节点 $k$（若不存在），然后伸展，再删除根，左右子树即为分裂结果。但更常见的做法是：
   - 若存在键值 $k$，则先 `splay` 该节点，然后其左子树为 $T-Comment1$，右子树为 $T-Comment2$，并断开根节点（根节点可以归入 $T-Comment1$ 或单独处理）。
   - 若不存在，则查找 $k$ 过程中最后访问的节点会被伸展到根。若根键值 $< k$，则根的右子树部分以及根本身（含左子树）构成 $T-Comment1$，右子树为 $T-Comment2$；反之，根键值 $> k$，则左子树为 $T-Comment1$，根及右子树为 $T-Comment2$。具体实现需仔细处理边界。

---

## 5. 复杂度分析

### 5.1 单次操作的复杂度
单次查找、插入、删除的时间复杂度与树的高度成正比，而在最坏情况下，伸展树可能退化为链状，因此单次操作的最坏时间复杂度为 $O(n)$。例如，若按递增顺序插入节点，每次插入后新节点被伸展到根，树实际上会形成一个链，但插入操作本身仍保持 $O(n)$ 的伸展代价。

### 5.2 均摊复杂度
Splay 树的卓越之处在于其**均摊性能**。通过势能法（Potential Method），可以证明任意连续 $m$ 次操作（包括查找、插入、删除等）的总时间至多为 $O((m+n)\log n)$，其中 $n$ 为树中节点数。这意味着平均每次操作的均摊时间为 $O(\log n)$。

**直观解释**：伸展操作在将访问节点提升到根的同时，也大幅降低了访问路径上节点的深度，使得后续访问这些节点更加迅速。虽然单次操作可能很慢，但代价会被后续的快速操作“摊还”。

**势能定义**（通常采用秩（rank））：设每个节点 $x$ 的子树大小为 $size(x)$，定义其秩 $r(x) = \lfloor \log-Comment2 size(x) \rfloor$，整棵树的势能 $\Phi = \sum-Comment{x} r(x)$。可以证明每次旋转的**摊还代价**为 $O(1)$，而一次伸展操作由 $O(\text{深度})$ 次旋转组成，摊还代价为 $O(\log n)$。详细推导可参考 Tarjan 的原始论文或算法教材。

> 关于摊还分析，后续文章会提到

### 5.3 空间复杂度
每个节点需要存储键值、左右孩子指针、父指针，空间复杂度 $O(n)$，与普通 BST 一致。

---

## 6. 优缺点与适用场景

By DS

### 6.1 优点
- **实现简单**：无需维护额外平衡信息（如 AVL 的平衡因子或 Treap 的优先级），代码量相对较少。
- **优秀的均摊性能**：在大多数实际应用场景中，操作序列的总体效率接近 $O(\log n)$。
- **灵活性强**：易于实现合并、分裂等高级操作，适合作为可持久化数据结构的基础。
- **空间利用率高**：每个节点仅需存储父指针与左右孩子，无额外字段。
- **缓存友好**：最近访问的节点被移到根，在局部性较强的访问模式（如重复访问某些元素）下表现优异。

### 6.2 缺点
- **最坏情况单次操作较慢**：在实时系统或需要严格最坏时间界限的场景下不适用。
- **均摊分析依赖于访问序列**，对于某些精心设计的恶意序列，可能每次操作都达到 $O(n)$，但这种情况在随机数据中极少出现。
- **旋转操作较多**，常数因子略大于一些基于平衡因子的树（如 AVL），但通常可接受。
- **递归实现易受栈溢出影响**（因为伸展操作可能很深），实际代码常用迭代。

### 6.3 典型应用
- **实现关联容器**（如 C++ 的 `std::set` 的某些实现，尽管实际多用红黑树）。
- **区间操作与序列维护**（如文艺平衡树，支持区间翻转等）。
- **可持久化数据结构**（持久化 Splay 虽不常见，但存在变种）。
- **动态树（Link-Cut Tree）** 的底层基础（使用 Splay 维护实链）。
- **网络路由与内存管理**中需要按访问频率调整结构的场景。

---

## 7. 代码实现

以下给出一个简洁的 Splay 树实现框架，省略了内存管理细节（可配合对象池使用）。

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Procedure{PUSHUP}{$x$}
    \If{$x = \text{NIL}$}
        \Return
    \EndIf
    \State $x.size \gets 1$
    \If{$x.left \neq \text{NIL}$}
        \State $x.size \gets x.size + x.left.size$
    \EndIf
    \If{$x.right \neq \text{NIL}$}
        \State $x.size \gets x.size + x.right.size$
    \EndIf
\EndProcedure

\Function{SIDE}{$x$}
    \If{$x.parent \neq \text{NIL}$ \AND $x = x.parent.right$}
        \Return $1$
    \Else
        \Return $0$
    \EndIf
\EndFunction

\Procedure{ROTATE}{$x$}
    \Comment{将节点 $x$ 向上旋转一层（单旋）}
    \State $p \gets x.parent$
    \State $g \gets p.parent$
    \If{$p.right = x$}  \Comment{$x$ 是右孩子}
        \State $p.right \gets x.left$
        \If{$x.left \neq \text{NIL}$}
            \State $x.left.parent \gets p$
        \EndIf
    \Else  \Comment{$x$ 是左孩子}
        \State $p.left \gets x.right$
        \If{$x.right \neq \text{NIL}$}
            \State $x.right.parent \gets p$
        \EndIf
    \EndIf
    \State $x.parent \gets g$
    \If{$g \neq \text{NIL}$}
        \If{$g.left = p$}
            \State $g.left \gets x$
        \Else
            \State $g.right \gets x$
        \EndIf
    \EndIf
    \State $p.parent \gets x$
    \If{$p.right = x$}  \Comment{将 $p$ 挂到 $x$ 的另一侧}
        \State $x.left \gets p$
    \Else
        \State $x.right \gets p$
    \EndIf
    \State \Call{PUSHUP}{$p$}
    \State \Call{PUSHUP}{$x$}
\EndProcedure

\Procedure{SPLAY}{$x$}
    \While{$x.parent \neq \text{NIL}$}
        \State $p \gets x.parent$
        \State $g \gets p.parent$
        \If{$g = \text{NIL}$}  \Comment{Zig 情形}
            \State \Call{ROTATE}{$x$}
        \ElsIf{$(g.left = p \text{ 且 } p.left = x) \text{ 或 } (g.right = p \text{ 且 } p.right = x)$}  \Comment{Zig-Zig 同侧}
            \State \Call{ROTATE}{$p$}   \Comment{先旋父节点}
            \State \Call{ROTATE}{$x$}
        \Else  \Comment{Zig-Zag 异侧}
            \State \Call{ROTATE}{$x$}
            \State \Call{ROTATE}{$x$}
        \EndIf
    \EndWhile
    \State $root \gets x$   \Comment{更新树根}
\EndProcedure
\end{algorithmic}
</code></pre>
{% endraw %}

---

# 第二部分 Treap

## 1. Treap 的基本概念

By DS

### 1.1 双重性质
Treap 中的每个节点存储两个关键域：
- **键值（Key）**：满足二叉搜索树（BST）性质，即中序遍历为有序序列。
- **优先级（Priority）**：通常由随机数生成器赋予，满足堆性质（通常为大根堆或小根堆，本文统一采用 **大根堆**，即父节点的优先级大于所有子节点）。

### 1.2 平衡原理
当一组确定的键值被插入时，若它们的优先级是独立且均匀随机分布的，则 Treap 的形态等价于以优先级为关键字的**随机二叉搜索树（Random BST）**。数学期望高度为 $O(\log n)$，且这一结论与输入键值的顺序无关。因此，Treap 无需像 AVL 那样时刻检查平衡因子，也无需像 Splay 那样依赖操作的均摊。

---

## 2. 带旋 Treap

这是 Treap 最原始的形态。插入或删除节点后，通过**左旋（Zag）** 和 **右旋（Zig）** 来修复可能被破坏的堆性质。这里的旋转操作与 Splay 中的单旋转在几何上完全一致，但**触发时机与目的截然不同**：Splay 的旋转是为了将目标节点提升至根，而 Treap 的旋转是为了将优先级更高的孩子“浮”到父位置，以维持堆序。

### 2.1 旋转操作回顾
由于第一篇已详细给出旋转的伪代码，此处仅做符号约定：
- **右旋（Zig）**：作用于父节点 $p$ 与其左孩子 $c$，将 $c$ 上浮。
- **左旋（Zag）**：作用于父节点 $p$ 与其右孩子 $c$，将 $c$ 上浮。

**关键区别**：Splay 的旋转以目标节点为中心向上提；Treap 的旋转则以父子关系破坏堆序为出发点，通常从底层向上调整。

### 2.2 插入操作
插入步骤：
1. **标准 BST 插入**：按键值大小递归或迭代插入新节点 $z$，此时 $z$ 作为叶子节点，其随机优先级为 $p$。
2. **上浮修复（Rotate Up）**：若 $z$ 的优先级大于其父节点的优先级（大根堆冲突），则对父节点执行相应的旋转（若 $z$ 是左孩子则右旋父节点，若 $z$ 是右孩子则左旋父节点）。旋转后 $z$ 上升一层，继续比较新的父节点，直至满足堆性质或到达根节点。

**复杂度**：插入路径长度为 $O(h)$，期望 $O(\log n)$。

### 2.3 删除操作
删除节点 $x$ 时，传统 BST 删除需处理拥有两个孩子的复杂情况。Treap 利用堆性质提供了一个极其优雅的方法：
1. **下沉**：若 $x$ 是叶子节点，直接删除。
2. 若 $x$ 有孩子，则比较其左右孩子的优先级。**选择优先级较高的孩子**，对该孩子进行旋转（即把 $x$ 往下旋）。例如，若左孩子优先级更高，则对 $x$ 执行右旋，$x$ 变为其左孩子的右子树；反之执行左旋。
3. 反复执行上述下沉操作，直到 $x$ 成为叶子节点。
4. 最后将 $x$ 从树中直接摘除。

### 2.4 查找与其它操作
查找操作与普通 BST 完全一致，且**查找不会触发任何结构调整**（这与 Splay 天差地别）。因此 Treap 的单次查找最坏时间复杂度为树高 $O(h)$，期望 $O(\log n)$，但不存在 Splay 那种“访问即修改”的副作用。

---

## 3. 无旋 Treap

尽管旋转版 Treap 已经非常简单高效，但旋转操作在涉及**区间翻转、批量插入/删除**或**可持久化**时显得力不从心。2012 年左右，中国 OI 界广泛传播了由范浩强（FHQ）提出的**无旋 Treap**。它完全抛弃了旋转，仅通过两个基本原语——**分裂（Split）** 和 **合并（Merge）**——即可实现所有数据结构操作，且天然支持懒惰标记（Lazy Tag），是实现可持久化序列的理想选择。

——By OI-WIKI

### 3.1 分裂
`Split(root, key)` 将一棵 Treap 按键值 `key` 分裂为两棵独立的 Treap $A$ 和 $B$，使得 $A$ 中所有节点的键值 **$\le key$**（或 $< key$，视具体定义），$B$ 中所有节点的键值 **$> key$**。该操作递归进行，不破坏任何 BST 或堆性质。

**递归逻辑（以键值 $\le key$ 为左树，$> key$ 为右树）**：
1. 若当前节点 `cur` 为空，返回 `(null, null)`。
2. 若 `cur->val <= key`，则说明 `cur` 及其左子树全部属于左树 $A$。但 `cur` 的右子树中可能部分属于 $A$，部分属于 $B$。于是递归分裂 `cur->right`，得到 `(left-Commentpart, right-Commentpart)`。将 `cur->right` 指向 `left-Commentpart`，更新 `cur` 的父节点（若有），则 $A$ 的根为 `cur`，$B$ 的根为 `right-Commentpart`。
3. 若 `cur->val > key`，则对称处理：`cur` 及其右子树属于右树 $B$，递归分裂 `cur->left` 得到 `(left-Commentpart, right-Commentpart)`，将 `cur->left` 指向 `right-Commentpart`，$A$ 根为 `left-Commentpart`，$B$ 根为 `cur`。

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Procedure{SPLIT}{$cur$, $key$, 输出 $a$, 输出 $b$}
    \Comment{将 $cur$ 为根的树按键值 $key$ 分裂为 $a$（$\le key$）和 $b$（$> key$）}
    \If{$cur = \text{null}$}
        \State $a \gets \text{null}$
        \State $b \gets \text{null}$
        \State \Return
    \EndIf
    \If{$cur.val \le key$}
        \State $a \gets cur$
        \State \Call{SPLIT}{$cur.right$, $key$, $cur.right$, $b$}
        \If{$cur.right \neq \text{null}$}
            \State $cur.right.parent \gets cur$  \Comment{若维护父指针}
        \EndIf
        \State \Call{PUSHUP}{$a$}
    \Else
        \State $b \gets cur$
        \State \Call{SPLIT}{$cur.left$, $key$, $a$, $cur.left$}
        \If{$cur.left \neq \text{null}$}
            \State $cur.left.parent \gets cur$  \Comment{若维护父指针}
        \EndIf
        \State \Call{PUSHUP}{$b$}
    \EndIf
\EndProcedure
\end{algorithmic}
</code></pre>
{% endraw %}

### 3.2 合并
`Merge(a, b)` 将两棵 Treap 合并为一棵，**前提条件**是 $A$ 中所有键值均小于 $B$ 中所有键值（即保证 $A$ 和 $B$ 的有序性）。合并时完全依据优先级维护堆性质。
1. 若 $A$ 或 $B$ 为空，返回非空的那棵。
2. 若 `A->prio > B->prio`（大根堆），则 $A$ 应作为合并后的根。由于 $A$ 的所有键值小于 $B$，$B$ 只能合并到 $A$ 的右子树中。递归合并 `A->right` 和 $B$，结果赋给 `A->right`，更新父指针，最后 `pushup(A)` 并返回 $A$。
3. 若 `B->prio > A->prio`，则 $B$ 作为根，递归合并 $A$ 和 `B->left`，赋给 `B->left`。

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Function{MERGE}{$a$, $b$}
    \Comment{合并两棵树，要求 $a$ 中所有键值小于 $b$ 中所有键值，返回合并后的根}
    \If{$a = \text{null}$ \OR $b = \text{null}$}
        \State \Return $a$ 或 $b$（非空的那个）
    \EndIf
    \If{$a.prio > b.prio$}
        \State $a.right \gets$ \Call{MERGE}{$a.right$, $b$}
        \If{$a.right \neq \text{null}$}
            \State $a.right.parent \gets a$  \Comment{若维护父指针}
        \EndIf
        \State \Call{PUSHUP}{$a$}
        \State \Return $a$
    \Else
        \State $b.left \gets$ \Call{MERGE}{$a$, $b.left$}
        \If{$b.left \neq \text{null}$}
            \State $b.left.parent \gets b$  \Comment{若维护父指针}
        \EndIf
        \State \Call{PUSHUP}{$b$}
        \State \Return $b$
    \EndIf
\EndFunction
\end{algorithmic}
</code></pre>
{% endraw %}

### 3.3 用 Split 和 Merge 实现基本操作

By DS

无旋 Treap 的所有操作均建立在这两个原语之上，思路极其清晰：

- **插入（Insert）**：插入新节点 `z`。按 `key` 分裂树为 `(a, b)`，然后合并 `merge(merge(a, z), b)`。
- **删除（Delete）**：删除键值 `key`。先按 `key-1`（或 `< key`）分裂为 `(a, b)`，再按 `key` 分裂 `b` 为 `(mid, c)`，此时 `mid` 中所有键值等于 `key`。丢弃 `mid`（或释放其根），最后合并 `merge(a, c)`。
- **查询排名（Rank）**：直接按 BST 遍历即可，或使用分裂：`split(root, key-1)` 得到左树大小即为小于 `key` 的个数。
- **查询第 k 大（Kth）**：利用子树大小在 BST 上二分查找，无需分裂（因为无旋 Treap 依然维护 `size` 域）。
- **求前驱/后继**：利用分裂或 BST 标准遍历。

### 3.4 区间操作与懒惰标记（Lazy Propagation）

无旋 Treap 在处理**区间**（如区间翻转、区间加）时展现出碾压级优势。若按**下标（序列顺序）** 建立 Treap（而非键值），则 `Split` 不再按键值，而是按子树大小（`Size`）分裂。

例如，截取区间 $[l, r]$：
1. `split(root, l-1, a, b)` —— 将前 $l-1$ 个节点分到 $a$。
2. `split(b, r-l+1, mid, c)` —— 从 $b$ 中取出前 $r-l+1$ 个节点到 $mid$。
3. 此时 `mid` 即为目标区间，可对其根节点打上翻转标记（`rev ^= 1`）。
4. 最后合并：`root = merge(merge(a, mid), c)`。

由于 `Split` 和 `Merge` 过程中会触及子树，只需在递归下降时**下传（pushdown）** 标记，即可完美维护区间翻转，而旋转版 Treap 处理区间翻转则需复杂的“下放”逻辑，且难以保持结构稳定。这也是 FHQ Treap 在现代算法竞赛中备受青睐的核心原因。

---

## 4. 复杂度分析与随机性保证

### 4.1 期望时间复杂度
Treap 的随机优先级决定了其树高的**期望**为 $O(\log n)$。这一结论不依赖任何复杂势能，而是基于经典的随机 BST 高度定理（。

因此，旋转版 Treap 的插入、删除、查找期望时间复杂度均为 $O(\log n)$，最坏情况下仍为 $O(n)$。

### 4.2 无旋 Treap 的额外开销
- `Split` 和 `Merge` 的递归深度等于树高，期望 $O(\log n)$。
- 每次操作（如插入）调用两次分裂和两次合并，常数因子略大于旋转版单次插入，但在可接受范围内（通常为 2~3 倍）。
- 空间复杂度 $O(n)$，存储优先级需额外 $4$ 或 $8$ 字节，相比 Splay 并无劣势。

### 4.3 确定性与随机性
严格来说，Treap 是**随机化（Randomized）** 数据结构，而非确定性数据结构。其复杂度保证是概率性的（高概率保证）。

---

## 5. 对比

By DS

| 特性 | 旋转版 Treap | 无旋版 Treap |
| :--- | :--- | :--- |
| **核心操作** | 旋转修复堆 | Split + Merge |
| **实现难度** | 简单，但旋转方向易混淆 | 递归逻辑直观，不易出错 |
| **常数性能** | 常数较小，旋转仅涉及少量指针 | 常数较大（多次递归调用与指针赋值） |
| **区间操作** | 支持困难，需引入复杂的懒标记下放与旋转调整 | **天生支持**，配合 `Size` 分裂即可实现高效区间修改 |
| **可持久化（Persistent）** | 极难（旋转会改变父子关系，拷贝开销大） | **易于实现**（仅需在递归路径上拷贝节点，路径期望 $O(\log n)$） |
| **父指针需求** | 需要（用于旋转后更新父链） | 可以不需要（合并时直接赋值，更简洁） |
| **查找操作** | 只读，不修改结构 | 只读，不修改结构 |

**结论**：若仅需维护有序集合（键值增删改查），**旋转版 Treap** 代码量最少且速度飞快；若需要支持区间翻转、区间赋值或可持久化，**无旋版 Treap** 是不二之选。后者的设计哲学极其优美，几乎将树形结构的递归特性发挥到极致。

---

## 6. 代码实现要点

### 6.1 旋转版核心框架（仅展示插入与删除）

{% raw %}
<pre><code class="language-pseudocode">
\begin{algorithmic}
\Comment{节点包含：值 val，随机优先级 prio，子树大小 size，左孩子 left，右孩子 right}

\Procedure{PUSHUP}{$x$}
    \If{$x = \text{null}$}
        \Return
    \EndIf
    \State $x.size \gets 1$
    \If{$x.left \neq \text{null}$}
        \State $x.size \gets x.size + x.left.size$
    \EndIf
    \If{$x.right \neq \text{null}$}
        \State $x.size \gets x.size + x.right.size$
    \EndIf
\EndProcedure

\Function{ROTATE}{$p$, $dir$}
    \Comment{$dir=0$: 左旋，$dir=1$: 右旋，返回新根}
    \If{$dir = 0$}
        \State $c \gets p.right$
        \State $p.right \gets c.left$
        \State $c.left \gets p$
    \Else
        \State $c \gets p.left$
        \State $p.left \gets c.right$
        \State $c.right \gets p$
    \EndIf
    \State \Call{PUSHUP}{$p$}
    \State \Call{PUSHUP}{$c$}
    \Return $c$
\EndFunction

\Function{INSERT}{$p$, $val$}
    \Comment{返回插入后的子树根}
    \If{$p = \text{null}$}
        \Return 新建节点（$val$，随机优先级，$size=1$）
    \EndIf
    \If{$val < p.val$}
        \State $p.left \gets$ \Call{INSERT}{$p.left$, $val$}
        \If{$p.left.prio > p.prio$}
            \State $p \gets$ \Call{ROTATE}{$p$, $1$}
        \EndIf
    \Else
        \State $p.right \gets$ \Call{INSERT}{$p.right$, $val$}
        \If{$p.right.prio > p.prio$}
            \State $p \gets$ \Call{ROTATE}{$p$, $0$}
        \EndIf
    \EndIf
    \State \Call{PUSHUP}{$p$}
    \Return $p$
\EndFunction

\Function{ERASE}{$p$, $val$}
    \Comment{返回删除后的子树根}
    \If{$p = \text{null}$}
        \Return $\text{null}$
    \EndIf
    \If{$val = p.val$}
        \If{$p.left = \text{null}$ \OR $p.right = \text{null}$}
            \State $tmp \gets p$
            \If{$p.left \neq \text{null}$}
                \State $p \gets p.left$
            \Else
                \State $p \gets p.right$
            \EndIf
            \State 删除 $tmp$
        \Else
            \If{$p.left.prio > p.right.prio$}
                \State $p \gets$ \Call{ROTATE}{$p$, $1$}
                \State $p.right \gets$ \Call{ERASE}{$p.right$, $val$}
            \Else
                \State $p \gets$ \Call{ROTATE}{$p$, $0$}
                \State $p.left \gets$ \Call{ERASE}{$p.left$, $val$}
            \EndIf
        \EndIf
    \ElsIf{$val < p.val$}
        \State $p.left \gets$ \Call{ERASE}{$p.left$, $val$}
    \Else
        \State $p.right \gets$ \Call{ERASE}{$p.right$, $val$}
    \EndIf
    \State \Call{PUSHUP}{$p$}
    \Return $p$
\EndFunction
\end{algorithmic}
</code></pre>
{% endraw %}

### 6.2 无旋版核心框架（含懒标记示例）

<pre><code class="language-pseudocode">
\begin{algorithmic}
\Comment{节点包含：值 val，随机优先级 prio，子树大小 size，翻转标记 rev，左孩子 left，右孩子 right}

\Procedure{PUSHUP}{$p$}
    \State $p.size \gets 1 + p.left.size + p.right.size$
    \Comment{注意：空节点视为 size = 0}
\EndProcedure

\Procedure{PUSHDOWN}{$p$}
    \If{$p \neq \text{null}$ \AND $p.rev$ 为真}
        \State 交换 $p.left$ 和 $p.right$
        \If{$p.left \neq \text{null}$}
            \State $p.left.rev \gets \neg p.left.rev$
        \EndIf
        \If{$p.right \neq \text{null}$}
            \State $p.right.rev \gets \neg p.right.rev$
        \EndIf
        \State $p.rev \gets \text{假}$
    \EndIf
\EndProcedure

\Procedure{SPLIT}{$cur$, $k$, 输出 $a$, 输出 $b$}
    \Comment{将 $cur$ 的前 $k$ 个节点分到 $a$，其余分到 $b$}
    \If{$cur = \text{null}$}
        \State $a \gets \text{null}$
        \State $b \gets \text{null}$
        \State \Return
    \EndIf
    \State \Call{PUSHDOWN}{$cur$}
    \If{$cur.left.size \ge k$}
        \State \Call{SPLIT}{$cur.left$, $k$, $a$, $cur.left$}
        \State $b \gets cur$
        \If{$cur.left \neq \text{null}$}
            \State $cur.left.parent \gets cur$
        \EndIf
        \State \Call{PUSHUP}{$b$}
    \Else
        \State \Call{SPLIT}{$cur.right$, $k - cur.left.size - 1$, $cur.right$, $b$}
        \State $a \gets cur$
        \If{$cur.right \neq \text{null}$}
            \State $cur.right.parent \gets cur$
        \EndIf
        \State \Call{PUSHUP}{$a$}
    \EndIf
\EndProcedure

\Function{MERGE}{$a$, $b$}
    \Comment{合并两棵树，要求 $a$ 中所有键值小于 $b$ 中所有键值}
    \If{$a = \text{null}$}
        \State \Return $b$
    \EndIf
    \If{$b = \text{null}$}
        \State \Return $a$
    \EndIf
    \If{$a.prio > b.prio$}
        \State \Call{PUSHDOWN}{$a$}
        \State $a.right \gets$ \Call{MERGE}{$a.right$, $b$}
        \If{$a.right \neq \text{null}$}
            \State $a.right.parent \gets a$
        \EndIf
        \State \Call{PUSHUP}{$a$}
        \State \Return $a$
    \Else
        \State \Call{PUSHDOWN}{$b$}
        \State $b.left \gets$ \Call{MERGE}{$a$, $b.left$}
        \If{$b.left \neq \text{null}$}
            \State $b.left.parent \gets b$
        \EndIf
        \State \Call{PUSHUP}{$b$}
        \State \Return $b$
    \EndIf
\EndFunction

\Procedure{REVERSE}{$root$, $l$, $r$}
    \Comment{翻转区间 $[l, r]$，下标从 1 开始}
    \State \Call{SPLIT}{$root$, $l-1$, $a$, $b$}
    \State \Call{SPLIT}{$b$, $r-l+1$, $mid$, $c$}
    \If{$mid \neq \text{null}$}
        \State $mid.rev \gets \neg mid.rev$
    \EndIf
    \State $root \gets$ \Call{MERGE}{\Call{MERGE}{$a$, $mid$}, $c$}
\EndProcedure
\end{algorithmic}
</code></pre>


---

## 7. 优缺点与适用场景总结

By DS

### 7.1 Treap 的共同优点
- **实现极简**：无论旋转还是无旋，代码量通常仅为 Splay 的一半。
- **期望性能稳定**：随机优先级对抗构造数据，无需担心恶意输入导致链状退化。
- **无需维护复杂平衡因子**：比 AVL 轻松得多。
- **无旋版额外优势**：天然递归，易于理解；支持区间操作和可持久化；无需父指针，内存更紧凑。

### 7.2 Treap 的共同缺点
- **依赖随机数**：在调试或确定性要求极高的场景（如航空航天）中可能不被信任；部分 OJ 可能卡随机（但可用时间种子或 `std::mt19937-Comment64` 规避）。
- **递归风险**：虽然期望深度 $\log n$，但递归实现可能在极少数情况下（随机种子不佳）触发栈溢出；亦可改写为迭代，但实现复杂度陡增。
- **查找不修改结构**：相比 Splay 的“自适应”局部性，Treap 没有缓存友好特性，在反复访问少数热点元素时，Splay 性能更优。

### 7.3 如何选择？
- **当任务仅为静态或半动态有序集合（增删查）**：优先选择旋转版 Treap，常数小且代码简练。
- **当任务涉及区间翻转、区间加、序列挪移等**：毫不犹豫选择无旋 Treap。
- **当需要严格最坏时间 $O(\log n)$ 保证**：应选择 AVL 或红黑树（请期待第三篇）。
- **当访问模式具有极强的局部性（如 LRU 缓存）**：Splay 更擅长。

---

# 第三部分 AVL

## 1. AVL 树的核心思想

### 1.1 平衡因子（Balance Factor）

> 注：正常来讲，平衡因子应该是个大写的 BF，但是作者喜欢小写

对于任意节点 $x$，定义其**平衡因子**为：

$$
bf(x) = \text{height}(x.\text{left}) - \text{height}(x.\text{right})
$$

其中子树高度定义为该子树中最长路径的边数（或节点数，约定统一即可）。AVL 树要求对于**每个节点**，其平衡因子的绝对值 **≤ 1**，即：

$$
-1 \le bf(x) \le 1
$$

这意味着任意节点的左右子树高度差至多为 1。这个约束保证了整棵树的高度在最坏情况下不超过 $1.44 \log-Comment2 (n+2) - 0.328$（即约为 $1.44\log n$），从而确保所有操作的时间复杂度为 $O(\log n)$。

### 1.2 最小节点数与树高的关系
设 $N-Commenth$ 为高度为 $h$ 的 AVL 树所包含的最少节点数。由 AVL 的递归定义，高度 $h$ 的树由根、一棵高度 $h-1$ 的子树和另一棵高度 $h-2$ 的子树构成（因为高度差至多 1，且要节点数最少，则取高度 $h-1$ 和 $h-2$）。因此：

$$
N-Commenth = N-Comment{h-1} + N-Comment{h-2} + 1,\quad N-Comment0 = 1 \ (\text{或 }0),\; N-Comment1 = 2
$$

这恰是斐波那契数列的变体，由此可推出高度 $h = O(\log n)$。例如，当 $n=10^6$ 时，AVL 树高度约为 28，远小于可能的退化为 $10^6$ 的链状结构。

——By OI-WIKI

---

## 2. 旋转操作

<p>与 <strong>Splay</strong> 和 <strong>Treap</strong> 不同，<strong>AVL</strong> 的旋转不仅仅是局部调整，而是<strong>恢复平衡</strong>的精确手段。每次插入或删除后，我们需要从修改点沿路径向上回溯，检查每个祖先的平衡因子，一旦发现 <code>|bf| &gt; 1</code>，立即通过旋转来修正。旋转后，该子树的高度会降低，从而可能影响更高层的祖先，因此需要继续向上检查，直至根节点。</p>

AVL 的旋转分为四种经典情形，统称为 **LL、RR、LR、RL**（命名依据是**不平衡发生的位置**以及**插入/删除发生在哪个子树**）。

### 2.1 定义符号
设失衡节点为 $x$（即 $|bf(x)| = 2$）。
- 若 $bf(x) = 2$，说明左子树比右子树高 2，问题出在左子树。
  - 若左孩子 $y$ 的平衡因子 $bf(y) \ge 0$（即左子树高或等高），则属于 **LL 型**（插入发生在左孩子的左子树，或删除发生在左孩子的右子树但左子树仍主导）。
  - 若 $bf(y) = -1$，则属于 **LR 型**（左孩子的右子树过重）。
- 若 $bf(x) = -2$，说明右子树比左子树高 2，问题出在右子树。
  - 若右孩子 $y$ 的平衡因子 $bf(y) \le 0$，则属于 **RR 型**。
  - 若 $bf(y) = +1$，则属于 **RL 型**。

以下分别详述各情形的旋转操作（图中的箭头表示指针调整）。

### 2.2 LL 型（右单旋）
**失衡节点** $x$，其左孩子 $y$ 的左子树 $A$ 高度过高。  
**解决方案**：对 $x$ 执行一次**右旋**（与前述右旋完全相同）。旋转后，$y$ 成为新根，$x$ 成为 $y$ 的右孩子，$y$ 原来的右子树 $B$ 变为 $x$ 的左子树。  
**平衡因子变化**：旋转后，$x$ 和 $y$ 的平衡因子均变为 0（假设旋转前 $bf(y)=0$ 时略有不同，但绝对值仍满足）。  
**代码**：与之前 `rotate-Commentright(x)` 相同。

### 2.3 RR 型（左单旋）
对称于 LL，对失衡节点 $x$ 执行**左旋**即可。

### 2.4 LR 型（先左旋后右旋）
**失衡节点** $x$，其左孩子 $y$ 的右子树 $B$ 过高。  
**解决方案**：分两步：
1. 对 $y$ 执行**左旋**（即让 $y$ 的右孩子 $z$ 上升为 $y$ 的父节点），此时转化为 **LL 型**。
2. 对 $x$ 执行**右旋**，最终 $z$ 成为新根。
**平衡因子调整**：需根据旋转前 $z$ 的平衡因子来设置最终的 $x$ 和 $y$ 的平衡因子，通常有三种情况（$z$ 的 $bf$ 为 -1、0、1），但旋转后 $z$ 的 $bf$ 为 0。

### 2.5 RL 型（先右旋后左旋）
对称于 LR，先对右孩子 $y$ 执行右旋，再对 $x$ 执行左旋。

**重要提示**：旋转操作仅会改变少数节点的平衡因子，而不会破坏 BST 性质。每次旋转后，该子树的高度降低 1，因此只需从旋转点向上继续检查父节点即可。

**总结：**

$$
\text{左左型的右旋}
$$

$$
\text{左右型的左右旋}
$$

$$
\text{右右型的左旋}
$$

$$
\text{右左型的右左旋}
$$

---

## 3. 插入操作

插入新节点的过程：
1. 执行标准 BST 插入，将新节点作为叶子插入。
2. 插入后，新节点的平衡因子为 0（左右孩子均为空）。
3. 从新节点的父节点开始，**沿路径向上回溯**，更新每个节点的平衡因子（高度可能变化）。
4. 若某节点的平衡因子绝对值变为 2，则根据上述四种情形进行旋转调整。旋转后，该子树的高度恢复为插入前的高度，因此其祖先的平衡因子无需再调整（可提前终止回溯）。
5. 若没有失衡，则继续向上更新平衡因子，直至根节点。

**复杂度**：插入路径长度为 $O(h)$，每次检查 $O(1)$，单次插入最坏 $O(\log n)$。

---

## 4. 删除操作

与插入不同，删除可能需要在多个祖先节点进行旋转，因为一次删除可能导致多个节点失衡。

常用方法：
1. 按 BST 删除规则删除目标节点（若有两个孩子，则用前驱或后继替换，然后删除该替换节点，实际上转换为删除一个最多只有一个孩子的节点）。
2. 从被删节点的父节点开始，**向上回溯**，更新平衡因子。
3. <p>若某节点失衡（<code>|bf| = 2</code>），执行相应的旋转（注意与插入时的旋转情形判定略有不同，因为删除可能使得失衡节点的孩子平衡因子为 0，此时 <strong>LL</strong> 或 <strong>RR</strong> 型旋转仍有效，但平衡因子的最终值需专门处理）。</p>
4. 旋转后，该子树的高度可能降低，因此**必须继续向上回溯**，因为祖先的平衡因子可能随之改变（不同于插入时旋转后高度不变可提前终止）。
5. 持续到根节点。

**特别注意**：删除时旋转的四种情形与插入完全相同，但判断条件需结合孩子节点的平衡因子，有时当孩子 $bf=0$ 时，单旋转即可解决问题，但旋转后该子树的**高度会降低**，因此可能向上影响，而在插入时若孩子 $bf=0$ 则不会发生失衡（因为插入前该孩子左右等高，插入一侧后其 $bf$ 变为 ±1，会导致父节点失衡，若孩子 $bf=0$ 且插入一侧，父节点可能失衡，此时旋转后高度不变）。

**复杂度**：最坏情况下，删除可能需要沿着整条路径旋转，但总旋转次数仍然 $O(\log n)$，因为路径长度为树高。

---

## 5. 查找与其它操作

查找、求前驱、后继、求排名等只读操作与普通 BST 完全相同，且**不会触发任何结构调整**，因此它们的时间复杂度严格为 $O(\log n)$ 最坏情况，这是 AVL 相比 Splay（单次查找可能 $O(n)$）和 Treap（期望 $\log n$ 但最坏可能 $n$）的决定性优势。

---

## 6. 复杂度分析

### 6.1 最坏情况高度
如前所述，AVL 树的高度 $h$ 满足 $h \le 1.44 \log-Comment2 (n+2) - 0.328$，因此所有操作（查找、插入、删除、合并、分裂，若支持）的最坏时间复杂度均为 $O(\log n)$，且这个界限是**绝对且确定**的，不依赖于任何随机性或输入顺序。

### 6.2 空间复杂度
除 BST 必需的指针外，每个节点需额外存储平衡因子（通常用一个有符号整数表示，范围 -2 到 2，可用 `int8-Commentt`），空间 $O(n)$。若还需要子树大小等，则额外增加。

### 6.3 旋转次数
插入时最多进行**一次**单旋转或双旋转（即常数次）；删除时最多可能进行 $O(\log n)$ 次旋转（但均摊也是 $O(\log n)$）。不过在实际中，删除的旋转频率远低于插入。

---

## 7. AVL 与 Splay、Treap 的对比

By DS

| 维度 | AVL 树 | Splay 树 | Treap (旋转/无旋) |
| :--- | :--- | :--- | :--- |
| **平衡保证** | 严格最坏 $O(\log n)$ | 均摊 $O(\log n)$，单次最坏 $O(n)$ | 期望 $O(\log n)$，最坏 $O(n)$（概率极低） |
| **单次查找最坏** | $O(\log n)$ | $O(n)$（但均摊好） | $O(n)$（概率忽略） |
| **插入/删除最坏** | $O(\log n)$ | 均摊 $O(\log n)$ | 期望 $O(\log n)$ |
| **是否依赖随机数** | 否 | 否 | 是（无旋/旋转均需随机优先级） |
| **实现复杂度** | 中等偏高（平衡因子维护与四种旋转） | 简单（但需透彻理解伸展） | 极简（旋转版）；简洁（无旋版） |
| **空间开销** | 需平衡因子（通常 1 字节） | 需父指针（与 AVL 类似） | 需优先级（4~8 字节） |
| **局部性/缓存友好** | 一般 | 优秀（最近访问节点在根） | 一般 |
| **区间操作支持** | 困难（需额外懒惰标记，代码复杂） | 中等（可通过伸展实现） | 无旋版天生支持 |
| **可持久化** | 较难（旋转需拷贝路径） | 较难（但存在可持久化 Splay） | 无旋版极易 |

---

## 8. 代码实现要点

AVL 的实现需注意平衡因子的维护和旋转判定。以下给出简化的核心框架。


<pre><code class="language-pseudocode">
\begin{algorithmic}
\Comment{每个节点包含：值 val，高度 height，左孩子 left，右孩子 right}

\Function{getHeight}{$p$}
    \If{$p = \text{null}$}
        \State \Return $0$
    \Else
        \State \Return $p.height$
    \EndIf
\EndFunction

\Procedure{updateHeight}{$p$}
    \State $p.height \gets 1 + \max($ getHeight($p.left$), getHeight($p.right$) $)$
\EndProcedure

\Function{getBalance}{$p$}
    \State \Return getHeight($p.left$) $-$ getHeight($p.right$)
\EndFunction

\Comment{右旋（LL 型）}
\Function{rotateRight}{$x$}
    \State $y \gets x.left$
    \State $B \gets y.right$
    \State $y.right \gets x$
    \State $x.left \gets B$
    \State updateHeight($x$)
    \State updateHeight($y$)
    \State \Return $y$   \Comment{新根}
\EndFunction

\Comment{左旋（RR 型）}
\Function{rotateLeft}{$x$}
    \State $y \gets x.right$
    \State $B \gets y.left$
    \State $y.left \gets x$
    \State $x.right \gets B$
    \State updateHeight($x$)
    \State updateHeight($y$)
    \State \Return $y$
\EndFunction

\Function{insert}{$p$, $val$}
    \If{$p = \text{null}$}
        \State \Return 新节点（$val$，初始高度 1，左右孩子为空）
    \EndIf
    \If{$val < p.val$}
        \State $p.left \gets$ insert($p.left$, $val$)
    \ElsIf{$val > p.val$}
        \State $p.right \gets$ insert($p.right$, $val$)
    \Else
        \State \Return $p$   \Comment{不允许重复}
    \EndIf
    \State updateHeight($p$)
    \State $balance \gets$ getBalance($p$)
    \Comment{LL 型}
    \If{$balance > 1$ \AND $val < p.left.val$}
        \State \Return rotateRight($p$)
    \EndIf
    \Comment{RR 型}
    \If{$balance < -1$ \AND $val > p.right.val$}
        \State \Return rotateLeft($p$)
    \EndIf
    \Comment{LR 型}
    \If{$balance > 1$ \AND $val > p.left.val$}
        \State $p.left \gets$ rotateLeft($p.left$)
        \State \Return rotateRight($p$)
    \EndIf
    \Comment{RL 型}
    \If{$balance < -1$ \AND $val < p.right.val$}
        \State $p.right \gets$ rotateRight($p.right$)
        \State \Return rotateLeft($p$)
    \EndIf
    \State \Return $p$
\EndFunction

\Function{deleteNode}{$p$, $val$}
    \If{$p = \text{null}$}
        \State \Return $\text{null}$
    \EndIf
    \If{$val < p.val$}
        \State $p.left \gets$ deleteNode($p.left$, $val$)
    \ElsIf{$val > p.val$}
        \State $p.right \gets$ deleteNode($p.right$, $val$)
    \Else
        \Comment{找到要删除的节点}
        \If{$p.left = \text{null}$ \OR $p.right = \text{null}$}
            \State $tmp \gets p.left$ 或 $p.right$（非空的那个）
            \State 删除 $p$
            \State \Return $tmp$
        \Else
            \Comment{用右子树的最小节点（后继）替换}
            \State $succ \gets p.right$
            \While{$succ.left \neq \text{null}$}
                \State $succ \gets succ.left$
            \EndWhile
            \State $p.val \gets succ.val$
            \State $p.right \gets$ deleteNode($p.right$, $succ.val$)
        \EndIf
    \EndIf
    \If{$p = \text{null}$}
        \State \Return $\text{null}$
    \EndIf
    \State updateHeight($p$)
    \State $balance \gets$ getBalance($p$)
    \Comment{此处为简化，实际需根据左右孩子的平衡因子完整判定四种旋转}
    \Comment{建议编写一个平衡修复函数来处理所有情形}
    \State \Return $p$
\EndFunction
\end{algorithmic}
</code></pre>


**注意**：删除的旋转判定必须同时参考左右孩子的平衡因子，而不是仅靠插入时的 `val` 比较。一个通用的平衡修复函数 `balanceNode(p)` 可以根据 `getBalance(p)` 和左右孩子的 `getBalance` 来分别处理 LL、RR、LR、RL，这样插入和删除均可调用。

