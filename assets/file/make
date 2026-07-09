---
layout: post
title: "make与cmake教程"
date: 2026-04-04
categories: [技术,工程]
author: agppd
---

本文大部分采用Deepseek生成

~~我才不说我是因为懒得写了~~

## 1. 为什么需要构建工具？

在软件开发中，一个项目通常包含多个源文件、头文件、库依赖等。手动编译每个文件并链接会非常繁琐：

```bash
gcc -c main.c -o main.o
gcc -c utils.c -o utils.o
gcc main.o utils.o -o myapp
```

当文件数量增多、依赖关系复杂时，手动编译几乎不可行。**构建工具**（如 make 和 CMake）可以自动化这个过程，只重新编译修改过的文件，并管理复杂的依赖关系。

- **make**：经典的构建工具，通过 `Makefile` 定义规则，直接调用编译器。
- **CMake**：更高层次的构建系统生成器，它能生成不同平台的构建文件（如 Makefile、Ninja、Visual Studio 工程），实现跨平台构建。

---

## 2. Make 基础教程

### 2.1 什么是 Make？

Make 是一个自动化构建工具，读取 `Makefile`（或 `makefile`）中的规则，根据文件的时间戳决定哪些文件需要重新编译。

### 2.2 安装 Make

- **Linux**：通常已预装，否则 `sudo apt install make`（Debian/Ubuntu）或 `sudo yum install make`（RHEL/CentOS）
- **macOS**：安装 Xcode Command Line Tools：`xcode-select --install`
- **Windows**：可安装 [MinGW-w64](http://mingw-w64.org/) 或 [Cygwin](https://www.cygwin.com/)，或使用 [Chocolatey](https://chocolatey.org/)：`choco install make`

### 2.3 Makefile 基本规则

```makefile
目标: 依赖1 依赖2 ...
	命令   # 必须以 Tab 开头，不能用空格
```

- **目标**：要生成的文件名（如 `main.o`）或动作名（如 `clean`）
- **依赖**：生成目标所需的文件或其他目标
- **命令**：生成目标的具体操作（shell 命令）

#### 示例：编译单个文件

```makefile
# Makefile
hello: hello.c
	gcc hello.c -o hello
```

运行 `make` 会生成 `hello` 可执行文件。再次运行 `make` 时会提示 `hello` 已是最新。

### 2.4 使用变量

变量可以简化重复内容的书写：

```makefile
CC = gcc
CFLAGS = -Wall -g
TARGET = myapp
SOURCES = main.c utils.c

$(TARGET): $(SOURCES)
	$(CC) $(CFLAGS) -o $@ $^
```

- `$@` 表示当前目标
- `$^` 表示所有依赖
- `$<` 表示第一个依赖

### 2.5 多文件项目示例

假设项目结构：
```
project/
├── main.c
├── utils.c
├── utils.h
└── Makefile
```

`main.c`:
```c
#include "utils.h"
int main() { print_hello(); return 0; }
```

`utils.c`:
```c
#include <stdio.h>
#include "utils.h"
void print_hello() { printf("Hello from utils\n"); }
```

`utils.h`:
```c
#ifndef UTILS_H
#define UTILS_H
void print_hello();
#endif
```

#### 基础 Makefile

```makefile
CC = gcc
CFLAGS = -Wall -g
OBJS = main.o utils.o
TARGET = myapp

$(TARGET): $(OBJS)
	$(CC) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)
```

- `%.o: %.c` 是模式规则，匹配任何 `.c` 文件生成对应的 `.o` 文件。
- `clean` 是伪目标（不会生成文件），用于删除中间文件和可执行文件。

### 2.6 自动推导依赖头文件

上面的 Makefile 无法检测 `main.c` 是否包含了 `utils.h`。修改 `utils.h` 后，`main.o` 不会重新编译。解决方案是生成依赖信息：

```makefile
# 使用 gcc -MM 生成依赖关系
%.o: %.c
	$(CC) $(CFLAGS) -MMD -c $< -o $@
	@cp $*.d $*.P; sed -e 's/#.*//' -e 's/^[^:]*: *//' -e 's/ *\\$$//' -e '/^$$/ d' -e 's/$$/ :/' < $*.d >> $*.P; rm -f $*.d

-include $(OBJS:.o=.P)
```

更简单的做法是使用 `-MMD` 并直接 `-include`：

```makefile
DEPENDS = $(OBJS:.o=.d)
%.o: %.c
	$(CC) $(CFLAGS) -MMD -c $< -o $@
-include $(DEPENDS)
```

### 2.7 伪目标和常用变量

```makefile
.PHONY: clean all   # 声明伪目标，避免与同名文件冲突

all: $(TARGET)      # 默认目标

clean:
	rm -f $(OBJS) $(TARGET) *.d
```

### 2.8 Make 常用内置变量

| 变量 | 含义 |
|------|------|
| `CC` | C 编译器，默认 `cc` |
| `CXX`| C++ 编译器，默认 `g++` |
| `CFLAGS` | C 编译器选项 |
| `CXXFLAGS` | C++ 编译器选项 |
| `LDFLAGS` | 链接器选项 |
| `LDLIBS` | 链接时需要的库 |

---

## 3. CMake 基础教程

### 3.1 什么是 CMake？

CMake 不直接构建项目，而是根据 `CMakeLists.txt` 脚本生成原生构建文件（如 Makefile、Visual Studio 解决方案、Xcode 工程等）。这让你可以**一次编写，到处构建**。

### 3.2 安装 CMake

- **Linux**：`sudo apt install cmake`（Ubuntu）或 `sudo yum install cmake`（RHEL）
- **macOS**：`brew install cmake`
- **Windows**：从 [cmake.org](https://cmake.org/download/) 下载安装程序
- **通用**：使用 pip：`pip install cmake`

### 3.3 最简单的 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyApp)

add_executable(myapp main.c)
```

构建步骤（外部构建，推荐）：

```bash
mkdir build && cd build
cmake ..      # 生成 Makefile（默认）
make          # 或 cmake --build .
```

### 3.4 多文件项目

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyApp)

# 设置 C 标准
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 源文件列表
set(SOURCES main.c utils.c)

add_executable(myapp ${SOURCES})
```

### 3.5 使用变量和目录

```cmake
# 自动收集当前目录下所有 .c 文件
file(GLOB SOURCES "*.c")
# 但官方不推荐 GLOB（新增文件时可能不自动检测），更推荐显式列出
```

### 3.6 头文件目录和库链接

```cmake
# 添加头文件搜索路径
target_include_directories(myapp PRIVATE ${PROJECT_SOURCE_DIR}/include)

# 链接数学库
target_link_libraries(myapp PRIVATE m)

# 链接自定义静态库
target_link_libraries(myapp PRIVATE ${PROJECT_SOURCE_DIR}/lib/libutils.a)
```

### 3.7 生成静态库/动态库

```cmake
add_library(utils STATIC utils.c)   # 静态库
add_library(utils_shared SHARED utils.c)  # 动态库
```

然后在主程序中链接：

```cmake
add_executable(myapp main.c)
target_link_libraries(myapp PRIVATE utils)
```

### 3.8 条件编译与选项

```cmake
option(USE_MYMATH "Use custom math library" ON)

if(USE_MYMATH)
    target_compile_definitions(myapp PRIVATE USE_MYMATH)
    target_link_libraries(myapp PRIVATE mymath)
else()
    target_link_libraries(myapp PRIVATE m)
endif()
```

### 3.9 查找系统库

```cmake
find_package(OpenSSL REQUIRED)
if(OpenSSL_FOUND)
    target_include_directories(myapp PRIVATE ${OpenSSL_INCLUDE_DIR})
    target_link_libraries(myapp PRIVATE ${OpenSSL_LIBRARIES})
endif()
```

### 3.10 安装规则

```cmake
install(TARGETS myapp DESTINATION bin)          # 安装可执行文件
install(TARGETS utils DESTINATION lib)          # 安装库
install(FILES utils.h DESTINATION include)      # 安装头文件
```

### 3.11 完整 CMake 示例

项目结构：
```
myproject/
├── CMakeLists.txt
├── src/
│   ├── main.c
│   └── utils.c
├── include/
│   └── utils.h
└── lib/                # 可选，放第三方库
```

`CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject VERSION 1.0.0)

# 设置 C++ 标准（若用 C++）
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 添加可执行文件
add_executable(myapp src/main.c src/utils.c)

# 指定头文件目录
target_include_directories(myapp PRIVATE include)

# 可选：生成 compile_commands.json 用于 IDE 或 LSP
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 输出信息
message(STATUS "Building ${PROJECT_NAME} version ${PROJECT_VERSION}")
```

构建命令：
```bash
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release   # 或 make
```

### 3.12 CMake 常用命令

| 命令 | 作用 |
|------|------|
| `cmake_minimum_required(VERSION x.y)` | 指定最低 CMake 版本 |
| `project(ProjName)` | 定义项目名称及可选语言 |
| `add_executable(target src)` | 添加可执行文件 |
| `add_library(target STATIC src)` | 添加静态库 |
| `target_include_directories(target PRIVATE dir)` | 添加头文件路径 |
| `target_link_libraries(target PRIVATE lib)` | 链接库 |
| `target_compile_definitions(target PRIVATE MACRO)` | 添加宏定义 |
| `option(var "help" default)` | 提供用户可选开关 |
| `find_package(pkg REQUIRED)` | 查找外部包 |
| `message(STATUS "text")` | 打印信息 |
| `set(var value)` | 设置变量 |
| `list(APPEND var item)` | 追加列表元素 |

---

## 4. Make vs CMake：何时用哪个？

| 场景 | 推荐工具 |
|------|----------|
| 小项目（几个文件），只在 Linux 下编译 | Make |
| 跨平台项目（Windows、Linux、macOS） | CMake |
| 需要使用 IDE（Visual Studio、Xcode） | CMake |
| 需要自动查找系统库（如 OpenCV） | CMake |
| 嵌入式中等规模项目，定制化很强 | Make |
| 现代 C++ 项目，需要依赖管理（vcpkg、conan） | CMake |

**总结**：学习 make 有助于理解构建过程的核心概念；而在实际项目开发中，使用 CMake 可以提高跨平台能力和团队协作效率。
