---
layout: post
title: "硬件教学一——大体流程"
date: 2026-04-18
categories: 硬件
author: agppd
---

这个系列基本上是本人所有的硬件知识储备了，我能想到的我都讲了，部分零碎的知识点没有进行提及，也有的就是没想起来。

因为本人并不精通硬件描述语言……

所以，本系列实现部分由DS完成（这意味着不保证代码可以正确运行）

**本篇文章是本系列的概述**

# 从与非门到8位CPU：计算机的自底向上构建路径（增补版）

## 一、组合逻辑层：功能完备性与门级实现

### 1.1 与非门的功能完备性

数字逻辑电路分为组合逻辑与时序逻辑两类。组合逻辑的输出仅由当前输入决定；时序逻辑的输出同时依赖当前输入与历史状态。

与非门（NAND）的逻辑行为是：仅当所有输入同时有效时输出无效，其余情况均输出有效。其真值表如下：

| 输入A | 输入B | 输出 |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

与非门具备功能完备性——仅使用与非门即可构造所有基本逻辑函数。这一性质使得整个计算机系统可建立于单一类型的基础元件之上。

### 1.2 从与非门到其他逻辑门

以下为仅使用与非门构造其他逻辑门的具体方法：

**非门（NOT）** ：将与非门的两个输入端短接。输入0时两输入端均为0，输出1；输入1时两输入端均为1，输出0。

**与门（AND）** ：将与非门的输出端再接入一级非门。与非门实现“与后取反”，再加一级非门即抵消取反。

**或门（OR）** ：根据德·摩根定律，A + B = (A‘ · B’)‘。先将两个输入分别取反，再将取反后的信号输入与非门，输出即为或逻辑。

**异或门（XOR）** ：当两个输入不同时输出1，相同时输出0。可由四个与非门组合实现。


### 1.3 实践：逻辑门

硬件描述语言中，逻辑门可通过连续赋值语句或原语例化实现。以下Verilog代码描述基础逻辑门的三种建模方式：

```verilog
// 方式一：连续赋值语句
wire nand_out, not_out, and_out, or_out, xor_out;

assign nand_out = ~(a & b);   // 与非门
assign not_out  = ~a;          // 非门
assign and_out  = a & b;       // 与门
assign or_out   = a | b;       // 或门
assign xor_out  = a ^ b;       // 异或门

// 方式二：门级原语例化
nand (nand_out, a, b);
not  (not_out, a);
and  (and_out, a, b);
or   (or_out, a, b);
xor  (xor_out, a, b);

// 方式三：仅用与非门构造其他门（结构级建模）
wire n1, n2, n3, n4;
nand nand_not (not_out, a, a);                // 非门
nand nand_and1 (n1, a, b);
nand nand_and2 (and_out, n1, n1);             // 与门
nand nand_or1 (n2, a, a);
nand nand_or2 (n3, b, b);
nand nand_or3 (or_out, n2, n3);               // 或门
nand nand_xor1 (n1, a, b);
nand nand_xor2 (n2, a, n1);
nand nand_xor3 (n3, b, n1);
nand nand_xor4 (xor_out, n2, n3);             // 异或门
```

方式三从结构上直接体现功能完备性原理。综合工具会将这些描述映射为目标器件中的实际逻辑资源。

## 二、运算器层：从一位加法到ALU

### 2.1 半加器与全加器

两个一位二进制数相加，产生本位和与进位。本位和为异或逻辑，进位为与逻辑。将异或门与与门并联即构成半加器。

全加器在半加器基础上增设进位输入端，可同时处理本位加数与低位进位。全加器由两个半加器级联构成：第一级半加器计算A与B之和及进位，第二级半加器将该和与进位输入相加，两级进位经或门合并后输出。

### 2.2 8位加法器

将8个全加器的进位输出连接至下一级进位输入，即构成8位串行进位加法器。高位运算需等待低位进位逐级传递，位数增加时最长信号路径延迟随之增加。

超前进位加法器通过引入进位生成函数与进位传播函数，并行计算所有进位信号，以增加逻辑门数量换取固定延迟的进位路径。

