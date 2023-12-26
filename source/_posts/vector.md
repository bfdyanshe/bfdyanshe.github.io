---
title: vecotr
---
# SIMD

SIMD 代表单指令多数据，x86-64 中的 SIMD 支持有四种：

- **x86-64**: CMOV, CMPXCHG8B, FPU, FXSR, MMX, FXSR, SCE, SSE, SSE2
- **x86-64-v2**: (close to Nehalem) CMPXCHG16B, LAHF-SAHF, POPCNT, SSE3, SSE4.1, SSE4.2, SSSE3
- **x86-64-v3**: (close to Haswell) AVX, AVX2, BMI1, BMI2, F16C, FMA, LZCNT, MOVBE, XSAVE
- **x86-64-v4**: AVX512F, AVX512BW, AVX512CD, AVX512DQ, AVX512VL

除非比较老的处理器，应该基本都支持 v3 了。可以通过 `cat /proc/cpuinfo` 查看 cpu 支持的指令集。

## 使用拓展指令集的问题

1. 混用 SSE 和 AVX 指令集会导致 SEE-AVX Transition Penalty （过渡惩罚）![](vector/Pasted%20image%2020231226103026.png)
2. AVX2 和 AVX512 都有频率缩放（Frequency Scaling）的问题。除非是在密集计算中使用，向量化可以抵消频率缩放带来的影响，否则混用 AVX512 和普通指令会因为频率降低给整体带来损失。

### Frequency Scaling

因为 AVX512 很耗电，为了控制功耗，当使用 AVX2 或 AVX-512 指令的时候，Intel 会降低处理器频率。Haswell 引入 AVX2 的时候就有这种机制了。当执行 AVX-512 乘法的核心越多，频率缩放会变得更差。

如果只运行 AVX512 的时候，因为 AVX512 更宽的位数带来的性能可以抵消降频的影响。

