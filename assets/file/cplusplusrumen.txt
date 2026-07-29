---
layout: post
title: "C++入门"
date: 2026-03-09
categories: 语言基础教程
author: agppd
---

## 1. C++简介
C++是由本贾尼·斯特劳斯特卢普（Bjarne Stroustrup）于1982年在C语言的基础上引入并扩充了面向对象的概念而发明的编程语言。C++的名字源于C语言中的自增运算符"++"，表达了它是C语言的增强版本。

**主要特点**：
- **兼容C语言**：C++几乎完全兼容C语言语法，C程序可以不经修改在C++编译器上运行
- **多范式编程**：支持过程化编程、面向对象编程和泛型编程
- **高性能**：适合系统级开发和对性能要求苛刻的应用
- **底层控制**：提供指针操作，允许直接内存访问

**应用领域**：
- 操作系统（如Windows、Linux内核部分）
- 游戏开发（如Unreal Engine游戏引擎）
- 嵌入式系统
- 高性能服务器
- 数据库系统
- 金融量化交易

---

## 2. 开发环境搭建
### 2.1 编译器选择
- **Windows**：Visual Studio（包含MSVC编译器）、MinGW（g++）、Code::Blocks
- **Linux**：通过包管理器安装g++（`sudo apt install g++`）
- **macOS**：安装Xcode命令行工具（`xcode-select --install`），包含clang++

### 2.2 验证安装
```bash
g++ --version   # Linux/macOS
clang++ --version  # macOS
```

### 2.3 IDE推荐
- Visual Studio Code（轻量，支持插件）
- Visual Studio Community（免费，功能强大）
- CLion（商业，功能全面）
- Code::Blocks（开源，跨平台）

---

## 3. 第一个C++程序
创建一个文件 `hello.cpp`：
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

### 3.1 编译与运行
```bash
g++ hello.cpp -o hello
./hello    # Linux/macOS
hello.exe  # Windows
```

### 3.2 程序解析
- `#include <iostream>`：包含输入输出流库
- `std::cout`：标准输出流对象，位于`std`命名空间
- `<<`：流插入运算符
- `std::endl`：输出换行并刷新缓冲区

---

## 4. C++对C的扩充
C++在C语言的基础上增加了许多新特性，使编程更安全、高效：

| 特性 | C语言 | C++ |
|------|-------|-----|
| 输入输出 | `printf`/`scanf` | `cout`/`cin`（类型安全） |
| 动态内存 | `malloc`/`free` | `new`/`delete`（自动计算大小） |
| 函数 | 不支持重载 | 支持函数重载 |
| 参数 | 不支持默认参数 | 支持缺省参数 |
| 类型检查 | 较宽松 | 更严格 |
| 编程范式 | 过程式 | 多范式 |

---

## 5. 命名空间
命名空间（namespace）用于解决命名冲突问题，将标识符限定在不同的作用域中。

### 5.1 定义命名空间
```cpp
namespace MySpace {
    int value = 100;
    void func() {
        std::cout << "Hello from MySpace" << std::endl;
    }
}

namespace Outer {
    int x = 10;
    namespace Inner {    // 嵌套命名空间
        int y = 20;
    }
}
```

### 5.2 使用命名空间成员
```cpp
// 方式1：使用作用域解析运算符::
std::cout << MySpace::value << std::endl;

// 方式2：using声明（引入单个成员）
using MySpace::func;
func();

// 方式3：using指令（引入整个命名空间，谨慎使用）
using namespace std;
cout << "Hello" << endl;
```

### 5.3 std命名空间
C++标准库的所有功能都定义在`std`命名空间中：
```cpp
#include <iostream>
#include <vector>
#include <string>

// 日常练习可以展开，但大型项目建议使用std::
using namespace std;
```

---

## 6. C++输入输出
C++使用流（stream）进行输入输出，相比C语言的`printf`/`scanf`，C++的输入输出更安全、更直观。

