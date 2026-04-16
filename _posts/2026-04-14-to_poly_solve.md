---
layout: post
title: "解三角形"
date: 2026-04-14
categories: [数学,工程]
author: agppd
---
~~这篇文章的背景是，作者的数学太“好”了，解三角形一个没解出来，写个用计算机辅助计算的文章~~

~~其实，是已经疯了……~~

我们约定：
- 大写字母 `A, B, C` 表示三角形内角  
- 小写字母 `a, b, c` 表示对应角的对边（即 `a` 对 `A`，`b` 对 `B`，`c` 对 `C`）


## 1. 加载包

```maxima
load(to_poly_solve)$
```

---

## 2. 基础边角求值

### 2.1 已知两角一边（AAS/ASA）

```maxima
/* 已知 A=30°, B=45°, a=10 */
A: %pi/6; B: %pi/4; a: 10;
C: %pi - A - B;
/* 正弦定理求 b */
sol_b: to_poly_solve(a/sin(A)=b/sin(B), b);
b: rhs(first(sol_b));
/* 求 c */
sol_c: to_poly_solve(a/sin(A)=c/sin(C), c);
c: rhs(first(sol_c));
/* 输出数值 */
float([b, c, C*180/%pi]);
```

### 2.2 已知两边及夹角（SAS）

```maxima
/* 已知 b=5, c=7, A=60° */
b:5; c:7; A: %pi/3;
/* 余弦定理求 a */
eq_a: a^2 = b^2 + c^2 - 2*b*c*cos(A);
sol_a: to_poly_solve(eq_a, a);
a: rhs(assume(a>0), first(sol_a));
/* 余弦定理求角 B（避免正弦两解） */
eq_B: cos(B) = (a^2 + c^2 - b^2)/(2*a*c);
sol_B: to_poly_solve(eq_B, B);
B: rhs(first(sol_B));
C: %pi - A - B;
float([a, B*180/%pi, C*180/%pi]);
```

### 2.3 已知三边（SSS）

```maxima
/* 已知 a=8, b=6, c=5 */
a:8; b:6; c:5;
eq_A: cos(A) = (b^2 + c^2 - a^2)/(2*b*c);
A: rhs(first(to_poly_solve(eq_A, A)));
eq_B: cos(B) = (a^2 + c^2 - b^2)/(2*a*c);
B: rhs(first(to_poly_solve(eq_B, B)));
C: %pi - A - B;
float([A, B, C]*180/%pi);
```

### 2.4 已知两边及对角（SSA，两解自动筛选）

```maxima
/* 已知 a=12, b=15, A=40° */
a:12; b:15; A: 40*%pi/180;
/* 正弦定理求 sinB，得到两个候选角 */
B1: asin(b*sin(A)/a);
B2: %pi - B1;
/* 自动筛选使 A+B < π 且 B>0 的解 */
candidates: [];
if A+B1 < %pi and B1>0 then candidates: cons(B1, candidates);
if A+B2 < %pi and B2>0 then candidates: cons(B2, candidates);
/* 输出有效解 */
for B in candidates do (
    C: %pi - A - B,
    c: a*sin(C)/sin(A),
    print("解: B =", float(B*180/%pi), "°, C =", float(C*180/%pi), "°, c =", float(c))
)$
```

---

## 3. 条件方程与三角形形状判断（边化角）

### 3.1 判断等腰：`a cos B = b cos A`

```maxima
/* 边化角：a = 2R sin A, b = 2R sin B */
eq: sin(A)*cos(B) - sin(B)*cos(A) = 0;
sol: to_poly_solve(eq, A-B);   /* 得 A-B = π*k */
/* 利用三角形内角范围自动取 k=0 */
assume(A>0, A<%pi, B>0, B<%pi, A+B<%pi);
/* 代入 k=0 得 A=B */
print("三角形为等腰")$
```

### 3.2 求角大小：`sin A = 2 sin B cos C` 且 `b=c`

```maxima
assume(A>0, A<%pi, B>0, B<%pi, C>0, C<%pi)$
/* 由 b=c 得 B=C，且 A+2B=π */
B: (%pi - A)/2;
C: B;
eq: sin(A) - 2*sin(B)*cos(C) = 0;
/* 化简后 sin A = sin(π - A) 恒成立，需额外条件求具体值 */
/* 例如已知 a=√3 b，可加方程 */
```

---

## 4. 复杂混合条件

以 $\sqrt c + a = b \cos C - c \cos B$

### 4.1 代数化简（自动完成）

```maxima
/* 用余弦定理替换 cos */
cosC: (a^2 + b^2 - c^2)/(2*a*b);
cosB: (a^2 + c^2 - b^2)/(2*a*c);
/* 原方程 */
eq_raw: sqrt(c) + a = b*cosC - c*cosB;
/* 化简（自动消去分母） */
eq_simple: ratsimp(eq_raw);
/* 输出简化方程：sqrt(c) = (b^2 - c^2 - a^2)/a */
```

### 4.2 数值求解（a=5, b=7）

```maxima
a:5; b:7;
/* 直接使用简化形式 */
eq: sqrt(c) = (b^2 - c^2 - a^2)/a;
/* 平方并求解多项式 */
eq_sq: (lhs(eq))^2 = (rhs(eq))^2;
poly_eq: lhs(eq_sq) - rhs(eq_sq);
sols: to_poly_solve(poly_eq=0, c);
/* 筛选实数正根并验证原方程 */
c_candidates: [];
for sol in sols do (
    cand: rhs(sol),
    if freeof(%z, cand) and numberp(float(cand)) and cand>0 then
        c_candidates: append(c_candidates, [cand])
);
for c_val in c_candidates do (
    c: c_val,
    lhs_val: sqrt(c) + a,
    rhs_val: (b^2 - c^2)/a,
    if abs(lhs_val - rhs_val) < 1e-8 then
        print("有效解 c =", c_val)
    else
        print("增根 c =", c_val)
);
```

### 4.3 符号参数求解（a,b 未赋值）

```maxima
assume(a>0, b>0, c>0)$
eq: sqrt(c) = (b^2 - c^2 - a^2)/a;
eq_sq: c = (b^2 - c^2 - a^2)^2 / a^2;
sol_sym: to_poly_solve(eq_sq, c);   /* 返回四次方程的符号解 */
```

---

## 5. 通用筛选函数

```maxima
/* 自动从通解中提取三角形内角有效值 */
valid_angle(sol, var) := block(
    [params, vals, res],
    res: [],
    for s in sol do (
        params: listofvars(rhs(s)),
        for k: -2 thru 2 do (
            vals: subst(k, %z, rhs(s)),
            if vals > 0 and vals < %pi then res: cons(vals, res)
        )
    ),
    return(res)
)$
```
