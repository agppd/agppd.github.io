---
layout: post
title: "Latex模板分享——常规文章模板"
date: 2026-03-28
categories: [排版,模板]
author: agppd
---

如下，是基于网上寻找与本人补充后的模板，需要时自行删改

**本文件使用宏包较多，建议安装时全下载下来得了**

~~感觉跟讲解学习差不多了…………~~

正文内容：

```Latex
\documentclass[12pt,a4paper]{article}
% 文档类声明：指定文档的类型和全局格式选项
% \documentclass[选项]{文档类}
%
% 文档类: article
%   - 最常用的基础文档类，适用于学术论文、报告、文章等
%   - 特点：标题、作者、摘要、章节（\section, \subsection 等）
%   - 默认单栏排版，适合文字为主的文档
%
% 选项说明:
%   [12pt]    - 设置正文主字体大小为 12 磅（可选值：10pt, 11pt, 12pt）
%   [a4paper] - 设置纸张大小为 A4（210mm × 297mm），其他可选：letterpaper, legalpaper 等
%
% 常用补充选项（可逗号分隔）:
%   twoside     - 双面打印模式，页边距对称
%   oneside     - 单面打印（article 默认）
%   titlepage   - 单独一页生成标题（article 默认不单独成页）
%   draft       - 草稿模式，显示溢出框，不插入图片等
%   final       - 终稿模式（默认）
%   openany     - 章节可在任意页开始（article 默认）
%   openright   - 章节仅在奇数页开始（book 类常用）
%   fleqn       - 公式左对齐
%   leqno       - 公式编号置于左侧
%   landscape   - 横向页面
%   onecolumn   - 单栏排版（默认）
%   twocolumn   - 双栏排版

% ==================== 编码与字体 ====================
\usepackage[utf8]{inputenc}      % 设置输入编码为 UTF-8，支持直接输入中文等多字节字符
\usepackage[T1]{fontenc}         % 使用 T1 字体编码，改善输出字符的显示效果，支持连字等
\usepackage{lmodern}             % 使用 Latin Modern 字体，它是 Computer Modern 的升级版，提供更好的缩放和轮廓

% 中文支持（仅保留一行，自动适配系统字体）
\usepackage[UTF8]{ctex}          % 加载 ctex 宏包，支持中文排版，自动检测系统字体（如 Windows 下的 SimSun 等）
% ==================== 页面布局 ====================
\usepackage[top=2.5cm,bottom=2.5cm,left=3cm,right=3cm]{geometry} % 设置页边距：上、下 2.5 cm，左、右 3 cm
\usepackage{setspace}            % 提供行距设置功能
\onehalfspacing                  % 设置行距为 1.5 倍行距（one-half spacing），便于阅读
% ==================== 图形与颜色 ====================
\usepackage{graphicx}            % 插入图片的核心宏包
\graphicspath{{figures/}}        % 设置图片存放路径为 figures 文件夹，支持多路径（用花括号括起）
\usepackage{xcolor}              % 提供丰富的颜色定义和设置功能
\definecolor{codebg}{rgb}{0.95,0.95,0.95}    % 定义代码背景色：浅灰色
% 提示框用颜色
\definecolor{notebg}{rgb}{0.95,0.95,0.85}    % 提示框背景色：米黄色
\definecolor{cautionbg}{rgb}{1,0.95,0.9}     % 注意框背景色：浅橙色
\definecolor{infobg}{rgb}{0.9,0.95,1}        % 信息框背景色：浅蓝色
% ==================== 数学符号与公式 ====================
\usepackage{amsmath, amssymb, amsthm} % AMS 数学宏包，提供大量数学环境、符号和定理环境基础
\usepackage{bm}                  % 提供 \bm 命令，用于加粗数学符号（尤其是希腊字母和矢量）
\usepackage{mathtools}           % amsmath 的扩展，修复了一些问题并增加了实用功能（如 \coloneqq 等）
\usepackage{thmtools}            % 高级定理环境管理工具，与 amsthm 配合使用

% 定理环境
\theoremstyle{plain}             % 定理样式：标题加粗，内容斜体（用于定理、引理等）
\newtheorem{theorem}{定理}[section] % 定义 theorem 环境，编号按 section 递增，如“定理 1.1”
\newtheorem{lemma}[theorem]{引理}    % 定义引理环境，与 theorem 共享编号
\newtheorem{proposition}[theorem]{命题} % 定义命题环境，共享编号
\newtheorem{corollary}[theorem]{推论}   % 定义推论环境，共享编号

\theoremstyle{definition}        % 定义样式：标题加粗，内容正体（用于定义、例）
\newtheorem{definition}{定义}[section] % 定义 definition 环境，按 section 编号
\newtheorem{example}{例}[section]      % 定义 example 环境，按 section 编号

\theoremstyle{remark}            % 注记样式：标题斜体，内容正体
\newtheorem*{remark}{注}         % 定义 remark 环境，无编号，标题为“注”

\renewcommand{\proofname}{\bf 证明} % 修改证明环境的标题为加粗的“证明”
% ==================== 化学与物理 ====================
\usepackage{mhchem}              % 用于排版化学式（如 \ce{H2O}），支持反应式和同位素等
\usepackage{chemfig}             % 绘制化学结构式（分子结构图）
\usepackage{physics}             % 提供物理常用符号和命令（如 \dd, \vb, \qty 等）
% ==================== 表格增强 ====================
\usepackage{booktabs}            % 提供三线表（\toprule, \midrule, \bottomrule），使表格更美观
\usepackage{array}               % 增强表格列格式，支持自定义列类型（如 >{\centering}）
\usepackage{multirow}            % 支持单元格跨行合并（\multirow）
\usepackage{longtable}           % 支持跨页长表格
% ==================== 算法与伪代码（CLRS风格注释）====================
\usepackage{algorithm}           % 提供算法浮动体环境（\begin{algorithm}...\end{algorithm}）
\usepackage{algpseudocode}       % 提供伪代码排版环境（algorithmicx 的扩展）
\floatname{algorithm}{算法}      % 将算法浮动体的标题名从默认的“Algorithm”改为“算法”

% 重新定义注释符号为三角形（CLRS风格）
\algrenewcommand{\algorithmiccomment}[1]{\hfill\(\triangleright\) #1} % 将算法行内注释显示为右对齐的三角形符号

% 新增行注释命令（单独一行）
\newcommand{\LineComment}[1]{\State \Comment{#1}} % 定义 \LineComment 命令，用于在单独一行添加注释（保持与 CLRS 风格一致）

% 设置输入输出关键字（可选）
\renewcommand{\algorithmicrequire}{\textbf{输入:}} % 将 \Require 显示为加粗的“输入:”
\renewcommand{\algorithmicensure}{\textbf{输出:}}   % 将 \Ensure 显示为加粗的“输出:”

% ==================== 代码高亮（无 Pygments）====================
\usepackage{listings} % 引入 listings 宏包，用于在文档中插入代码
\lstset{ % 开始设置 listings 的样式
    basicstyle=\ttfamily\small, % 设置代码的基本字体：等宽字体（\ttfamily），字号为 small
    numbers=left, % 在代码左侧显示行号
    numberstyle=\tiny\color{gray}, % 行号的样式：极小号字体（\tiny），灰色
    stepnumber=1, % 行号间隔为 1，即每一行都显示行号
    numbersep=5pt, % 行号与代码文本之间的间距为 5pt
    backgroundcolor=\color{white}, % 设置代码块的背景颜色
    showspaces=false, % 不显示空格符号（通常用可见符号表示空格）
    showstringspaces=false, % 不显示字符串中的空格符号
    showtabs=false, % 不显示制表符的可见标记
    frame=single, % 为代码块添加单线边框
    tabsize=4, % 将制表符（tab）视为 4 个空格
    captionpos=b, % 将代码标题（caption）放置在代码块的下方（bottom）
    breaklines=true, % 允许自动换行，避免代码超出边界
    breakatwhitespace=false, % 换行时不强制在空白字符处断开
    escapeinside={\%*}{*)}, % 定义转义序列，允许在代码中插入 LaTeX 命令（例如 %* ... *)，其中 ... 会被当作 LaTeX 处理）
    morecomment=[l][\color{blue}]{//}, % 定义行注释：以 // 开头，颜色设为蓝色
    morecomment=[s][\color{blue}]{/*}{*/}, % 定义块注释：以 /* 开头，*/ 结尾，颜色设为蓝色
    morestring=[b][\color{red}]", % 定义双引号字符串，颜色设为红色
    morestring=[b][\color{red}]', % 定义单引号字符串，颜色设为红色
    keywordstyle=\color{blue}\bfseries, % 关键字样式：蓝色加粗
    commentstyle=\color{green!50!black}, % 注释样式：绿色（混合 50% 绿色和黑色）
    stringstyle=\color{red}, % 字符串样式：红色
}

% ==================== 提示框环境 ====================
\usepackage{tcolorbox}
\tcbuselibrary{most}  % 加载常用库

% 定义通用提示框样式
% 定义一个新的彩色盒子环境 notebox，用于提示信息
\newtcolorbox{notebox}[1][]{      % 环境接受一个可选参数，用于传递额外的选项
    colback=notebg,               % 盒子背景颜色，需预先定义颜色 notebg
    colframe=orange!50!black,     % 盒子边框颜色：橙色与黑色混合（50% 橙色，50% 黑色）
    fonttitle=\bfseries,          % 标题字体：加粗
    title=提示,                   % 默认标题为“提示”
    #1                            % 将用户传入的可选参数插入此处，允许覆盖默认设置
}

% 定义信息盒子环境 infobox，用于展示一般性信息
\newtcolorbox{infobox}[1][]{
    colback=infobg,               % 背景颜色（需预先定义 infobg）
    colframe=blue!50!black,       % 边框颜色：蓝色与黑色混合（50% 蓝色，50% 黑色）
    fonttitle=\bfseries,          % 标题加粗
    title=信息,                   % 默认标题为“信息”
    #1
}

% 定义警示盒子环境 cautionbox，用于提醒注意事项
\newtcolorbox{cautionbox}[1][]{
    colback=cautionbg,            % 背景颜色（需预先定义 cautionbg）
    colframe=red!50!black,        % 边框颜色：红色与黑色混合（50% 红色，50% 黑色）
    fonttitle=\bfseries,          % 标题加粗
    title=注意,                   % 默认标题为“注意”
    #1
}

% 自定义通用盒子环境 mybox，允许用户指定标题
\newtcolorbox{mybox}[2][]{        % 环境接受两个参数：可选参数用于额外选项，必选参数为标题
    colback=white,                % 背景颜色为白色
    colframe=gray!50,             % 边框颜色：灰色（50% 灰度）
    fonttitle=\bfseries,          % 标题加粗
    title=#2,                     % 标题由第二个参数（必选）提供
    #1                            % 可选参数（第一个参数）用于扩展设置
}

% ==================== 交叉引用与超链接 ====================
\usepackage[bookmarks=true, colorlinks=true, linkcolor=blue, citecolor=green, urlcolor=red]{hyperref}
% 加载 hyperref 宏包，用于生成超链接和 PDF 书签
% bookmarks=true   : 生成 PDF 书签（目录树）
% colorlinks=true  : 将链接设置为彩色（而非彩色边框）
% linkcolor=blue   : 内部交叉引用（如 \ref）的颜色为蓝色
% citecolor=green  : 参考文献引用（如 \cite）的颜色为绿色
% urlcolor=red     : 网址链接（如 \url）的颜色为红色
\usepackage{cleveref}  % 加载 cleveref 宏包，提供智能交叉引用（如 \cref{label} 自动添加类型名称，如“定理 1”）

\bibliographystyle{plain}   % 设置参考文献样式
% plain     : 按作者姓氏字母排序，文中引用为数字编号（如 [1]）
% unsrt     : 按引用在文中出现的顺序排序，数字编号
% alpha     : 按作者+年份生成标签（如 [Knu84]），排序按作者字母顺序
% abbrv     : 与 plain 类似，但缩写作者名、月份等，更紧凑
% ieeetr    : 按引用顺序排序，符合 IEEE 期刊风格
% acm       : 按引用顺序排序，符合 ACM 期刊风格
% siam      : 按引用顺序排序，符合 SIAM 期刊风格
% apalike   : 模拟 APA 格式，文中引用为（作者, 年份），参考文献列表按作者排序

% ==================== 其他常用工具 ====================
\usepackage{enumitem}
\usepackage{footnote}
\usepackage{titlesec}
% \titleformat{\section}{\Large\bfseries}{\thesection}{1em}{}

% ==================== 文档信息 ====================
\title{通用学科模板（含提示框与参考文献）} % 文档标题
\author{作者姓名} % 作者姓名
\date{\today} % 日期，自动生成当天日期

% ==================== 目录格式设置 ====================
\usepackage{tocloft} % 加载 tocloft 宏包，用于自定义目录（Table of Contents）的格式和样式

% 修改目录标题格式
\renewcommand{\cfttoctitlefont}{\center\Large\bfseries\color{blue}} % 设置目录标题的字体：居中、Large 大小、加粗、蓝色
\renewcommand{\cftaftertoctitle}{} % 清除目录标题后的默认内容（通常为空，显式设置为空）

% 调整目录条目间距
\setlength{\cftbeforesecskip}{2pt}   % 设置节标题（section）在目录中的前间距为 2pt
\setlength{\cftbeforesubsecskip}{1pt} % 设置子节标题（subsection）在目录中的前间距为 1pt

% 修改节标题样式（文字颜色和页码颜色）
\renewcommand{\cftsecfont}{\color{red}}          % 节标题文字红色
\renewcommand{\cftsecpagefont}{\color{red}\bfseries} % 节页码红色加粗

% 修改子节标题样式
\renewcommand{\cftsubsecfont}{\color{green}}       % 子节标题文字绿色
\renewcommand{\cftsubsecpagefont}{\color{green}}   % 子节页码绿色

% 控制缩进（例如：章节号与标题之间的间距）
\setlength{\cftsecnumwidth}{2.5em}    % 设置节编号占用的宽度为 2.5em，影响节标题的缩进
\setlength{\cftsubsecnumwidth}{3.5em} % 设置子节编号占用的宽度为 3.5em，影响子节标题的缩进

% 自定义引导线（点线）样式
\renewcommand{\cftsecleader}{\color{orange}\cftdotfill{\cftdotsep}}     % 节标题引导线橙色
\renewcommand{\cftsubsecleader}{\color{gray}\cftdotfill{\cftdotsep}}     % 子节标题引导线灰色（可选）

% 若需要隐藏目录中的某些层级，例如不显示子节：
% \setcounter{tocdepth}{1}   % 只显示节和节以下（0=章，1=节，2=子节...）
% 上述命令用于设置目录显示的深度，可根据需要取消注释并修改数值

% ==================== 正文 ====================

\begin{document} % 文档开始

\maketitle % 生成标题、作者、日期

\begin{abstract} % 摘要环境
本模板集成了数学、物理、化学、计算机科学等多个学科所需的宏包，并提供了多种提示框环境（提示、信息、注意）。伪代码注释采用三角形符号（CLRS 风格），代码高亮完全基于 \texttt{listings}，不依赖 Pygments。参考文献通过 \texttt{ref.bib} 文件单独管理。
\end{abstract}

\tableofcontents % 生成目录
\newpage % 分页，使目录后内容从新页开始

\section{数学示例} % 第一节标题
\label{sec:math} % 为该节设置标签，便于交叉引用

基础积分： % 普通文本
\begin{equation} % 数学公式环境（带编号）
    \int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}. % 高斯积分公式
\end{equation}

定理环境演示： % 普通文本
\begin{theorem}[费马大定理] % 定理环境，可选参数为定理名称
对于整数 \(n>2\)，方程 \(x^n + y^n = z^n\) 没有正整数解。 % 定理内容
\end{theorem}
\begin{proof} % 证明环境
这是证明过程（略）。 % 证明内容
\end{proof}

\section{化学示例} % 第二节标题
\label{sec:chem} % 标签

化学式：\ce{H2O}、\ce{CH3COOH}。反应： % mhchem 宏包提供的化学式排版
\begin{equation} % 公式环境
    \ce{2H2 + O2 ->[\text{点燃}] 2H2O} % 带条件的化学反应方程式
\end{equation}
结构式： % 普通文本
\begin{center} % 居中对齐环境
    \chemfig{CH_3-CH_2-OH} % chemfig 宏包绘制的乙醇结构式
\end{center}

\section{物理示例} % 第三节标题
\label{sec:phys} % 标签

导数与偏导： % 普通文本
\begin{equation} % 公式环境
    \dv{f}{x} = \frac{df}{dx}, \quad \pdv{f}{x}{y} = \frac{\partial^2 f}{\partial x \partial y} % physics 宏包的微分和偏导命令
\end{equation}
狄拉克符号：\(\bra{\psi}\)、\(\ket{\phi}\)。 % physics 宏包的 bra 和 ket 命令

\section{算法与伪代码（CLRS风格注释）}

\label{alg:1}

\subsection{插入排序（Insertion Sort）}
\subsubsection{算法原理}
插入排序是一种简单的\textbf{原地排序算法}，核心思想：将数组分为「已排序区间」和「未排序区间」，每次从未排序区间取出一个元素，插入到已排序区间的正确位置，直到整个数组有序。
适用于\textbf{小规模数据}，且对\textbf{近乎有序的数据}效率极高。

\label{sec:algo}

\begin{algorithm}
\caption{插入排序（Insertion Sort）} % 算法标题，说明这是插入排序
\begin{algorithmic}[1] % [1] 表示每行显示行号
\Require 数组 $A[1..n]$ % 输入：待排序数组，索引从 1 到 n
\Ensure 数组 $A$ 按非递减顺序排序 % 输出：排序后的数组（升序）
\For{$j \gets 2$ \textbf{to} $n$} % 从第二个元素开始遍历到最后一个元素
    \State $key \gets A[j]$ \Comment{当前待插入元素} % 将当前元素暂存为 key
    \State $i \gets j-1$ % 设置指针 i 指向已排序部分的最后一个元素
    \While{$i > 0$ \textbf{and} $A[i] > key$} % 当 i 未越界且当前元素大于 key 时
        \State $A[i+1] \gets A[i]$ \Comment{将大于key的元素右移} % 将元素右移一位
        \State $i \gets i-1$ % 指针左移，继续比较前一个元素
    \EndWhile
    \State $A[i+1] \gets key$ % 将 key 插入到正确位置（i+1）
\EndFor
\LineComment{循环结束后数组有序} % 算法结束后的说明性注释
\end{algorithmic}
\end{algorithm}

\label{alg:2}

\subsection{欧几里得算法}
欧几里得算法用于计算\textbf{两个非负整数的最大公约数（GCD）}，核心定理：
$$ \gcd(a, b) = \gcd(b, a \bmod b) $$
递归/迭代直至余数为 0，此时的 $b$ 即为最大公约数。

\begin{algorithm}
\caption{欧几里得算法（GCD）}
\begin{algorithmic}[1]
\Require 正整数 $a, b$
\Ensure $\gcd(a, b)$
\While{$b \neq 0$}
    \State $t \gets b$
    \State $b \gets a \bmod b$
    \State $a \gets t$
\EndWhile
\State \Return $a$
\LineComment{此时a即为最大公约数}
\end{algorithmic}
\end{algorithm}

\section{代码示例}
\label{sec:code}

Python 示例：

\begin{lstlisting}[language=Python, caption=斐波那契数列]
def fibonacci(n):
    """返回第n个斐波那契数"""
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 输出前10项
for i in range(10):
    print(fibonacci(i))
\end{lstlisting}

\section{提示框示例}
\label{sec:boxes}

以下是各种提示框的用法：

\begin{notebox}
这是一个普通的提示框。用于给出额外说明或建议。
\end{notebox}

\begin{infobox}
这是一个信息框，用于提供背景知识或补充信息。
\end{infobox}

\begin{cautionbox}
注意：此部分内容需要特别关注，避免常见错误。
\end{cautionbox}

\begin{mybox}{自定义标题}
您也可以创建完全自定义标题的盒子，例如本节中这个盒子。
\end{mybox}

还可以在提示框中包含数学公式或列表：
\begin{notebox}
关于积分公式 \(\int e^{-x^2}dx\)，高斯积分的结果为 \(\sqrt{\pi}\)。
% 无序列表
\begin{itemize} % 有序：enumerate
    \item 要点1：被积函数是偶函数。
    \item 要点2：可以使用极坐标变换求解。
\end{itemize}
\end{notebox}

\section{表格示例}
\label{sec:table}

三线表：
\begin{table}[htbp]
\centering
\caption{样本数据}
\begin{tabular}{lccc}
\toprule
\textbf{名称} & \textbf{特征1} & \textbf{特征2} & \textbf{特征3} \\
\midrule
样本1 & 0.12 & 0.34 & 0.56 \\
样本2 & 0.78 & 0.90 & 0.21 \\
\bottomrule
\end{tabular}
\end{table}

\section{交叉引用示例}
\label{sec:crossref}

如 \cref{sec:math} 展示了数学内容，\cref{sec:algo} 展示了算法伪代码。引用算法 \cref{alg:1}（插入排序）和 \cref{alg:2}（欧几里得算法）。提示框内容见 \cref{sec:boxes}。

\section{参考文献示例}
\label{sec:ref}

经典算法书籍 \cite{clrs2009} 和 LaTeX 入门 \cite{lamport1994} 是相关领域的权威资料。

% 生成参考文献（需存在 ref.bib 文件）
\bibliography{ref}

\end{document}
```

引用的`biblatex`，文件名称：`ref.bib`

```Latex
@book{clrs2009,
  title={Introduction to Algorithms},
  author={Cormen, Thomas H and Leiserson, Charles E and Rivest, Ronald L and Stein, Clifford},
  edition={3rd},
  year={2009},
  publisher={MIT press}
}

@book{lamport1994,
  title={LaTeX: A Document Preparation System},
  author={Lamport, Leslie},
  edition={2nd},
  year={1994},
  publisher={Addison-Wesley}
}
```

预览：

![yulan.png](/assets/image/yulanlatex.png)