### 6.1 基本输入输出
```cpp
#include <iostream>
using namespace std;

int main() {
    int age;
    string name;
    double salary;

    // 输出
    cout << "请输入姓名、年龄和薪水：";
    
    // 输入
    cin >> name >> age >> salary;
    
    // 输出结果
    cout << "姓名：" << name << endl;
    cout << "年龄：" << age << "，薪水：" << salary << endl;
    
    return 0;
}
```

### 6.2 输入输出特点
- **自动识别类型**：不需要像`printf`那样指定格式符
- **类型安全**：编译时检查类型匹配
- **可扩展**：支持自定义类型的输入输出（通过运算符重载）
- **连续操作**：支持链式表达式`cout << a << b << c`

### 6.3 格式化输出
```cpp
#include <iomanip>  // 格式化输出头文件

double pi = 3.1415926535;
cout << fixed << setprecision(2) << pi << endl;  // 3.14
cout << setw(10) << setfill('*') << 123 << endl; // *******123
```

---

## 7. 函数特性
### 7.1 函数重载
C++允许在同一作用域中声明多个同名函数，只要参数列表不同（参数个数、类型或顺序不同）。

```cpp
#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << add(3, 5) << endl;        // 调用int版本
    cout << add(3.5, 2.7) << endl;    // 调用double版本
    cout << add(1, 2, 3) << endl;     // 调用三个参数版本
    return 0;
}
```

### 7.2 缺省参数（默认参数）
可以为函数的参数指定默认值，调用时如果不传参则使用默认值。

```cpp
void greet(string name = "游客", string prefix = "欢迎") {
    cout << prefix << "，" << name << "！" << endl;
}

int main() {
    greet();                 // 欢迎，游客！
    greet("张三");           // 欢迎，张三！
    greet("李四", "Hello");  // Hello，李四！
    return 0;
}
```

**规则**：
- 缺省参数必须从右向左连续设置
- 函数声明和定义不能同时设置缺省参数（通常在声明中设置）
- 缺省值可以是常量、全局变量或函数调用

### 7.3 内联函数
使用`inline`关键字修饰的函数称为内联函数，编译器会在调用处将函数体展开，避免函数调用的开销。

```cpp
inline int square(int x) {
    return x * x;
}

// 适用于短小、频繁调用的函数
// 递归函数、过长函数不会真正内联
```

**内联与宏的区别**：
```cpp
#define SQUARE(x) x*x          // 宏，有副作用
inline int square(int x) {      // 内联函数，类型安全
    return x * x;
}
// 宏：SQUARE(1+2) 展开为 1+2*1+2 = 5（错误）
// 内联：square(1+2) 正常计算为9
```

---

## 8. 引用
引用（Reference）是C++对C语言的重要扩充，相当于给变量起别名。

### 8.1 引用的定义
```cpp
int a = 10;
int &b = a;  // b是a的引用（别名）

b = 20;      // 修改b等价于修改a
cout << a;   // 输出20
```

### 8.2 引用特点
- **必须初始化**：定义引用时必须指定被引用的对象
- **不可改变**：一旦引用某个变量，不能再引用其他变量
- **无独立空间**：引用和被引用变量共享同一块内存

### 8.3 引用作参数
引用常用于函数参数，避免传值拷贝，且可以修改实参。

```cpp
// 交换两个数（C语言需用指针）
void swap(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 3, b = 5;
    swap(a, b);           // a=5, b=3（直接传变量即可）
    return 0;
}
```

### 8.4 引用作返回值
```cpp
int arr[5] = {1, 2, 3, 4, 5};

// 返回引用，可以作左值
int& getElement(int index) {
    return arr[index];
}

int main() {
    getElement(2) = 100;   // 修改arr[2]为100
    cout << arr[2];         // 输出100
    return 0;
}
```

**注意**：不要返回局部变量的引用（函数返回后局部变量被销毁）。

### 8.5 常引用
```cpp
const int &ref = a;   // 常引用，不能通过ref修改a
```

### 8.6 引用与指针的区别
| 特性 | 引用 | 指针 |
|------|------|------|
| 初始化 | 必须初始化 | 可以不初始化 |
| 可改变指向 | 不可改变 | 可以改变指向 |
| 空值 | 不能为空 | 可以为NULL |
| 解引用 | 自动处理 | 需用*运算符 |
| 多级 | 无多级引用 | 有多级指针 |
| sizeof | 返回被引用类型大小 | 返回指针本身大小 |