### 2.3 减法器与补码

固定位宽二进制系统中，减法通过补码加法实现：A - B = A + (~B + 1)。硬件上，减法器与加法器共享同一数据通路：通过控制信号选择将减数取反并置初始进位为1，加法器即输出差值。这种功能复用是ALU设计的核心思想。

### 2.4 比较器（COMP）

比较器是CPU实现条件判断的核心部件，用于判定两个数值之间的大小关系或相等关系。

**一位比较器**：比较两个单比特a与b的大小。当且仅当a=0且b=1时，a < b成立。因此一位比较器的逻辑函数为：`result = (!a) AND b`。用逻辑门实现：a经非门后与b共同接入与门。

**相等比较器**：判断两个8位数值是否相等。对于单个比特，相等可用同或门（XNOR）实现——当两输入相同时输出1，不同时输出0。将8对输入分别接入同或门，再将8个同或门的输出接入一个8输入与门——只有当所有比特都相同时，与门的输出才为1。

**无符号小于比较器**：比较两个8位无符号数的大小体现了比较运算的关键特性——**高位具有一票否决权**。一旦在某一高位上能分出大小，低位的结果就完全不用关心。

从硬件实现角度，逐位比较电路按如下优先级逻辑组织：从最高位（第7位）开始，若该位上A<B，则直接输出“小于”结果；若A>B，则直接输出“不小于”；若A=B，则打开下一位的比较通路继续判断。逐级向下，直至最低位。若所有位均相等，则输出“不小于”。

一种简洁的实现方法是将两个输入分别接入一个8位与门和一个8位或非门，再将两者的输出通过带进位输入的加法器合并，进位输出即为比较结果。该方法的原理是利用补码运算的特性——A-B的进位输出在无符号比较中恰好等于A≥B的标志，取反后即为A<B。

**有符号比较器**：有符号数的比较在无符号比较的基础上增加对符号位的特殊处理。在补码表示中，最高位为符号位（0为正，1为负）。有符号比较需首先判断两数符号是否相同——符号相同时，比较方式与无符号数一致；符号不同时，正数必定大于负数。因此有符号比较电路需在无符号比较器的基础上增加符号位判断逻辑，根据符号情况选择最终比较结果。

### 2.5 算术逻辑单元

ALU将加法、减法、逻辑运算、比较运算及移位操作集成于一体，通过功能选择信号决定当前运算类型。同时更新状态标志位：零标志（ZF）、进位标志（CF）、溢出标志（OF）、符号标志（SF）。这些标志位供条件分支指令使用。比较器通常与ALU紧密耦合——比较结果通过设置标志位而非直接输出数值的方式提供给后续指令使用。

### 2.6 实践：ALU及比较器

以下为8位ALU的行为级描述，在原有加减、逻辑运算基础上增加了比较功能：

```verilog
module alu_8bit (
    input  [7:0] a, b,            // 操作数
    input  [2:0] alu_op,           // 功能选择
    output reg [7:0] result,       // 运算结果
    output reg zero,               // 零标志
    output reg carry,              // 进位/借位标志
    output reg overflow,           // 溢出标志
    output reg sign,               // 符号标志
    output reg lt,                 // 小于标志（有符号）
    output reg ltu                 // 小于标志（无符号）
);

    // 功能编码
    localparam OP_ADD = 3'b000;
    localparam OP_SUB = 3'b001;
    localparam OP_AND = 3'b010;
    localparam OP_OR  = 3'b011;
    localparam OP_XOR = 3'b100;
    localparam OP_SLT = 3'b101;    // 有符号小于比较
    localparam OP_SLTU= 3'b110;    // 无符号小于比较

    wire [8:0] add_result;
    wire [8:0] sub_result;

    assign add_result = {1'b0, a} + {1'b0, b};
    assign sub_result = {1'b0, a} - {1'b0, b};

    // 无符号小于判断
    wire unsigned_lt = sub_result[8];  // 借位=1表示a<b

    // 有符号小于判断：符号不同则直接由符号位决定
    wire signed_lt = (a[7] != b[7]) ? a[7] : unsigned_lt;

    always @(*) begin
        case (alu_op)
            OP_ADD:  {carry, result} = add_result;
            OP_SUB:  {carry, result} = sub_result;
            OP_AND:  begin result = a & b; carry = 1'b0; end
            OP_OR:   begin result = a | b; carry = 1'b0; end
            OP_XOR:  begin result = a ^ b; carry = 1'b0; end
            OP_SLT:  begin result = {7'b0, signed_lt}; carry = 1'b0; end
            OP_SLTU: begin result = {7'b0, unsigned_lt}; carry = 1'b0; end
            default: begin result = 8'b0; carry = 1'b0; end
        endcase

        zero = (result == 8'b0);
        sign = result[7];
        lt = signed_lt;
        ltu = unsigned_lt;

        if (alu_op == OP_ADD)
            overflow = (a[7] == b[7]) && (result[7] != a[7]);
        else if (alu_op == OP_SUB)
            overflow = (a[7] != b[7]) && (result[7] != a[7]);
        else
            overflow = 1'b0;
    end

endmodule
```

