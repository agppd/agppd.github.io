---
layout: post
title: "Vim使用教程"
date: 2026-08-19
categories: 杂谈
author: agppd
---

相信各位一样，都不喜欢一个一个照着教程设置，这里给出作者现在使用的配置（由：DS给出）。

<h2><center> 请确保你已经安装了vim-plug并且vim的版本在8.1以上</center></h2>

你也可以[点击这里直接查看文件，便于下载](/assert/file/vim-setting.txt)

```plaintext
" ================== 基本设置 ==================
set nocompatible              " 关闭兼容模式
filetype plugin indent on     " 启用文件类型检测
syntax on                     " 语法高亮
set number                    " 显示行号
set relativenumber            " 相对行号（便于跳转）
set autoindent
set smartindent
set tabstop=4
set shiftwidth=4
set expandtab                 " 空格代替 Tab
set cursorline                " 高亮当前行
set showcmd                   " 显示输入命令
set wildmenu                  " 命令行补全增强
set encoding=utf-8
set clipboard=unnamedplus     " 使用系统剪贴板

" 搜索设置
set hlsearch
set incsearch
set ignorecase
set smartcase

" ================== 插件管理 ==================
call plug#begin('~/.vim/plugged')

let g:coc_node_path = '/home/user/.nvm/versions/node/v22.23.2/bin/node'

" ---- 核心 LSP 与补全 ----
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" ---- 文件浏览 ----
Plug 'preservim/nerdtree'
Plug 'Xuyuanp/nerdtree-git-plugin' " NERDTree 显示 git 状态

" ---- 图形化 ----
Plug 'skywind3000/vim-quickui'
Plug 'puremourning/vimspector'

" ---- 符号大纲 ----
Plug 'preservim/tagbar'
Plug 'ludovicchabant/vim-gutentags'    " 自动管理 tags 文件

" ---- 语法检查（异步） ----
Plug 'dense-analysis/ale'

" ---- 代码格式化 ----
Plug 'rhysd/vim-clang-format'

" ---- 状态栏 ----
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" ---- Git 集成 ----
Plug 'tpope/vim-fugitive'

" ---- 配色主题（推荐一个现代主题） ----
Plug 'morhetz/gruvbox'

" ---- 增强语法高亮 ----
Plug 'sheerun/vim-polyglot'

" ---- 可选：调试支持 (图形化调试) ----
" Plug 'puremourning/vimspector'

call plug#end()

" ================== 插件配置 ==================

" 1. coc.nvim 设置
" 使用 <Tab> 进行补全选择
inoremap <silent><expr> <TAB>
      \ coc#pum#visible() ? coc#pum#next(1) :
      \ CheckBackspace() ? "\<Tab>" :
      \ coc#refresh()
inoremap <expr><S-TAB> coc#pum#visible() ? coc#pum#prev(1) : "\<C-h>"

function! CheckBackspace() abort
  let col = col('.') - 1
  return !col || getline('.')[col-1]  =~# '\s'
endfunction

" 回车选中补全项
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm()
                              \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

" 常用快捷键
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)
nmap <silent> <leader>rn <Plug>(coc-rename)
nmap <silent> <leader>f <Plug>(coc-format-selected)
nmap <silent> <leader>a  <Plug>(coc-codeaction)
" 诊断跳转
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

" 2. NERDTree
map <C-n> :NERDTreeToggle<CR>
let NERDTreeShowHidden=1

" 3. Tagbar
nmap <F8> :TagbarToggle<CR>

" 4. ALE (异步检查)
let g:ale_linters = {'c': ['clangd'], 'cpp': ['clangd']}
let g:ale_fixers = {'c': ['clang-format'], 'cpp': ['clang-format']}
let g:ale_fix_on_save = 1
" 快捷键：跳转到上一个/下一个错误
nmap <silent> <leader>e <Plug>(ale_previous_wrap)
nmap <silent> <leader>E <Plug>(ale_next_wrap)

" 5. clang-format 快捷键
map <C-K> :ClangFormat<CR>
imap <C-K> <ESC>:ClangFormat<CR>i

" 6. 主题
" colorscheme gruvbox
" set background=dark

" 7. 编译运行 (使用 quickfix)
set makeprg=g++\ -o\ %<\ %\ -std=c++17\ -O0\ -g\ -lm\ -fsanitize=address\ -fsanitize=undefined\ -fsanitize=leak
map <F7> :make<CR><CR><CR> :copen<CR>
map <F6> :cclose<CR>

" 8. 快速保存和退出
map <F2> :w<CR>                 " 保存当前文件
nnoremap <C-F2> :q<CR>          " 关闭当前窗口（文件）
nnoremap <A-F2> :qa<CR>         " 退出所有文件（关闭 Vim）
nnoremap <S-F2> :wa<CR>         " 保存所有文件（若需 Super 请改用 <D-F2>，但仅限 gVim）

" Ctrl + F7：编译当前 C++ 文件并运行（支持 stdin/stdout）
function! CompileAndRun()
    let l:src = expand('%')
    let l:exe = expand('%:r')
    let l:ext = expand('%:e')

    " 仅对 C++ 源文件生效
    if l:ext !~? '^\(cpp\|cxx\|cc\|c++\)$'
        echo "当前文件不是 C++ 源文件"
        return
    endif

    " 构建编译命令（使用 shellescape 防特殊字符）
    let l:cmd = 'g++ -o ' . shellescape(l:exe) . ' ' . shellescape(l:src) .
                \ ' -std=c++17 -O0 -g -lm -fsanitize=address -fsanitize=undefined -fsanitize=leak'

    " 显示编译命令（方便调试）
    echo "编译命令: " . l:cmd

    " 执行编译
    execute '!' . l:cmd

    " 检查编译是否成功（v:shell_error 为 0 表示成功）
    if v:shell_error == 0
        " 编译成功，在终端中运行程序
        execute 'terminal ./' . l:exe
    else
        echo "编译失败，请检查代码错误"
    endif
endfunction

" 映射 Ctrl + F7 为编译并运行
nnoremap <C-F7> :call CompileAndRun()<CR>

" ---------- vim-quickui 菜单配置 ----------
" 清空所有菜单（如需重置，取消注释）
" call quickui#menu#reset()

" 安装 文件 菜单
call quickui#menu#install('文件(&F)', [
    \ [ "新建标签页\tCtrl+n", 'tabnew' ],
    \ [ "新建文件", 'enew' ],
    \ [ "打开\t:open", 'call feedkeys(":open ")'],
    \ [ "重新加载", 'e!' ],
    \ [ "--", '' ],
    \ [ "保存\tCtrl+s", 'write' ],
    \ [ "另存为", 'call feedkeys(":saveas ")'],
    \ [ "全部保存\tShift+F2", 'wa' ],
    \ [ "--", '' ],
    \ [ "退出\tAlt+F2", 'qa' ],
    \ ])

" 安装 构建 菜单
call quickui#menu#install('构建(&B)', [
    \ [ "编译 (F7)", 'make' ],
    \ [ "调试编译 (O0 -g)", 'set makeprg=g++\ -o\ %<\ %\ -std=c++17\ -O0\ -g\ -lm\ -fsanitize=address\ -fsanitize=undefined\ -fsanitize=leak\|make\|copen' ],
    \ [ "--", '' ],
    \ [ "编译并运行 (Ctrl+F7)", 'call CompileAndRun()' ],
    \ [ "仅运行", 'terminal ./%:r' ],
    \ [ "--", '' ],
    \ [ "打开 Quickfix", 'copen' ],
    \ [ "关闭 Quickfix", 'cclose' ],
    \ ])

" 安装 工具 菜单
call quickui#menu#install('工具(&T)', [
    \ [ "NERDTree", 'NERDTreeToggle' ],
    \ [ "Tagbar", 'TagbarToggle' ],
    \ [ "--", '' ],
    \ [ "终端", 'split term://bash' ],
    \ [ "Git 状态", 'Git status' ],
    \ [ "--", '' ],
    \ [ "切换行号", 'set number!' ],
    \ [ "切换相对行号", 'set relativenumber!' ],
    \ [ "切换语法高亮", 'set syntax!' ],
    \ [ "--", '' ],
    \ [ "格式化代码 (Ctrl+K)", 'ClangFormat' ],
    \ ])

" 安装 视图 菜单（保留显示相关设置）
call quickui#menu#install('视图(&V)', [
    \ [ "切换自动换行", 'set wrap!' ],
    \ [ "切换拼写检查", 'set spell!' ],
    \ [ "切换高亮当前行", 'set cursorline!' ],
    \ [ "显示 80 列标尺", 'set colorcolumn=80' ],
    \ ])

" 安装 窗口 菜单（含方向切换）
call quickui#menu#install('窗口(&W)', [
    \ [ "水平分割", 'split' ],
    \ [ "垂直分割", 'vsplit' ],
    \ [ "--", '' ],
    \ [ "切换窗口 (循环)\tCtrl+w w", 'wincmd w' ],
    \ [ "切换到左窗口\tCtrl+w h", 'wincmd h' ],
    \ [ "切换到下窗口\tCtrl+w j", 'wincmd j' ],
    \ [ "切换到上窗口\tCtrl+w k", 'wincmd k' ],
    \ [ "切换到右窗口\tCtrl+w l", 'wincmd l' ],
    \ [ "--", '' ],
    \ [ "关闭当前窗口", 'close' ],
    \ [ "关闭其他窗口", 'only' ],
    \ [ "--", '' ],
    \ [ "最大化窗口", 'wincmd _ | wincmd |' ],
    \ [ "平均分配窗口", 'wincmd =' ],
    \ ])

" 安装 调试 菜单（需要 vimspector 插件）
call quickui#menu#install('调试(&D)', [
    \ [ "启动 / 继续 (F5)", 'call vimspector#Launch()' ],
    \ [ "单步跳过 (F10)", 'call vimspector#StepOver()' ],
    \ [ "单步进入 (F11)", 'call vimspector#StepInto()' ],
    \ [ "单步跳出 (F12)", 'call vimspector#StepOut()' ],
    \ [ "--", '' ],
    \ [ "切换断点 (F9)", 'call vimspector#ToggleBreakpoint()' ],
    \ [ "重置 (Ctrl+F5)", 'call vimspector#Reset()' ],
    \ ])

" 安装 帮助 菜单
call quickui#menu#install('帮助(&H)', [
    \ [ "快捷键汇总", 'echo "F2:保存 F3:关闭 F6:关闭Quickfix F7:编译 F8:Tagbar Ctrl+F7:编译运行 Ctrl+F2:退出所有 F1:帮助"' ],
    \ [ "Vim 版本", 'version' ],
    \ [ "--", '' ],
    \ [ "Vimspector 文档", 'help vimspector' ],
    \ ])

" 按两次空格键打开菜单
noremap <silent> <space><space> :call quickui#menu#open()<cr>


" ---------- vimspector 调试器配置 ----------
" 启用 HUMAN 模式快捷键（更符合 Vim 习惯）
let g:vimspector_enable_mappings = 'HUMAN'

" --------- 修正Col 显示 -------------
let g:airline_symbols_ascii = 1

```