---

## 9. 动态内存管理
C++使用`new`和`delete`进行动态内存分配，相比C的`malloc`/`free`更安全、方便。

### 9.1 基本用法
```cpp
// 分配单个变量
int *p = new int;        // 分配，未初始化
int *q = new int(10);    // 分配并初始化为10
delete p;                // 释放内存
delete q;

// 分配数组
int *arr = new int[100];  // 分配100个int
delete[] arr;             // 释放数组（注意[]）
```

### 9.2 new的特点
- **自动计算大小**：不需要`sizeof`运算符
- **返回具体类型指针**：不需要类型转换
- **调用构造函数**：为对象分配时会调用构造函数
- **可初始化**：可以直接初始化分配的内存

### 9.3 动态内存分配示例
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "请输入数组大小：";
    cin >> n;
    
    // 动态分配数组（大小可在运行时确定）
    int *dynamicArray = new int[n];
    
    // 赋值
    for (int i = 0; i < n; i++) {
        dynamicArray[i] = i * 10;
    }
    
    // 输出
    for (int i = 0; i < n; i++) {
        cout << dynamicArray[i] << " ";
    }
    
    // 释放内存
    delete[] dynamicArray;
    
    return 0;
}
```

### 9.4 内存泄漏
动态分配的内存必须显式释放，否则会造成内存泄漏。

```cpp
void badFunction() {
    int *p = new int(100);
    // 忘记 delete p，内存泄漏
}
```

---

## 10. 面向对象编程基础
面向对象编程（OOP）是C++的核心特性，它将数据和操作数据的方法封装在一起。

### 10.1 面向对象的三大特性
1. **封装**：将数据和操作数据的方法捆绑在一起，隐藏内部实现细节
2. **继承**：从已有类派生出新类，复用基类的成员
3. **多态**：同一操作作用于不同对象产生不同执行结果

### 10.2 类与对象的概念
- **类（Class）**：对一类事物的抽象描述，相当于蓝图
- **对象（Object）**：类的具体实例，占用实际内存

---

## 11. 类和对象
### 11.1 类的定义
```cpp
class Student {
private:        // 私有成员，只能在类内部访问
    string name;
    int age;
    double score;

public:         // 公有成员，任何地方都可访问
    // 成员函数（方法）
    void setName(string n) {
        name = n;
    }
    
    string getName() {
        return name;
    }
    
    void setAge(int a) {
        if (a > 0 && a < 150) {  // 数据验证
            age = a;
        }
    }
    
    void display() {
        cout << "姓名：" << name << "，年龄：" << age << endl;
    }
};
```

### 11.2 访问修饰符
- **private**：私有成员，只能在类内部访问（默认）
- **public**：公有成员，任何地方都可访问
- **protected**：保护成员，类内部和派生类可访问

### 11.3 创建和使用对象
```cpp
int main() {
    Student stu1;              // 栈上创建对象
    stu1.setName("张三");
    stu1.setAge(20);
    stu1.display();
    
    // 动态创建对象
    Student *pStu = new Student();
    pStu->setName("李四");      // 指针用->访问成员
    pStu->setAge(22);
    pStu->display();
    delete pStu;
    
    return 0;
}
```

### 11.4 成员函数定义
成员函数可以在类内定义（自动成为内联函数），也可以在类外定义：

```cpp
class Circle {
private:
    double radius;
public:
    void setRadius(double r);   // 声明
    double getArea();           // 声明
};

// 类外定义，使用::作用域解析运算符
void Circle::setRadius(double r) {
    radius = r;
}

double Circle::getArea() {
    return 3.14159 * radius * radius;
}
```

---

## 12. 构造函数与析构函数
### 12.1 构造函数
构造函数在创建对象时自动调用，用于初始化对象。

```cpp
class Rectangle {
private:
    double width;
    double height;
    
public:
    // 默认构造函数（无参）
    Rectangle() {
        width = 0;
        height = 0;
        cout << "默认构造函数被调用" << endl;
    }
    