比较标志位lt（有符号小于）和ltu（无符号小于）作为ALU的输出，可供后续控制单元在条件分支指令中使用。

## 三、存储与时序层：从锁存器到内存

### 3.1 SR锁存器与反馈原理

存储功能的核心在于反馈——将逻辑门的输出回接至输入端。SR锁存器利用两个交叉耦合的或非门形成双稳态结构：Set端有效时输出置1并保持；Reset端有效时输出清0并保持；两者同时撤销后输出维持原有状态。

### 3.2 延时缓冲器

当然，也有一种新的存储方式，叫：“延时缓冲器”。在更新中引入了延时缓冲器作为替代1位存储器的另一种存储基础元件。延时缓冲器的行为极简：将输入信号延迟一个时钟周期后输出。这种“延迟一拍”的特性使得存储概念更加直观——信号在时间轴上的平移本质上就是一种“记忆”。

从延时缓冲器出发，同样可以构建寄存器：将延时缓冲器的输出反馈回输入端，构成自循环结构，即可实现长期存储。延时缓冲器也是流水线架构中处理数据相关性的重要基础元件。

**反正，我个人非常不喜欢这种存储方式，我还是推荐用CLR的**

### 3.3 时钟与D触发器

SR锁存器无时序控制，输入变化随时影响输出。D触发器在锁存器基础上增加时钟输入端，仅当时钟边沿到达时采样输入并更新输出，其余时间输出保持。时钟机制将电路行为离散化为统一节拍，是同步数字系统的基础。

### 3.4 栈（Stack）

栈是一种以后进先出（LIFO）方式工作的特殊存储结构，在CPU中用于支持函数调用、中断处理和局部变量存储。栈的核心操作包括压栈（Push）和弹栈（Pop）。

**栈的硬件实现**：栈由三部分构成——一段RAM存储空间、一个栈指针寄存器（Stack Pointer, SP），以及控制逻辑。

- **栈指针（SP）** ：专用寄存器，存储当前栈顶地址。通常初始化为RAM的高地址端，压栈时指针递减（向低地址增长），弹栈时指针递增。
- **压栈操作（Push）** ：将数据写入SP所指向的RAM地址，然后SP减1（或加1，取决于栈增长方向）。
- **弹栈操作（Pop）** ：将SP加1，然后从SP所指向的新地址读取数据到目标寄存器。弹出后原位置的数据通常不被清零，仅在后续压栈时被覆盖。

栈指针寄存器需永久输出其当前值到RAM地址端，以保证RAM随时可被寻址。控制单元通过压栈控制线和弹栈控制线协调RAM读写、寄存器写入和指针更新等操作。

**栈在CPU中的角色**：函数调用时，返回地址和函数参数被压入栈中；函数返回时，返回地址从栈中弹出并加载至程序计数器。中断处理时，当前程序的上下文（各寄存器值）被压栈保存，中断服务程序执行完毕后再弹栈恢复。局部变量也通常在栈上分配，函数返回时自动释放。

### 3.5 寄存器与内存