如下，是DS给出的汇总：

##  Vim 快捷键完整汇总

> **说明**：  
> - `<leader>` 默认为 `\`（反斜杠），您可以通过 `let mapleader = " "` 改为空格（未配置）。  
> - 所有快捷键均在 **普通模式（Normal）** 下使用，除非特别说明（如插入模式）。  
> - `Ctrl`、`Alt`、`Shift` 组合键均按常见终端兼容性编写，部分 `Alt` 组合可能需要终端设置。

---

###  文件操作

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `F2` | **保存当前文件** | `:w` |
| `Ctrl+F2` | **关闭当前窗口（文件）** | `:q` |
| `Alt+F2` | **退出所有文件（关闭 Vim）** | `:qa` |
| `Shift+F2` | **保存所有文件** | `:wa` |
| `Ctrl+s` | 保存（菜单提示，对应 `:write`） | `:write` |
| `:w`、`:q`、`:wq`、`:q!` | 标准 Vim 命令（不变） | 内置 |

---

###  窗口管理

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+w w` | 循环切换到下一个窗口 | `:wincmd w` |
| `Ctrl+w h` | 切换到左窗口 | `:wincmd h` |
| `Ctrl+w j` | 切换到下窗口 | `:wincmd j` |
| `Ctrl+w k` | 切换到上窗口 | `:wincmd k` |
| `Ctrl+w l` | 切换到右窗口 | `:wincmd l` |
| `Ctrl+w =` | 平均分配窗口大小 | `:wincmd =` |
| `Ctrl+w _` 或 `\|` | 最大化当前窗口（菜单组合） | `:wincmd _ \| :wincmd \|` |
| `:split` / `:vsplit` | 水平/垂直分割窗口 | 内置 |
| `:close` | 关闭当前窗口 | 内置 |
| `:only` | 关闭其他窗口（保留当前） | 内置 |