    // 带参构造函数
    Rectangle(double w, double h) {
        width = w;
        height = h;
    }
    
    // 构造函数重载
    Rectangle(double side) {  // 正方形
        width = side;
        height = side;
    }
    
    double area() {
        return width * height;
    }
};
```

### 12.2 初始化列表
使用初始化列表初始化成员变量，效率更高：

```cpp
class Point {
private:
    int x;
    int y;
    const int id;        // 常量成员
    int &ref;            // 引用成员
public:
    // 初始化列表语法
    Point(int xVal, int yVal, int _id, int &r) 
        : x(xVal), y(yVal), id(_id), ref(r) {
        // 构造函数体
    }
};
```

**必须使用初始化列表的情况**：
- 常量成员（const）
- 引用成员
- 没有默认构造函数的对象成员

### 12.3 析构函数
析构函数在对象销毁时自动调用，用于释放资源。

```cpp
class String {
private:
    char *str;
public:
    String(const char *s) {
        str = new char[strlen(s) + 1];
        strcpy(str, s);
    }
    
    ~String() {  // 析构函数，名称前加~
        delete[] str;
        cout << "析构函数被调用，资源已释放" << endl;
    }
    
    void display() {
        cout << str << endl;
    }
};
```

### 12.4 拷贝构造函数
用于用一个对象初始化另一个同类型对象。

```cpp
class MyClass {
private:
    int *data;
public:
    // 普通构造函数
    MyClass(int val) {
        data = new int(val);
    }
    
    // 拷贝构造函数（深拷贝）
    MyClass(const MyClass &other) {
        data = new int(*(other.data));  // 重新分配内存
    }
    
    // 析构函数
    ~MyClass() {
        delete data;
    }
};
```

**浅拷贝 vs 深拷贝**：当类中有指针成员时，默认的拷贝构造函数进行浅拷贝（只复制指针值），可能导致多个对象指向同一块内存，析构时重复释放。需要自定义拷贝构造函数实现深拷贝。

---

## 13. 继承
继承是从已有类派生出新类的机制，新类继承基类的成员，并可添加新的成员或修改继承来的成员。

### 13.1 基本语法
```cpp
// 基类（父类）
class Animal {
protected:
    string name;
    int age;
public:
    void setName(string n) { name = n; }
    void setAge(int a) { age = a; }
    void eat() {
        cout << name << "正在吃东西" << endl;
    }
};

// 派生类（子类）
class Dog : public Animal {  // 公有继承
private:
    string breed;  // 品种
public:
    void bark() {
        cout << name << "汪汪叫" << endl;
    }
    
    void setBreed(string b) { breed = b; }
};

class Cat : public Animal {
public:
    void meow() {
        cout << name << "喵喵叫" << endl;
    }
};
```

### 13.2 使用派生类
```cpp
int main() {
    Dog dog;
    dog.setName("旺财");
    dog.setAge(3);
    dog.eat();      // 继承来的方法
    dog.bark();     // 自己的方法
    
    Cat cat;
    cat.setName("咪咪");
    cat.meow();
    
    return 0;
}
```

### 13.3 继承方式

| 继承方式 | 基类public | 基类protected | 基类private |
|----------|------------|---------------|-------------|
| public继承 | 变为public | 变为protected | 不可访问 |
| protected继承 | 变为protected | 变为protected | 不可访问 |
| private继承 | 变为private | 变为private | 不可访问 |

### 13.4 派生类的构造函数
派生类的构造函数需要调用基类的构造函数初始化基类部分。

```cpp
class Employee {
protected:
    string name;
    int id;
public:
    Employee(string n, int i) : name(n), id(i) {}
    void display() {
        cout << "姓名：" << name << "，工号：" << id;
    }
};

class Manager : public Employee {
private:
    double bonus;
public:
    // 调用基类构造函数初始化基类部分
    Manager(string n, int i, double b) : Employee(n, i), bonus(b) {}
    
