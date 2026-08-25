---
layout: post
title: Vim配置工作区Pro
date: 2026-08-25
categories: 杂谈
author: agppd
---

本文完全包含[Vim配置工作区](https://agppd.netlify.app/%E6%9D%82%E8%B0%88/2026/08/19/vim-more-setting)的全部内容，可以直接使用此文章。

此文章比[Vim配置工作区](https://agppd.netlify.app/%E6%9D%82%E8%B0%88/2026/08/19/vim-more-setting)多了`Markdown`与`Latex`的支持。

相信各位一样，都不喜欢一个一个照着教程设置，这里给出作者现在使用的配置（由：DS给出）。

<h2><center> 请确保你已经安装了vim-plug并且vim的版本在9.2以上</center></h2>

<center>这意味着你几乎必须使用从源代码构建vim以支持vimtex</center>

你也可以[点击这里直接查看文件，便于下载](/assets/file/vim-setting-pro.txt)

```plaintext
" ================== 基本设置 ==================
set nocompatible
filetype plugin indent on
syntax on
set number
set relativenumber
set autoindent
set smartindent
set tabstop=4
set shiftwidth=4
set expandtab
set cursorline
set showcmd
set wildmenu
set encoding=utf-8
set clipboard=unnamedplus
" set termguicolors   " 若支持真彩色可开启

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
Plug 'Xuyuanp/nerdtree-git-plugin'

" ---- 图形化 ----
Plug 'skywind3000/vim-quickui'
Plug 'puremourning/vimspector'

" ---- 符号大纲 ----
Plug 'preservim/tagbar'
Plug 'ludovicchabant/vim-gutentags'

" ---- 语法检查 ----
Plug 'dense-analysis/ale'

" ---- 代码格式化 ----
Plug 'rhysd/vim-clang-format'

" ---- 状态栏 ----
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" ---- Git 集成 ----
Plug 'tpope/vim-fugitive'

" ========== 新增：Markdown 和 LaTeX 支持 ==========
" LaTeX 全能插件
Plug 'lervag/vimtex'
" Markdown 实时预览（依赖 Node.js）
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && yarn install' }

" ---- 增强语法高亮 (已包含 Markdown 和 LaTeX 基础高亮) ----
Plug 'sheerun/vim-polyglot'

call plug#end()

" ================== 配色：终端原生 ==================
" 不加载任何 colorscheme，仅修复补全菜单背景
highlight Pmenu        guifg=NONE    guibg=#1e222a ctermfg=NONE ctermbg=235
highlight PmenuSel     guifg=#ffffff guibg=#528bff ctermfg=231  ctermbg=27  gui=bold
highlight PmenuThumb   guibg=#4a5170 ctermbg=241
highlight PmenuSbar    guibg=#2c313a ctermbg=236

" ================== 插件配置 ==================

" 1. coc.nvim (保持不变)
inoremap <silent><expr> <TAB>
      \ coc#pum#visible() ? coc#pum#next(1) :
      \ CheckBackspace() ? "\<Tab>" :
      \ coc#refresh()
inoremap <expr><S-TAB> coc#pum#visible() ? coc#pum#prev(1) : "\<C-h>"

function! CheckBackspace() abort
  let col = col('.') - 1
  return !col || getline('.')[col-1]  =~# '\s'
endfunction

inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm()
                              \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)
nmap <silent> <leader>rn <Plug>(coc-rename)
nmap <silent> <leader>f <Plug>(coc-format-selected)
nmap <silent> <leader>a  <Plug>(coc-codeaction)
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

" 2. NERDTree
map <C-n> :NERDTreeToggle<CR>
let NERDTreeShowHidden=1

" 3. Tagbar
nmap <F8> :TagbarToggle<CR>

" 4. ALE (C/C++ 配置，保持不变)
let g:ale_linters = {'c': ['clangd'], 'cpp': ['clangd']}
let g:ale_fixers = {'c': ['clang-format'], 'cpp': ['clang-format']}
let g:ale_fix_on_save = 1
nmap <silent> <leader>e <Plug>(ale_previous_wrap)
nmap <silent> <leader>E <Plug>(ale_next_wrap)

" 5. clang-format
map <C-K> :ClangFormat<CR>
imap <C-K> <ESC>:ClangFormat<CR>i

" ========== 新增：vimtex 配置 ==========
" vimtex 基本设置
" vimtex 基本设置
let g:tex_flavor = 'latex'
let g:vimtex_view_method = 'zathura'

" 核心修正：通过专用配置项指定引擎
let g:vimtex_compiler_latexmk_engines = {
    \ '_' : '-xelatex',
    \}

" 其他 latexmk 选项（如 -verbose, -synctex=1 等）可以保留在这里
let g:vimtex_compiler_latexmk = {
    \ 'build_dir' : '',
    \ 'callback' : 1,
    \ 'continuous' : 1,
    \ 'executable' : 'latexmk',
    \ 'hooks' : [],
    \ 'options' : [
    \   '-verbose',
    \   '-file-line-error',
    \   '-synctex=1',
    \   '-interaction=nonstopmode',
    \ ],
    \}

" 快捷键（直接映射到命令）
nmap <leader>ll :VimtexCompile<CR>
nmap <leader>lv :VimtexView<CR>
nmap <leader>lc :VimtexClean<CR>

" ========== 新增：Markdown 预览配置 ==========
" 快捷键：Ctrl+M 打开预览（也可用 :MarkdownPreview）
nmap <C-m> <Plug>MarkdownPreviewToggle
" 或使用 <leader>mp 等，此处使用 Ctrl+M

" ========== 原有编译运行（C++）==========
set makeprg=g++\ -o\ %<\ %\ -std=c++17\ -O0\ -g\ -lm\ -fsanitize=address\ -fsanitize=undefined\ -fsanitize=leak
map <F7> :make<CR><CR><CR> :copen<CR>
map <F6> :cclose<CR>

" 快速保存退出
map <F2> :w<CR>
nnoremap <C-F2> :q<CR>
nnoremap <A-F2> :qa<CR>
nnoremap <S-F2> :wa<CR>

" Ctrl+F7 编译并运行 C++
function! CompileAndRun()
    let l:src = expand('%')
    let l:exe = expand('%:r')
    let l:ext = expand('%:e')
    if l:ext !~? '^\(cpp\|cxx\|cc\|c++\)$'
        echo "当前文件不是 C++ 源文件"
        return
    endif
    let l:cmd = 'g++ -o ' . shellescape(l:exe) . ' ' . shellescape(l:src) .
                \ ' -std=c++17 -O0 -g -lm -fsanitize=address -fsanitize=undefined -fsanitize=leak'
    echo "编译命令: " . l:cmd
    execute '!' . l:cmd
    if v:shell_error == 0
        execute 'terminal ./' . l:exe
    else
        echo "编译失败，请检查代码错误"
    endif
endfunction
nnoremap <C-F7> :call CompileAndRun()<CR>

" ---------- vim-quickui 菜单（新增 LaTeX 和 Markdown 条目）----------
" 原有菜单保持不变，添加新菜单项

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

" 构建菜单中增加 LaTeX 编译选项
call quickui#menu#install('构建(&B)', [
    \ [ "编译 C/C++ (F7)", 'make' ],
    \ [ "调试编译 (O0 -g)", 'set makeprg=g++\ -o\ %<\ %\ -std=c++17\ -O0\ -g\ -lm\ -fsanitize=address\ -fsanitize=undefined\ -fsanitize=leak\|make\|copen' ],
    \ [ "--", '' ],
    \ [ "编译并运行 C++ (Ctrl+F7)", 'call CompileAndRun()' ],
    \ [ "仅运行 C++", 'terminal ./%:r' ],
    \ [ "--", '' ],
    \ [ "LaTeX 编译 (\ll)", 'VimtexCompile' ],
    \ [ "LaTeX 预览 (\lv)", 'VimtexView' ],
    \ [ "LaTeX 清空缓存 (\lc)", 'VimtexClean' ],
    \ [ "--", '' ],
    \ [ "打开 Quickfix", 'copen' ],
    \ [ "关闭 Quickfix", 'cclose' ],
    \ ])

call quickui#menu#install('工具(&T)', [
    \ [ "NERDTree", 'NERDTreeToggle' ],
    \ [ "Tagbar", 'TagbarToggle' ],
    \ [ "--", '' ],
    \ [ "终端", 'split term://bash' ],
    \ [ "Git 状态", 'Git status' ],
    \ [ "--", '' ],
    \ [ "Markdown 预览 (Ctrl+M)", 'MarkdownPreviewToggle' ],
    \ [ "--", '' ],
    \ [ "切换行号", 'set number!' ],
    \ [ "切换相对行号", 'set relativenumber!' ],
    \ [ "切换语法高亮", 'set syntax!' ],
    \ [ "--", '' ],
    \ [ "格式化代码 (Ctrl+K)", 'ClangFormat' ],
    \ ])

" 其他菜单（视图、窗口、调试、帮助）保持不变，可省略，但为完整起见保留
call quickui#menu#install('视图(&V)', [
    \ [ "切换自动换行", 'set wrap!' ],
    \ [ "切换拼写检查", 'set spell!' ],
    \ [ "切换高亮当前行", 'set cursorline!' ],
    \ [ "显示 80 列标尺", 'set colorcolumn=80' ],
    \ ])

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

call quickui#menu#install('调试(&D)', [
    \ [ "启动 / 继续 (F5)", 'call vimspector#Launch()' ],
    \ [ "单步跳过 (F10)", 'call vimspector#StepOver()' ],
    \ [ "单步进入 (F11)", 'call vimspector#StepInto()' ],
    \ [ "单步跳出 (F12)", 'call vimspector#StepOut()' ],
    \ [ "--", '' ],
    \ [ "切换断点 (F9)", 'call vimspector#ToggleBreakpoint()' ],
    \ [ "重置 (Ctrl+F5)", 'call vimspector#Reset()' ],
    \ ])

call quickui#menu#install('帮助(&H)', [
    \ [ "快捷键汇总", 'echo "F2:保存 F3:关闭 F6:关闭Quickfix F7:编译 F8:Tagbar Ctrl+F7:编译运行 Ctrl+F2:退出所有 F1:帮助"' ],
    \ [ "Vim 版本", 'version' ],
    \ [ "--", '' ],
    \ [ "Vimspector 文档", 'help vimspector' ],
    \ ])

noremap <silent> <space><space> :call quickui#menu#open()<cr>

" ---------- vimspector ----------
let g:vimspector_enable_mappings = 'HUMAN'

" ---------- 状态栏 ----------
let g:airline_symbols_ascii = 1

" 修正：latex缺失

augroup vimtex_cmds
    autocmd!
    autocmd FileType tex command! -nargs=? VimtexCompile :call vimtex#compiler#compile(<f-args>)
    autocmd FileType tex command! VimtexView :call vimtex#view#view()
    autocmd FileType tex command! VimtexClean :call vimtex#compiler#clean()
augroup END
```

如下，是DS给出的汇总：

## Vim 快捷键完整汇总

> **说明**：  
> - `<leader>` 默认为 `\`（反斜杠），所有以 `\` 开头的快捷键（如 `\ll`）需先按反斜杠。  
> - 所有快捷键均在 **普通模式（Normal）** 下使用，除非特别说明。  
> - `Ctrl`、`Alt`、`Shift` 组合键需终端兼容性支持（如 `Alt` 组合可能需要终端设置）。

---

### 文件操作

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `F2` | **保存当前文件** | `:w` |
| `Ctrl+F2` | **关闭当前窗口（文件）** | `:q` |
| `Alt+F2` | **退出所有文件（关闭 Vim）** | `:qa` |
| `Shift+F2` | **保存所有文件** | `:wa` |
| `Ctrl+s` | 保存（菜单提示） | `:write` |
| `:w`、`:q`、`:wq`、`:q!` | 标准 Vim 命令 | 内置 |

---

### 窗口管理

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+w w` | 循环切换到下一个窗口 | `:wincmd w` |
| `Ctrl+w h` / `j` / `k` / `l` | 切换到左/下/上/右窗口 | `:wincmd h/j/k/l` |
| `Ctrl+w =` | 平均分配窗口大小 | `:wincmd =` |
| `Ctrl+w _` 或 `\|` | 最大化当前窗口 | 菜单组合 |
| `:split` / `:vsplit` | 水平/垂直分割窗口 | 内置 |
| `:close` / `:only` | 关闭当前窗口 / 仅保留当前 | 内置 |

---

### 文件浏览与符号大纲

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+n` | 打开/关闭 **NERDTree** 侧边栏 | `:NERDTreeToggle` |
| `F8` | 打开/关闭 **Tagbar**（符号大纲） | `:TagbarToggle` |

---

### 代码导航与补全（coc.nvim）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `gd` | 跳转到定义 | `<Plug>(coc-definition)` |
| `gy` | 跳转到类型定义 | `<Plug>(coc-type-definition)` |
| `gi` | 跳转到实现 | `<Plug>(coc-implementation)` |
| `gr` | 查找引用 | `<Plug>(coc-references)` |
| `<leader>rn` | 重命名符号 | `<Plug>(coc-rename)` |
| `<leader>f` | 格式化选中区域 | `<Plug>(coc-format-selected)` |
| `<leader>a` | 代码操作（修复等） | `<Plug>(coc-codeaction)` |
| `[g` / `]g` | 上一个/下一个诊断错误 | `<Plug>(coc-diagnostic-prev/next)` |
| `<Tab>` / `<S-Tab>`（插入模式） | 下一个/上一个补全项 | coc 内置 |
| `<CR>`（插入模式） | 确认补全项 | coc 内置 |

---

### 语法检查（ALE）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `<leader>e` | 跳转到上一个错误/警告 | `<Plug>(ale_previous_wrap)` |
| `<leader>E` | 跳转到下一个错误/警告 | `<Plug>(ale_next_wrap)` |
| `:ALEDetail` | 查看当前错误详情 | 插件内置 |
| `:ALEFix` | 手动修复当前文件 | 插件内置 |

---

### 代码格式化（clang-format）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+K`（普通模式） | 格式化整个文件 | `:ClangFormat` |
| `Ctrl+K`（插入模式） | 退出并格式化 | `:ClangFormat` |
| 选中后 `Ctrl+K`（可视模式） | 格式化选中区域 | `:ClangFormat` |

---

### 编译与运行（C++）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `F7` | **编译 C++**（显示错误列表） | `:make` → `:copen` |
| `Ctrl+F7` | **编译并运行**（仅 C++ 源文件） | 调用 `CompileAndRun()` 函数 |
| `F6` | 关闭 quickfix 错误窗口 | `:cclose` |
| `:copen` / `:cclose` | 手动打开/关闭错误列表 | 内置 |
| `:cnext` / `:cprev` | 下一个/上一个错误 | 内置 |

**编译命令**（`makeprg` 和 `CompileAndRun`）：
```bash
g++ -o <输出> <源文件> -std=c++17 -O0 -g -lm -fsanitize=address -fsanitize=undefined -fsanitize=leak
```

---

### LaTeX 编辑（vimtex）

> **配置**：编译器为 `latexmk -xelatex`，PDF 预览器为 **zathura**。

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `\ll` | **编译当前 LaTeX 文档**（自动用 xelatex） | `:VimtexCompile` |
| `\lv` | **打开 PDF 预览**（zathura） | `:VimtexView` |
| `\lc` | **清理编译缓存**（删 aux、log 等） | `:VimtexClean` |

> **提示**：编译成功后 zathura 会自动弹出；若需要反向搜索（从 PDF 跳回 Vim），可在 zathura 中按 `Ctrl+左键点击`。

---

### Markdown 预览

> **插件**：`markdown-preview.nvim`（需自行构建依赖）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `Ctrl+m` | **打开/关闭 Markdown 预览**（浏览器） | `:MarkdownPreviewToggle` |

> **注意**：若预览未生效，请手动在插件目录执行 `yarn install` 完成构建。  
> 备选：可通过 `:CocInstall coc-markdown-preview` 使用 coc 版本（需额外配置）。

---

### 调试（vimspector）

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `F5` | 启动调试 / 继续 | `:call vimspector#Launch()` |
| `F9` | 切换断点 | `:call vimspector#ToggleBreakpoint()` |
| `F10` | 单步跳过 | `:call vimspector#StepOver()` |
| `F11` | 单步进入 | `:call vimspector#StepInto()` |
| `F12` | 单步跳出 | `:call vimspector#StepOut()` |
| `Ctrl+F5` | 重置（停止调试） | `:call vimspector#Reset()` |
| `F4` | 运行到光标处 | vimspector 内置 |

---

### 图形化菜单（vim-quickui）

| 快捷键 | 功能 |
|--------|------|
| `空格 空格` | 打开顶部菜单栏（文件、构建、工具、视图、窗口、调试、帮助） |
| 菜单内导航 | 方向键选择，回车执行，`Esc` 关闭 |

> **菜单亮点**：  
> - **构建**菜单包含 LaTeX 编译、预览、清理项。  
> - **工具**菜单包含 NERDTree、Tagbar、终端、Markdown 预览等。

---

### 通用搜索与编辑

| 快捷键 | 功能 | 命令 |
|--------|------|------|
| `/pattern` / `?pattern` | 向下/向上搜索 | 内置 |
| `n` / `N` | 下一个/上一个匹配 | 内置 |
| `*` / `#` | 搜索当前单词（向前/向后） | 内置 |
| `:noh` | 取消高亮 | 内置 |
| `u` / `Ctrl+r` | 撤销 / 重做 | 内置 |
| `p` / `P` | 粘贴（后/前） | 内置 |
| `yy` / `dd` | 复制/剪切当前行 | 内置 |
| `v` + 移动 + `y`/`d` | 复制/剪切选中文本 | 内置 |
| `gg` / `G` | 跳转到文件首/末行 | 内置 |

---

### 内置终端（:term）

| 快捷键 / 命令 | 功能 |
|---------------|------|
| `:term` | 在当前窗口打开交互式终端 |
| `:split term://bash` | 水平分割并打开终端 |
| `:vsplit term://bash` | 垂直分割并打开终端 |
| `Ctrl + \` 后按 `Ctrl + n` | 终端模式 → 普通模式 |
| `i`（在终端窗口中） | 普通模式 → 终端模式 |
| `exit`（终端内） | 退出终端进程 |

---

### 其他辅助

- **帮助菜单**：`空格空格` → 帮助 → “快捷键汇总” 会回显常用按键提示。
- **Vim 版本信息**：菜单中可查看。
- **Git 状态**：菜单中 `Git status` 调用 `:Git status`（fugitive 插件）。

---

### 注意事项

1. **键冲突**：  
   - `F9` 被 vimspector 占用（切换断点），与 C++ 编译无关。  
   - `F5`、`F10`、`F11`、`F12` 专用于调试。

2. **终端兼容性**：  
   - `Alt+F2` 需终端将 Alt 作为 Meta 键。  
   - `Ctrl+F2` 在大多数终端可用。

3. **`<leader>` 键**：默认为 `\`，所有 `\` 开头的快捷键（如 `\ll`）需先按反斜杠。

4. **Markdown 预览**：若使用 `markdown-preview.nvim`，请确保 Node.js 和 yarn 已安装并完成构建。