多个D触发器共享同一时钟，构成多位寄存器。多组寄存器按地址编码排列，通过地址译码器选通对应单元，构成随机存取存储器（RAM）。译码器将m位地址转换为2^m条字线，确保每次读写仅作用于指定单元。8位CPU的RAM地址空间通常为256字节，栈空间通常位于该地址空间的高端区域。

**内存层次**：内存存在不同速度等级的内存元件，如普通RAM、高速RAM等。这种差异反映了实际计算机体系结构中的内存层次思想——离CPU越近的存储部件速度越快、容量越小；离CPU越远的部件速度越慢、容量越大。寄存器是最快的存储单元，数量极其有限；RAM容量较大但访问延迟更长。栈通常映射到RAM的一段连续地址空间，在速度和容量之间取得平衡。

### 3.6 实践：寄存器组、栈

**4×8位寄存器组**（4个通用寄存器，通过地址选择读写）：

```verilog
module register_file_4x8 (
    input clk, rst_n,
    input [1:0] rd_addr_a,      // 读地址A
    input [1:0] rd_addr_b,      // 读地址B
    input [1:0] wr_addr,        // 写地址
    input wr_en,                // 写使能
    input [7:0] wr_data,        // 写数据
    output [7:0] rd_data_a,     // 读数据A
    output [7:0] rd_data_b      // 读数据B
);
    reg [7:0] regs [0:3];       // 4个8位寄存器

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            regs[0] <= 8'b0;
            regs[1] <= 8'b0;
            regs[2] <= 8'b0;
            regs[3] <= 8'b0;
        end else if (wr_en) begin
            regs[wr_addr] <= wr_data;
        end
    end

    assign rd_data_a = regs[rd_addr_a];
    assign rd_data_b = regs[rd_addr_b];

endmodule
```

**栈模块**（256字节RAM空间，带压栈/弹栈控制）：

```verilog
module stack_256x8 (
    input clk, rst_n,
    input push,                 // 压栈使能
    input pop,                  // 弹栈使能
    input [7:0] data_in,        // 压栈数据
    output reg [7:0] data_out,  // 弹栈数据
    output reg [7:0] sp         // 栈指针（用于调试）
);
    reg [7:0] mem [0:255];      // 256字节栈空间
    reg [7:0] sp_reg;           // 栈指针寄存器

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            sp_reg <= 8'hFF;    // 初始化栈指针到最高地址
        end else begin
            if (push && !pop) begin
                mem[sp_reg] <= data_in;  // 压栈：写入当前栈顶
                sp_reg <= sp_reg - 1'b1;  // 栈指针递减
            end else if (pop && !push) begin
                sp_reg <= sp_reg + 1'b1;  // 栈指针递增
                data_out <= mem[sp_reg + 1'b1]; // 弹栈：读取新栈顶
            end
        end
    end

    assign sp = sp_reg;
endmodule
```

**256字节RAM**（地址8位，数据8位，与栈共享地址空间）：

```verilog
module ram_256x8 (
    input clk,
    input [7:0] addr,           // 地址
    input [7:0] data_in,        // 写数据
    input wr_en,                // 写使能
    input rd_en,                // 读使能
    output reg [7:0] data_out   // 读数据
);
    reg [7:0] mem [0:255];      // 256个字节

    always @(posedge clk) begin
        if (wr_en)
            mem[addr] <= data_in;
    end

    always @(*) begin
        if (rd_en)
            data_out = mem[addr];
        else
            data_out = 8'bz;    // 高阻态，便于总线连接
    end

endmodule
```

在实际CPU中，栈和通用RAM可共用同一存储空间——栈指针指向RAM中专门划出的一段区域。这种统一编址方式简化了硬件设计，也是冯·诺依曼架构的自然延伸。

## 四、处理器架构

### 4.1 冯·诺依曼架构与指令周期

冯·诺依曼架构的核心是程序与数据共用存储空间。CPU通过指令周期循环执行程序：

- **取指**：根据程序计数器从内存读取指令
- **译码**：解析操作码与寻址方式，生成控制信号
- **执行**：完成数据运算或访存操作
- **写回**：将结果存入目标寄存器或内存