    void display() {
        Employee::display();  // 调用基类的display
        cout << "，奖金：" << bonus << endl;
    }
};
```

---

## 14. 多态
多态是指同一操作作用于不同对象时产生不同的执行结果。C++通过虚函数实现多态。

### 14.1 静态多态 vs 动态多态
- **静态多态**：函数重载、运算符重载，编译时确定
- **动态多态**：虚函数，运行时确定

### 14.2 虚函数
```cpp
class Shape {
public:
    virtual double area() {  // 虚函数
        return 0;
    }
    
    virtual void display() {  // 虚函数
        cout << "这是一个形状" << endl;
    }
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    
    virtual double area() override {  // C++11 override关键字
        return 3.14159 * radius * radius;
    }
    
    virtual void display() override {
        cout << "这是一个圆，半径：" << radius << endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    virtual double area() override {
        return width * height;
    }
};
```

### 14.3 多态的使用
```cpp
void printArea(Shape *pShape) {  // 可以接收任何派生类对象
    cout << "面积：" << pShape->area() << endl;
}

int main() {
    Circle circle(5.0);
    Rectangle rect(4.0, 6.0);
    
    Shape *p1 = &circle;
    Shape *p2 = &rect;
    
    p1->display();  // 输出圆的描述
    p2->display();  // 输出矩形的描述
    
    printArea(p1);  // 计算圆面积
    printArea(p2);  // 计算矩形面积
    
    return 0;
}
```

### 14.4 纯虚函数与抽象类
包含纯虚函数的类称为抽象类，不能实例化。

```cpp
class Animal {  // 抽象类
public:
    virtual void speak() = 0;  // 纯虚函数
    virtual void move() = 0;   // 纯虚函数
};

class Dog : public Animal {
public:
    virtual void speak() override {
        cout << "汪汪汪" << endl;
    }
    virtual void move() override {
        cout << "四条腿跑" << endl;
    }
};
```

### 14.5 虚析构函数
基类的析构函数应该声明为虚函数，确保正确调用派生类的析构函数。

```cpp
class Base {
public:
    virtual ~Base() {
        cout << "Base析构" << endl;
    }
};

class Derived : public Base {
private:
    int *data;
public:
    Derived() {
        data = new int[100];
    }
    virtual ~Derived() {
        delete[] data;
        cout << "Derived析构" << endl;
    }
};
```

---

## 15. 运算符重载
C++允许重载大部分运算符，使自定义类型使用起来像内置类型一样自然。

### 15.1 基本语法
```cpp
class Complex {
private:
    double real;
    double imag;
public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
    
    // 重载+运算符（成员函数形式）
    Complex operator+(const Complex &other) const {
        return Complex(real + other.real, imag + other.imag);
    }
    
    // 重载==运算符
    bool operator==(const Complex &other) const {
        return (real == other.real) && (imag == other.imag);
    }
    
    // 重载<<运算符（友元函数形式）
    friend ostream& operator<<(ostream &os, const Complex &c);
    
