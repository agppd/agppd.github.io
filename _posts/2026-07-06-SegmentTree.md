---
layout: post
title: "C++模板分享——线段树"
date: 2026-07-06
categories: 模板
author: agppd
---

```cpp
/**
 *  @brief A Segment Tree Template for Normal Calc
 *  @param Type The Type of Your Data
 *  @param Op The type of calc (0=sum, 1=max, 2=min)
 *  Its default calc sum
 *  If you want to calc max or min, use operate to redefine operator '+'
 */
template <typename Type, int Op = 0>
class Segmentree
{
private:
    struct SumPolicy
    {
        static Type merge(const Type &a, const Type &b) { return a + b; }
        static Type apply(const Type &val, size_t len) { return val * len; }
        static Type identity() { return Type(0); }
    };

    struct MaxPolicy
    {
        static Type merge(const Type &a, const Type &b) { return a > b ? a : b; }
        static Type apply(const Type &val, size_t /*len*/) { return val; }
        static Type identity() { return std::numeric_limits<Type>::lowest(); }
    };

    struct MinPolicy
    {
        static Type merge(const Type &a, const Type &b) { return a < b ? a : b; }
        static Type apply(const Type &val, size_t /*len*/) { return val; }
        static Type identity() { return std::numeric_limits<Type>::max(); }
    };
    using Policy = typename std::conditional<Op == 0, SumPolicy, typename std::conditional<Op == 1, MaxPolicy, MinPolicy>::type>::type;
    Segmentree *lson;
    Segmentree *rson;
    Type lazy;
    bool hasLazy;
    Type num;
    void build_inline(size_t k, size_t l, size_t r)
    {
        if (l == r)
        {
            num = Type();
            hasLazy = false;
            return;
        }
        size_t mid = (l + r) >> 1;
        lson = new Segmentree();
        lson->build_inline(k, l, mid);
        rson = new Segmentree();
        rson->build_inline(k, mid + 1, r);
        pushup();
    }

    void build_array(size_t k, size_t l, size_t r, const Type *p)
    {
        if (l == r)
        {
            num = p[l - 1];
            hasLazy = false;
            return;
        }
        size_t mid = (l + r) >> 1;
        lson = new Segmentree();
        lson->build_array(k, l, mid, p);
        rson = new Segmentree();
        rson->build_array(k, mid + 1, r, p);
        pushup();
    }

    void pushup()
    {
        num = Policy::merge(lson->num, rson->num);
    }

    void pushdown(size_t l, size_t r)
    {
        if (!hasLazy)
            return;
        size_t mid = (l + r) >> 1;
        lson->num = Policy::apply(lazy, mid - l + 1);
        lson->lazy = lazy;
        lson->hasLazy = true;
        rson->num = Policy::apply(lazy, r - mid);
        rson->lazy = lazy;
        rson->hasLazy = true;
        hasLazy = false;
    }

public:
    /**
     *  @brief Build Tree with size n
     *  @param n The size of the tree (1-based index)
     */
    explicit Segmentree(size_t n) : lson(nullptr), rson(nullptr), lazy(Type()), hasLazy(false), num(Type())
    {
        if (n > 0)
        {
            build_inline(0, 1, n);
        }
    }

    /**
     *  @brief Build Tree with an array
     *  @param l left index (1-based)
     *  @param r right index (1-based)
     *  @param p pointer to array (0-based, actual data from p[0] to p[r-l])
     */
    Segmentree(size_t l, size_t r, const Type *p) : lson(nullptr), rson(nullptr), lazy(Type()), hasLazy(false), num(Type())
    {
        if (l <= r)
        {
            build_array(0, l, r, p);
        }
    }

    /**
     *  @brief Null build (should not be used)
     */
    Segmentree() : Segmentree(0)
    {
        // std::cerr << "Warning: You've built a null segment tree." << std::endl;
    }

    /**
     *  @brief Build Tree from a vector (0-based index)
     *  @param arr The vector containing initial data
     */
    Segmentree(const vector<Type> &arr)
        : Segmentree(1, arr.size(), arr.empty() ? nullptr : arr.data())
    {
    }

    /**
     *  @brief Change a single point to a new value
     *  @param k unused (kept for interface)
     *  @param l current left bound
     *  @param r current right bound
     *  @param x the point to change (1-based)
     *  @param val new value
     */
    void change(size_t k, size_t l, size_t r, size_t x, Type val)
    {
        if (l == r)
        {
            num = val;
            hasLazy = false;
            return;
        }
        pushdown(l, r);
        size_t mid = (l + r) >> 1;
        if (x <= mid)
            lson->change(k, l, mid, x, val);
        else
            rson->change(k, mid + 1, r, x, val);
        pushup();
    }

    /**
     *  @brief Change range [L, R] to val
     *  @param k unused
     *  @param l current left bound
     *  @param r current right bound
     *  @param L target left bound
     *  @param R target right bound
     *  @param val new value
     */
    void change(size_t k, size_t l, size_t r, size_t L, size_t R, Type val)
    {
        if (L <= l && r <= R)
        {
            num = Policy::apply(val, r - l + 1);
            lazy = val;
            hasLazy = true;
            return;
        }
        pushdown(l, r);
        size_t mid = (l + r) >> 1;
        if (L <= mid)
            lson->change(k, l, mid, L, R, val);
        if (R > mid)
            rson->change(k, mid + 1, r, L, R, val);
        pushup();
    }

    /**
     *  @brief Query single point
     *  @param k unused
     *  @param l current left bound
     *  @param r current right bound
     *  @param x point index
     *  @return value at point x
     */
    Type query(size_t k, size_t l, size_t r, size_t x)
    {
        if (l == r)
        {
            return num;
        }
        pushdown(l, r);
        size_t mid = (l + r) >> 1;
        if (x <= mid)
            return lson->query(k, l, mid, x);
        else
            return rson->query(k, mid + 1, r, x);
    }

    /**
     *  @brief Query range [L, R]
     *  @param k unused
     *  @param l current left bound
     *  @param r current right bound
     *  @param L target left bound
     *  @param R target right bound
     *  @return aggregated value over [L, R]
     */
    Type query(size_t k, size_t l, size_t r, size_t L, size_t R)
    {
        if (L <= l && r <= R)
        {
            return num;
        }
        pushdown(l, r);
        size_t mid = (l + r) >> 1;
        Type res = Policy::identity();
        if (L <= mid)
            res = Policy::merge(res, lson->query(k, l, mid, L, R));
        if (R > mid)
            res = Policy::merge(res, rson->query(k, mid + 1, r, L, R));
        return res;
    }

    ~Segmentree()
    {
        delete lson;
        delete rson;
    }
};
```