### 4.2 指令集编码

指令集架构（ISA）定义了软件与硬件之间的接口规范。一条指令由操作码和操作数两部分构成，操作码指示执行何种操作，操作数指定操作对象。

现在，我们定义一种指令集，共16条指令及2条可选拓展指令。其指令编码采用8位定长格式，按功能分为四种模式：

| 模式 | 编码（高2位） | 功能 |
|:---:|:---:|:---|
| 立即数模式 | 00 | 低6位作为立即数写入Reg0（取值范围0~63） |
| 计算模式 | 01 | 从Reg1和Reg2读取数值，计算结果存入Reg3（支持OR/NAND/NOR/AND/ADD/SUB） |
| 复制模式 | 10 | 将源寄存器的值复制到目的寄存器 |
| 条件模式 | 11 | 检查Reg3与指定条件的匹配情况，满足则跳转到Reg0所指地址 |

这种指令编码方式体现了**正交性设计原则**——指令的各字段功能独立，便于硬件译码和软件编程。

现在，我们定义一个框架：

该架构的指令格式为一次读取4个字节的机器码，分别对应操作码（OP）、源操作数1（s1）、源操作数2（s2）和目标地址（addr）。操作码共8位，其中高2位控制立即数模式，第3位控制是否为条件跳转指令，低5位选择具体运算类型。这种变长指令格式提供了更大的寻址灵活性和功能扩展空间。

**条件分支的编码实现**：在条件模式下，控制单元根据ALU运算后的标志位判断是否满足跳转条件。OVERTURE架构支持8种条件类型：Never（永假）、=0、<0、<=0、Always（永真）、!=0、>=0、>0。这些条件直接对应ALU标志位的不同组合，硬件上通过组合逻辑即可实现。

### 4.3 控制单元

控制单元输入端为指令操作码与状态标志位，输出端为各功能部件的控制信号。从实现角度分为硬布线控制器与微程序控制器两种。

**硬布线控制器**将操作码到控制信号的映射直接固化为门级电路。控制单元通过判断操作码与指定数字是否相同来激活对应的运算通路。操作码译码后产生的控制信号包括：ALU功能选择、寄存器读写使能、内存读写使能、栈压入/弹出控制、程序计数器加载使能等。

**微程序控制器**则将映射关系存储于控制存储器中，通过微指令序列产生控制信号。

### 4.4 总线与三态门

CPU内部各部件通过总线交换数据。为避免多驱动源冲突，总线接口设置三态门——除输出有效电平外还具有高阻态。任意时刻仅允许一个部件驱动总线，其余部件保持高阻态。

### 4.5 条件分支与图灵完备

条件分支的执行机制：ALU运算后更新标志寄存器；控制单元根据标志位判断分支条件是否满足；若满足则将目标地址加载至PC，否则PC自增。比较器是条件分支的硬件基础——它生成的小于、等于、大于等标志位为跳转判断提供了依据。

图灵完备的计算系统需满足两项核心能力：执行基本运算的能力，以及根据中间计算结果改变执行流程的能力（条件分支）。栈的存在进一步增强了系统的计算能力——通过压栈和弹栈操作，CPU可实现嵌套的函数调用和递归，从而表达任意复杂度的算法。

### 4.6 实践：简易8位CPU

以下为一个8位CPU的顶层模块，整合了ALU、寄存器组、栈、RAM和控制单元：