---

###  文件浏览与符号大纲

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+n` | 打开/关闭 **NERDTree** 侧边栏 | `:NERDTreeToggle` |
| `F8` | 打开/关闭 **Tagbar**（符号大纲） | `:TagbarToggle` |
| 在 NERDTree 中：`?`、`m`、`o`、`v`、`s`、`R`、`P`、`p` | 文件树操作（详见 NERDTree 帮助） | 插件内置 |

---

###  智能补全与代码导航（coc.nvim）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `gd` | 跳转到定义 | `:call coc#definition()` |
| `gy` | 跳转到类型定义 | `:call coc#typeDefinition()` |
| `gi` | 跳转到实现 | `:call coc#implementation()` |
| `gr` | 查找引用 | `:call coc#references()` |
| `<leader>rn` | 重命名符号 | `:call coc#rename()` |
| `<leader>f` | 格式化选中区域 | `:call coc#formatSelected()` |
| `<leader>a` | 执行代码操作（修复错误等） | `:call coc#codeAction()` |
| `[g` | 跳转到上一个诊断错误/警告 | `:call coc#diagnosticPrev()` |
| `]g` | 跳转到下一个诊断错误/警告 | `:call coc#diagnosticNext()` |
| `<Tab>`（插入模式） | 选择下一个补全项 | coc 内置 |
| `Shift+Tab`（插入模式） | 选择上一个补全项 | coc 内置 |
| `<CR>`（插入模式） | 确认选中的补全项 | coc 内置 |
| `:CocList`、`:CocCommand` | 打开 coc 列表 / 执行命令 | 插件内置 |

