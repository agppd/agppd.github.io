---
layout: post
title: "不等式"
date: 2026-04-16
categories: 数学
author: agppd
---

在数学中，对于两个正数 $a, b > 0$，我们常定义以下四种平均值：

- **算术平均（Arithmetic Mean, AM）**：  
  $
  AM = \frac{a+b}{2}
  $

- **几何平均（Geometric Mean, GM）**：  
  $
  GM = \sqrt{ab}
  $

- **调和平均（Harmonic Mean, HM）**：  
  $
  HM = \frac{2}{\frac{1}{a}+\frac{1}{b}} = \frac{2ab}{a+b}
  $

- **平方平均（Quadratic Mean, QM）**：  
  $
  QM = \sqrt{\frac{a^2+b^2}{2}}
  $

这四个平均值之间存在确定的大小关系，构成一条完整的不等式链：

$
HM \;\le\; GM \;\le\; AM \;\le\; QM
$

等号成立当且仅当 $a = b$。若将边界纳入，也可写作：

$
\min(a,b) \;\le\; HM \;\le\; GM \;\le\; AM \;\le\; QM \;\le\; \max(a,b)
$

上述链条可以拆解为三个独立的不等式对，每个都有对应的国际通用名称：

- **AM–GM 不等式**（算术平均 ≥ 几何平均）：  
  $
  \frac{a+b}{2} \;\ge\; \sqrt{ab}
  $

- **GM–HM 不等式**（几何平均 ≥ 调和平均）：  
  $
  \sqrt{ab} \;\ge\; \frac{2ab}{a+b}
  $

- **QM–AM 不等式**（平方平均 ≥ 算术平均）：  
  $
  \sqrt{\frac{a^2+b^2}{2}} \;\ge\; \frac{a+b}{2}
  $

这三个不等式共同构成了均值不等式链的核心内容。对于 $n$ 个正数的情况，该链同样成立，只需将定义相应地推广为：

- $AM = \frac{a_1+\cdots+a_n}{n}$
- $GM = \sqrt[n]{a_1 a_2 \cdots a_n}$
- $HM = \frac{n}{\frac{1}{a_1}+\cdots+\frac{1}{a_n}}$
- $QM = \sqrt{\frac{a_1^2+\cdots+a_n^2}{n}}$

此时仍有 $HM \le GM \le AM \le QM$，等号成立当且仅当所有数相等。

---
*参考：数学帝国*