```verilog
module cpu_8bit (
    input clk, rst_n,
    output [7:0] pc_out,        // 程序计数器
    output [7:0] acc_out,       // 累加器
    output [7:0] sp_out         // 栈指针
);

    // 指令格式：[7:4]操作码 [3:0]立即数/寄存器选择
    localparam OP_LDI  = 4'b0000; // 加载立即数到累加器
    localparam OP_ADD  = 4'b0001; // 累加器加立即数
    localparam OP_SUB  = 4'b0010; // 累加器减立即数
    localparam OP_CMP  = 4'b0011; // 比较累加器与立即数（设置标志）
    localparam OP_JZ   = 4'b0100; // 累加器为零则跳转
    localparam OP_JLT  = 4'b0101; // 小于则跳转
    localparam OP_PUSH = 4'b0110; // 累加器压栈
    localparam OP_POP  = 4'b0111; // 弹栈到累加器
    localparam OP_CALL = 4'b1000; // 调用子程序（压返回地址并跳转）
    localparam OP_RET  = 4'b1001; // 返回（弹返回地址到PC）

    // CPU寄存器
    reg [7:0] pc, acc, ir;
    reg [7:0] mem_addr, mem_wr_data;
    reg mem_rd_en, mem_wr_en;
    wire [7:0] mem_rd_data;

    // ALU接口
    wire [7:0] alu_result;
    wire alu_zero, alu_carry, alu_lt, alu_ltu;
    reg [2:0] alu_op;

    // 栈接口
    reg push, pop;
    wire [7:0] stack_data_out;
    wire [7:0] sp;

    // 状态机
    localparam FETCH  = 2'b00;
    localparam DECODE = 2'b01;
    localparam EXEC   = 2'b10;
    reg [1:0] state;
    reg [3:0] opcode, operand;

    // 实例化ALU
    alu_8bit alu (
        .a(acc), .b({4'b0, operand}),
        .alu_op(alu_op),
        .result(alu_result), .zero(alu_zero),
        .carry(alu_carry), .overflow(), .sign(),
        .lt(alu_lt), .ltu(alu_ltu)
    );

    // 实例化栈
    stack_256x8 stack (
        .clk(clk), .rst_n(rst_n),
        .push(push), .pop(pop),
        .data_in(acc),
        .data_out(stack_data_out),
        .sp(sp)
    );

    // 实例化RAM
    ram_256x8 ram (
        .clk(clk),
        .addr(mem_addr),
        .data_in(mem_wr_data),
        .wr_en(mem_wr_en),
        .rd_en(mem_rd_en),
        .data_out(mem_rd_data)
    );

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            pc <= 8'b0; acc <= 8'b0; ir <= 8'b0;
            state <= FETCH;
            mem_wr_en <= 1'b0; mem_rd_en <= 1'b0;
            push <= 1'b0; pop <= 1'b0;
        end else begin
            case (state)
                FETCH: begin
                    mem_addr <= pc;
                    mem_rd_en <= 1'b1;
                    state <= DECODE;
                end

                DECODE: begin
                    ir <= mem_rd_data;
                    mem_rd_en <= 1'b0;
                    pc <= pc + 1'b1;
                    opcode <= mem_rd_data[7:4];
                    operand <= mem_rd_data[3:0];
                    state <= EXEC;
                end

                EXEC: begin
                    push <= 1'b0; pop <= 1'b0;
                    case (opcode)
                        OP_LDI: acc <= {4'b0, operand};
                        OP_ADD: begin alu_op <= 3'b000; acc <= alu_result; end
                        OP_SUB: begin alu_op <= 3'b001; acc <= alu_result; end
                        OP_CMP: begin alu_op <= 3'b101; end  // 只设标志
                        OP_JZ:  if (alu_zero) pc <= {4'b0, operand};
                        OP_JLT: if (alu_lt)   pc <= {4'b0, operand};
                        OP_PUSH: push <= 1'b1;
                        OP_POP:  begin pop <= 1'b1; acc <= stack_data_out; end
                        OP_CALL: begin
                            push <= 1'b1;           // 压返回地址
                            pc <= {4'b0, operand};  // 跳转到子程序
                        end
                        OP_RET: begin
                            pop <= 1'b1;
                            pc <= stack_data_out;   // 弹返回地址到PC
                        end
                    endcase
                    state <= FETCH;
                end
            endcase
        end
    end

    assign pc_out = pc;
    assign acc_out = acc;
    assign sp_out = sp;

endmodule
```

此CPU整合了比较器（通过CMP指令和条件跳转指令）以及栈（通过PUSH、POP、CALL、RET指令），具备了子程序调用和条件分支的完整能力。这些功能的加入使CPU从单纯的计算部件升格为可运行结构化程序的完整计算系统。