---

###  语法检查（ALE）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `<leader>e` | 跳转到上一个错误/警告 | `:call ale#PreviousWrap()` |
| `<leader>E` | 跳转到下一个错误/警告 | `:call ale#NextWrap()` |
| `:ALEDetail` | 查看当前错误详情 | 插件内置 |
| `:ALEFix` | 手动修复当前文件 | 插件内置 |

> 注：`g:ale_fix_on_save = 1` 使保存时自动格式化。

---

###  代码格式化

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+K`（普通模式） | 格式化整个当前文件 | `:ClangFormat` |
| `Ctrl+K`（插入模式） | 退出插入模式并格式化 | `:ClangFormat` |
| 选中区域后 `Ctrl+K`（可视模式） | 格式化选中区域 | `:ClangFormat` |

---

###  编译与运行

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `F7` | **仅编译**（使用 `makeprg`） | `:make` → `:copen` |
| `Ctrl+F7` | **编译并运行**（C++ 源文件） | 调用 `CompileAndRun()` 函数 |
| `F6` | 关闭 quickfix 窗口（编译错误列表） | `:cclose` |
| `:copen` / `:cclose` | 手动打开/关闭 quickfix | 内置 |
| `:cnext` / `:cprev` | 跳转到下一个/上一个错误 | 内置 |
| `:cfirst` / `:clast` | 跳转到第一个/最后一个错误 | 内置 |

**编译命令详情**（`makeprg` 和 `CompileAndRun` 函数）：
```
g++ -o <文件名（无扩展名）> <当前源文件> -std=c++17 -O0 -g -lm -fsanitize=address -fsanitize=undefined -fsanitize=leak
```

---

###  调试（vimspector）

> **注意**：启用 `HUMAN` 模式，以下快捷键被占用（可能与您的 `F9` 冲突，但您已将 `F9` 用于切换断点）。

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `F5` | 启动调试 / 继续 | `:call vimspector#Launch()` |
| `F9` | 切换断点 | `:call vimspector#ToggleBreakpoint()` |
| `F10` | 单步跳过 | `:call vimspector#StepOver()` |
| `F11` | 单步进入 | `:call vimspector#StepInto()` |
| `F12` | 单步跳出 | `:call vimspector#StepOut()` |
| `Ctrl+F5` | 重置（停止调试） | `:call vimspector#Reset()` |
| `F4` | 运行到光标处 | vimspector 内置 |