以这道题目([JDOJ2943](https://neooj.com:8082/oldoj/problem.php?id=2943))为例：

### Description

给出一个序列，要求支持以下操作：  
`1 x y` : 输出 $[x,y]$ 中最大的数字。  
`2 x y` : 将序列的第x个数字改成y。

### Input

第一行一个整数n，表示数列的长度。  
第二行n个数，表示初始的序列。  
第三行一个整数m，表示操作数量。  
接下来m行，每行可能是 `1 x y`，或者 `2 x y`，意义如上。  
强制在线，记上一次输出的答案为last_ans（last_ans初值为0）：  
对于第一个操作 `1 x y` 

$$x = min(x + last_{ans}) \% n + 1, (y + last_{ans}) % n + 1)$$
$$y = max(x + last_{ans}) \% n + 1, (y + last_{ans}) % n + 1)$$

对于第二个操作 `2 x y`

$$x = (x + last_ans) \% n + 1$$
$$y = (y + last_ans) \% n + 1$$

### Output

对于每个1操作，输出 $[x,y]$ 中的最大值。


### Solve

```cpp
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    int n;
    cin >> n;
    int lst = 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];
    Segmentree<int, 1> t(a);
    int q;
    cin >> q;
    while (q--)
    {
        int op, x, y;
        cin >> op >> x >> y;
        if (op == 1)
        {
            int tx = (x + lst) % n + 1;
            int ty = (y + lst) % n + 1;
            int l = min(tx, ty);
            int r = max(tx, ty);
            int ans = t.query(0, 1, n, l, r);
            cout << ans << '\n';
            lst = ans;
        }
        else
        {
            int tx = (x + lst) % n + 1;
            int ty = (y + lst) % n + 1;
            t.change(0, 1, n, tx, ty);
        }
    }
    return 0;
}
```