AVX2 不用乘法指令可以运行在基频（测试结论）[On the dangers of Intel's frequency scaling (cloudflare.com)](https://blog.cloudflare.com/on-the-dangers-of-intels-frequency-scaling/)

# Gcc：通过内置函数使用向量指令

## 定义向量类型

```c
typedef int v4si __attribute__ ((vector_size (16)));
```

通过以上代码可以定义一个大小为 16 byte 的向量类型，名字叫 v4si，基础类型是 int。这个向量类型可以存储四个 int，相当于 `int[4]` 。

`vector_size` 属性只使用于整数和浮点标量，尽管数组、指针和函数返回值是被允许和此构造结合使用。只允许大小是二次方的倍数的正数的基础类型。

如果机器架构不支持指定的 SIMD 类型，GCC 生成把类型元素拆开的代码。

## 向量运算

通过这种方式定义的数据类型，可以和 c 操作符的子集使用，GCC 允许以下运算符：`+, -, *, /, unary minus, ^, |, &, ~, %` ，整数类型可以用位运算： `<<`, `>>`。

```c
v4si a, b, c;
c = a + b;
```

两个向量类型变量进行运算时，向量类型中的每个元素一一对应进行运算。

如果使用一个标量一个向量进行运算，gcc 会把标量转成向量然后进行运算。但是要注意，gcc 不会对向量做整形提升。标量的类型必须能安全转换成向量元素的类型。

```c
v4si a, b, c;
long l;
a = b + 1;    /* a = b + {1,1,1,1}; */
a = 2 * b;    /* a = {2,2,2,2} * b; */
a = l + a;    /* Error, cannot convert long to int. */
```

## 取向量元素

向量类型可以用下标访问基础元素，如果越界会发生未定义行为。可以开启 `-Warray-bounds` 来警告越界访问向量下标。

```c
typedef int v4si __attribute__ ((vector_size (16)));
int addq(v4si& a, v4si& b, v4si& c)
{
    c = a * b;
    return c[1];
}
```

## 向量比较

可以通过标准比较运算符进行向量的比较。比较运算符可以用在整数类型或实数类型向量，但是不能在整数类型和实数类型之间进行比较。比较的结果是一个向量，其元素数量和比较的向量一样，元素类型是有符号整数。对应元素比较为假产生 0，否则产生 -1 （对应类型所有 bit 置位）。

```c
typedef int v4si __attribute__ ((vector_size (16)));

v4si a = {1,2,3,4};
v4si b = {3,2,1,4};
v4si c;

c = a >  b;     /* The result would be {0, 0,-1, 0}  */
c = a == b;     /* The result would be {0,-1, 0,-1}  */
```

在 C++ 中可以对向量用三元运算符。`a?b:c` 中 `b` 和 `c` 是同类型向量，`a` 是整数向量，`a b c` 元素数量一致。计算结果会产出一个向量 `{a[0]?b[0]:c[0], a[1]?b[1]:c[1], …}` 。如果 `b` 和 `c` 其中一个是标量，那么会把这个标量转成向量。如果 `b` 和 `c` 都是标量，并且类型的大小和 `a` 的元素类型的大小一致，那么 `b` 和 `c` 都会转换成元素数量和 `a` 一样的向量。

在 C++ 中，逻辑运算符  `!, &&, ||` 可以用在向量中。`!v` 等于 `v == 0`，`a && b` 等于 `a!=0 & b!=0`，`a || b` 等于 `a!=0 | b!=0` 。对于在向量 `v` 和标量 `s`  之间混合使用，`s && v` 等于 `s?v!=0:0` (计算是短路的)，并且 `v && s` 等于 `v!=0 & (s?-1:0)` 。

## 向量洗牌

可以通过使用函数  `__builtin_shuffle (vec, mask)` 和 `__builtin_shuffle (vec0, vec1, mask)` 做向量洗牌。两个函数都是从一个或两个向量中构造元素的排列，并返回相同类型的向量。*mask* 是一个整数向量，和输出的向量的宽度 *(W)* 和元素数量 *(N)* 一致。

`vec0` 中元素的编号从 0 开始，`vec1` 中元素的编号从 *N* 开始。*mask* 的元素在单向量情况下视作模 *N*，在两个向量情况下视作模 *2N* 。

```c
typedef int v4si __attribute__ ((vector_size (16)));

v4si a = {1,2,3,4};
v4si b = {5,6,7,8};
v4si mask1 = {0,1,1,3};
v4si mask2 = {0,4,2,5};
v4si res;

res = __builtin_shuffle (a, mask1);       /* res is {1,2,2,4}  */
res = __builtin_shuffle (a, b, mask2);    /* res is {1,5,3,6}  */
```

这些内置函数可以用在函数调用和返回中，以及在赋值和一些转换中。你可以指定一个向量类型作为函数的返回类型。向量类型也可以作为函数参数。可以从一个向量类型转换成另一个向量类型，前提是他们的大小一样（事实上，你可以可以从其他一样大小的数据类型转成向量）。

你不能在没有转换的情况下在不同长度或符号的向量间操作。

另外，可以用 `__builtin_shufflevector (vec1, vec2, index...)` 函数做产出任意元素数量的向量洗牌。`vec1` 和 `vec2` 需要是元素类型兼容的向量类型。产出的向量的元素类型和 `vec1 vec2` 的元素类型一致，元素量是指定下标参数的数量。 

*index* 参数是一个整数列表，代表了应该返回的前两个向量中的元素索引。元素索引编码顺序和向量顺序一样。下标 -1 表示在返回向量中对应位置的元素是不需要的并且可以随意选择优化生成的代码顺序来执行向量洗牌。

```c
typedef int v4si __attribute__ ((vector_size (16)));
typedef int v8si __attribute__ ((vector_size (32)));

v8si a = {1,-2,3,-4,5,-6,7,-8};
v4si b = __builtin_shufflevector (a, a, 0, 2, 4, 6); /* b is {1,3,5,7} */
v4si c = {-2,-4,-6,-8};
v8si d = __builtin_shufflevector (c, b, 4, 0, 5, 1, 6, 2, 7, 3); /* d is a */
```

## 向量转换

可以使用 `__builtin_convertvector (vec, vectype)` 函数做向量转换。*vec* 必须是整数或浮点向量类型的表达式，*vectype* 是一个相同元素数量的浮点或整数向量类型。函数的结果是 *vectype* 类型，并且每个元素为 C 转换的值。

参考以下代码：

```c
typedef int v4si __attribute__ ((vector_size (16)));
typedef float v4sf __attribute__ ((vector_size (16)));
typedef double v4df __attribute__ ((vector_size (32)));
typedef unsigned long long v4di __attribute__ ((vector_size (32)));

v4si a = {1,-2,3,-4};
v4sf b = {1.5f,-2.5f,3.f,7.f};
v4di c = {1ULL,5ULL,0ULL,10ULL};
v4sf d = __builtin_convertvector (a, v4sf); /* d is {1.f,-2.f,3.f,-4.f} */
/* Equivalent of:
   v4sf d = { (float)a[0], (float)a[1], (float)a[2], (float)a[3] }; */
v4df e = __builtin_convertvector (a, v4df); /* e is {1.,-2.,3.,-4.} */
v4df f = __builtin_convertvector (b, v4df); /* f is {1.5,-2.5,3.,7.} */
v4si g = __builtin_convertvector (f, v4si); /* g is {1,-2,3,7} */
v4si h = __builtin_convertvector (c, v4si); /* h is {1,5,0,10} */
```

有时候需要混合通用向量操作（为了明晰）和机器指定的向量函数（为了使用不通过通用内置函数暴露的向量指令）。在 x86 中，内置函数一般为整数向量使用同样的向量类型 `__m128i` ，不管他们如何解析向量。这使得有必要从其他向量类型转换成它们的参数和返回值。在 C 中，你可以利用 `union` 类型。

```c
#include <immintrin.h>

typedef unsigned char u8x16 __attribute__ ((vector_size (16)));
typedef unsigned int  u32x4 __attribute__ ((vector_size (16)));

typedef union {
        __m128i mm;
        u8x16   u8;
        u32x4   u32;
} v128;
```

`v128` 的变量可以用在内置操作符和 x86 内置函数。

```c
v128 x, y = { 0 };
memcpy (&x, ptr, sizeof x);
y.u8  += 0x80;
x.mm  = _mm_adds_epu8 (x.mm, y.mm);
x.u32 &= 0xffffff;

/* Instead of a variable, a compound literal may be used to pass the
   return value of an intrinsic call to a function expecting the union: */
v128 func (v128);
x = func ((v128) {_mm_adds_epu8 (x.mm, y.mm)});
```