**注意**：`F9` 原本可用于“编译并运行”，但现在被 vimspector 占用，您已将“编译并运行”映射到 `Ctrl+F7`，故无冲突。

---

###  图形化菜单（vim-quickui）

| 快捷键 | 功能 |
|--------|------|
| `空格 空格` | 打开顶部菜单栏（文件、构建、工具、视图、窗口、调试、帮助） |
| 菜单内：方向键选择，回车执行，`Esc` 关闭 | 菜单导航 |

---

###  通用搜索与编辑

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `/pattern` | 向下搜索 | 内置 |
| `?pattern` | 向上搜索 | 内置 |
| `n` / `N` | 下一个/上一个匹配 | 内置 |
| `*` / `#` | 搜索当前单词（向前/向后） | 内置 |
| `:noh` | 取消高亮 | 内置 |
| `u` | 撤销 | 内置 |
| `Ctrl+r` | 重做 | 内置 |
| `p` / `P` | 粘贴（后/前） | 内置 |
| `yy` / `dd` | 复制/剪切当前行 | 内置 |
| `v` + 移动 + `y`/`d` | 复制/剪切选中文本 | 内置 |
| `gg` / `G` | 跳转到文件首/末行 | 内置 |
| `:set number!`、`:set relativenumber!`、`:set wrap!` 等 | 通过菜单切换显示选项 | 内置 |

---

###  内置终端（:term）

| 快捷键 / 命令 | 功能 |
|---------------|------|
| `:term` | 在当前窗口打开交互式终端 |
| `:split term://bash` | 水平分割并打开终端（菜单中也有） |
| `:vsplit term://bash` | 垂直分割并打开终端（可手动输入） |
| `Ctrl + \` 后按 `Ctrl + n` | 终端模式 → 普通模式 |
| `i`（在终端窗口中） | 普通模式 → 终端模式 |
| `exit`（终端内） | 退出终端进程 |

---

###  其他辅助

- **帮助菜单**：`两次空格` → 帮助 → “快捷键汇总” 会回显常用按键提示。
- **Vim 版本信息**：菜单中可查看。
- **Git 状态**：菜单中 `Git status` 调用 `:Git status`（fugitive 插件）。

---

###  注意事项

1. **键冲突**：
   - `F9` 被 vimspector 占用（切换断点），您已使用 `Ctrl+F7` 作为编译并运行，无影响。
   - `F5`、`F10`、`F11`、`F12` 被 vimspector 占用，若您不调试，可忽略。
   - `F4` 也被占用（运行到光标处）。

2. **终端兼容性**：
   - `Alt+F2` 需要在终端设置中启用“将 Alt 作为 Meta 键”。
   - `Shift+F2` 通常可用。
   - `Ctrl+F2` 在大多数终端中可用。

1. **`<leader>` 键**：默认为 `\`，所有 `\` 开头的快捷键（如 `\rn`）需要先按反斜杠。