    void display() {
        cout << real << " + " << imag << "i" << endl;
    }
};

// 重载<<运算符（全局函数）
ostream& operator<<(ostream &os, const Complex &c) {
    os << c.real << " + " << c.imag << "i";
    return os;
}
```

### 15.2 使用重载运算符
```cpp
int main() {
    Complex c1(3, 4);
    Complex c2(1, 2);
    
    Complex c3 = c1 + c2;    // 调用operator+
    cout << c3 << endl;      // 调用operator<<
    
    if (c1 == c2) {
        cout << "相等" << endl;
    } else {
        cout << "不相等" << endl;
    }
    
    return 0;
}
```

### 15.3 可重载的运算符
大多数运算符都可以重载，如`+ - * / % ^ & | ~ ! = < > += -= *= /=`等，不能重载的有`.`、`.*`、`::`、`?:`、`sizeof`。

---

## 16. 模板
模板是实现泛型编程的工具，允许编写与类型无关的代码。

### 16.1 函数模板
```cpp
// 交换两个值
template <typename T>
void mySwap(T &a, T &b) {
    T temp = a;
    a = b;
    b = temp;
}

// 查找数组中的最大值
template <class T>
T maxElement(T arr[], int size) {
    T max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int main() {
    int x = 3, y = 5;
    mySwap(x, y);           // T自动推导为int
    
    double a = 1.5, b = 2.5;
    mySwap<double>(a, b);   // 显式指定T为double
    
    int arr1[] = {1, 5, 3, 7, 2};
    cout << maxElement(arr1, 5) << endl;  // 7
    
    double arr2[] = {1.5, 2.7, 3.2, 0.8};
    cout << maxElement(arr2, 4) << endl;  // 3.2
    
    return 0;
}
```

### 16.2 类模板
```cpp
// 栈类模板
template <typename T, int MAX = 100>
class Stack {
private:
    T data[MAX];
    int top;
public:
    Stack() : top(-1) {}
    
    bool push(const T &value) {
        if (top >= MAX - 1) return false;
        data[++top] = value;
        return true;
    }
    
    bool pop(T &value) {
        if (top < 0) return false;
        value = data[top--];
        return true;
    }
    
    bool isEmpty() {
        return top < 0;
    }
};

int main() {
    Stack<int> intStack;           // 默认大小100
    Stack<double, 50> doubleStack; // 指定大小50
    
    intStack.push(10);
    intStack.push(20);
    
    int val;
    intStack.pop(val);
    cout << val << endl;  // 20
    
    return 0;
}
```

---

## 17. 标准模板库STL
C++标准模板库（STL）是一组通用的模板类和函数，实现了常用的数据结构和算法。

### 17.1 STL组成
- **容器**：存储数据的类（vector、list、map等）
- **算法**：操作容器的函数（sort、find、copy等）
- **迭代器**：连接容器和算法的桥梁

### 17.2 vector容器
动态数组，支持随机访问。

```cpp
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    // 创建vector
    vector<int> v1;               // 空vector
    vector<int> v2(10, 5);        // 10个5
    vector<int> v3 = {1, 2, 3, 4, 5};  // 初始化列表
    
    // 添加元素
    v1.push_back(10);
    v1.push_back(20);
    v1.push_back(30);
    
    // 访问元素
    cout << v1[0] << endl;        // 10，不检查越界
    cout << v1.at(1) << endl;     // 20，检查越界
    
    // 遍历
    for (int i = 0; i < v1.size(); i++) {
        cout << v1[i] << " ";
    }
    
    // 使用迭代器遍历
    for (auto it = v1.begin(); it != v1.end(); it++) {
        cout << *it << " ";
    }
    
    // 范围for循环（C++11）
    for (int x : v1) {
        cout << x << " ";
    }
    
    // 常用操作
    v1.pop_back();                 // 删除最后一个
    cout << v1.size() << endl;     // 当前大小
    cout << v1.capacity() << endl; // 当前容量
    v1.clear();                    // 清空
    
    return 0;
}
```

### 17.3 string类
C++的字符串类，比C风格字符串更方便安全。

```cpp
#include <string>

int main() {
    string s1 = "Hello";
    string s2("World");
    string s3 = s1 + " " + s2;  // 拼接
    
    cout << s3 << endl;          // Hello World
    cout << s3.length() << endl; // 长度
    cout << s3[0] << endl;       // H
    
    // 常用方法
    s3.append("!");              // 追加
    s3.insert(5, ",");           // 插入
    s3.replace(6, 5, "C++");     // 替换
    size_t pos = s3.find("C++"); // 查找
    
    // 子串
    string sub = s3.substr(0, 5); // Hello
    
    // 转换为C风格字符串
    const char *cstr = s3.c_str();
    
    return 0;
}
```

### 17.4 map容器
关联容器，存储键值对。

```cpp
#include <map>

int main() {
    map<string, int> scores;
    
    // 插入元素
    scores["张三"] = 95;
    scores["李四"] = 87;
    scores.insert(pair<string, int>("王五", 92));
    
    // 访问
    cout << scores["张三"] << endl;  // 95
    
    // 检查是否存在
    if (scores.count("赵六") > 0) {
        cout << scores["赵六"] << endl;
    }
    
    // 遍历
    for (auto &p : scores) {
        cout << p.first << ": " << p.second << endl;
    }
    
    // 使用迭代器
    auto it = scores.find("李四");
    if (it != scores.end()) {
        cout << "找到：" << it->second << endl;
    }
    
    return 0;
}
```

### 17.5 常用算法
```cpp
#include <algorithm>
#include <vector>

int main() {
    vector<int> v = {5, 2, 8, 1, 9, 3};
    
    // 排序
    sort(v.begin(), v.end());                    // 升序
    sort(v.begin(), v.end(), greater<int>());    // 降序
    
    // 查找
    auto it = find(v.begin(), v.end(), 8);
    if (it != v.end()) {
        cout << "找到：" << *it << endl;
    }
    
    // 反转
    reverse(v.begin(), v.end());
    
    // 最大值/最小值
    auto maxIt = max_element(v.begin(), v.end());
    auto minIt = min_element(v.begin(), v.end());
    
    // 计数
    int cnt = count(v.begin(), v.end(), 3);
    
    // 复制
    vector<int> dest(v.size());
    copy(v.begin(), v.end(), dest.begin());
    
    return 0;
}
```

---

## 18. 异常处理
异常处理用于处理程序运行时的错误情况，使程序更加健壮。

### 18.1 基本语法
```cpp
#include <iostream>
#include <stdexcept>  // 标准异常
using namespace std;

double divide(double a, double b) {
    if (b == 0) {
        throw runtime_error("除数不能为0");  // 抛出异常
    }
    return a / b;
}

int main() {
    double x, y;
    cout << "输入两个数：";
    cin >> x >> y;
    
    try {
        double result = divide(x, y);
        cout << "结果：" << result << endl;
    }
    catch (const runtime_error &e) {  // 捕获特定异常
        cout << "错误：" << e.what() << endl;
    }
    catch (...) {  // 捕获任何异常
        cout << "未知错误" << endl;
    }
    
    return 0;
}
```

### 18.2 标准异常类
C++标准库提供了多种异常类，都继承自`exception`：
- `logic_error`：逻辑错误
- `runtime_error`：运行时错误
- `bad_alloc`：内存分配失败
- `out_of_range`：越界访问

---

## 19. 文件操作
C++使用`fstream`库进行文件读写。

### 19.1 文件流类
- `ifstream`：输入文件流（读文件）
- `ofstream`：输出文件流（写文件）
- `fstream`：文件流（读写）

### 19.2 写文件
```cpp
#include <fstream>

int main() {
    // 创建输出文件流
    ofstream outFile("data.txt");
    
    if (!outFile.is_open()) {
        cerr << "文件打开失败" << endl;
        return 1;
    }
    
    // 写入数据
    outFile << "姓名：张三" << endl;
    outFile << "年龄：20" << endl;
    outFile << "成绩：95.5" << endl;
    
    // 关闭文件
    outFile.close();
    
    return 0;
}
```

### 19.3 读文件
```cpp
#include <fstream>
#include <string>

int main() {
    ifstream inFile("data.txt");
    
    if (!inFile) {  // 也可以这样判断
        cerr << "文件打开失败" << endl;
        return 1;
    }
    
    string line;
    // 逐行读取
    while (getline(inFile, line)) {
        cout << line << endl;
    }
    
    // 也可以使用>>运算符读取
    // string name;
    // int age;
    // double score;
    // inFile >> name >> age >> score;
    
    inFile.close();
    return 0;
}
```

### 19.4 二进制文件读写
```cpp
struct Student {
    char name[20];
    int age;
    double score;
};

int main() {
    Student stu = {"张三", 20, 95.5};
    
    // 写二进制文件
    ofstream outFile("student.dat", ios::binary);
    outFile.write(reinterpret_cast<char*>(&stu), sizeof(stu));
    outFile.close();
    
    // 读二进制文件
    Student stu2;
    ifstream inFile("student.dat", ios::binary);
    inFile.read(reinterpret_cast<char*>(&stu2), sizeof(stu2));
    inFile.close();
    
    cout << stu2.name << " " << stu2.age << " " << stu2.score << endl;
    
    return 0;
}
```
