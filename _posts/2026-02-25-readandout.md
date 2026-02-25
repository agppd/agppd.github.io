---
layout: post
title: "快读模板（火车头）"
date: 2026-02-25
categories: 模板
author: bcdmwSjy
---

> 本文发布已取得代码原作者同意

```cpp
#include<stdio.h>
#include<stdint.h>
#include<string.h>
#include<sys/stat.h>
#include<sys/mman.h>

typedef unsigned u32;

unsigned _rbuf[0x10000];
struct stat _rs;
char* _rc;

#define init()\
do{\
memset(_rbuf,-1,0x40000);\
for(int i=48;i<=57;++i) for(int j=48;j<=57;++j) _rbuf[i<<8|j]=(j^48)*10+(i^48);\
fstat(0,&_rs);\
_rc=(char*)mmap(NULL,_rs.st_size,1,2,0,0);}while(0)

#define skip() do{while (*_rc<33) _rc++;}while(0)

#define gc() (*_rc++)

#define _read4u(n)\
do{n=0;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
while (*_rc>47) n=n*10+((*_rc++)^48);}while(0)

#define _read8u(n)\
do{n=0;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
if (~_rbuf[*(uint16_t*)(_rc)]) n=n*100+_rbuf[*(uint16_t*)(_rc++)],++_rc;\
while (*_rc>47) n=n*10+((*_rc++)^48);}while(0)

#define _readu(n)\
do{for(n=0;~_rbuf[*(uint16_t*)(_rc)];++_rc) n=n*100+_rbuf[*(uint16_t*)(_rc++)];\
while (*_rc>47) n=n*10+((*_rc++)^48);}while(0)

#define _read4(n) do{int f=0;_rc+=f=*_rc==45;read4u(n);if (f) n=-n;}while(0)
#define _read8(n) do{int f=0;_rc+=f=*_rc==45;read8u(n);if (f) n=-n;}while(0)
#define _read(n) do{int f=0;_rc+=f=*_rc==45;readu(n);if (f) n=-n;}while(0)

#define read4u(n) do{skip();_read4u(n);}while(0)
#define read8u(n) do{skip();_read8u(n);}while(0)
#define readu(n) do{skip();_readu(n);}while(0)
#define read4(n) do{skip();_read4(n);}while(0)
#define read8(n) do{skip();_read8(n);}while(0)
#define read(n) do{skip();_read(n);}while(0)
```

使用实例

```cpp
int main(){
    init();
    u32 n;
    int s=0,x;
    read4u(n);
    for (;n--;){
        read4(x);
        s+=x;
    }
    printf("%d",s);
	return 0;
}
```