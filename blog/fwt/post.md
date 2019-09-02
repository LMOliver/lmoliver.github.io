## 问题 

有两个长为 $2^n$ 的数列 $A$ 和 $B$，求 $A\circ B$（$(A\circ B)_x=\sum_{\operatorname{OP}(i,j)}A_i\times B_j$)，其中 $\operatorname{OP}$ 是一种满足交换律的位运算。

## 参考

- [FWT快速沃尔什变换学习笔记](https://www.cnblogs.com/cjyyb/p/9065615.html)（by [yyb](https://www.cnblogs.com/cjyyb)）

- [【总结】FWT算法](https://blog.csdn.net/qq_34454069/article/details/79524001)（by [616156](https://blog.csdn.net/qq_34454069) ,遵循 [CC 4.0 BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) 版权协议）

## 思路

仿照 $\operatorname{FFT}$，我们可以尝试求出 $\operatorname{FWT}$，使得 $\operatorname{FWT}(A\circ B)_i=\operatorname{FWT}(A)_i\times \operatorname{FWT}(B)_i$。

考虑到 $\operatorname{FWT}$ 是按位运算，不妨每次先分治，这样就只用考虑最高位了。对于一个长为 $2^n$ 的数列 $X$，记 $X_{\operatorname{L}}=X[0\dots 2^{n-1}-1]$，$X_{\operatorname{R}}=X[2^{n-1}\dots 2^n-1]$，$X=X_{\operatorname{L}};X_{\operatorname{R}}$。

假设 $\operatorname{FWT}(X)=a_1\operatorname{FWT}(X_{\operatorname{L}})+b_1\operatorname{FWT}(X_{\operatorname{R}});a_2\operatorname{FWT}(X_{\operatorname{L}})+b_2\operatorname{FWT}(X_{\operatorname{R}})$，

设 $P_i=\operatorname{OP}([i\ge1],[i=2])$，

经过一波推导（具体过程见[此处，文档 D](https://lmoliver.github.io/mosiyuan))，我们得到了一个教程：

1. 解出方程组 $a^{2-i}b^i=(P_i=0?a:b)$ $(0\le i\le2)$ 的两组**线性无关**的解 $(a_1,b_1),(a_2,b_2)$；

2. $\operatorname{FWT}(X)=a_1\operatorname{FWT}(X_{\operatorname{L}})+b_1\operatorname{FWT}(X_{\operatorname{R}});a_2\operatorname{FWT}(X_{\operatorname{L}})+b_2\operatorname{FWT}(X_{\operatorname{R}})$；

3. 依照上面的式子从 $\operatorname{FWT}(X)$ 解出 $\operatorname{FWT}(X_{\operatorname{L}})$ 和 $\operatorname{FWT}(X_{\operatorname{R}})$，那么 $\operatorname{IFWT}(\operatorname{FWT}(X_{\operatorname{L}}));\operatorname{IFWT}(\operatorname{FWT}(X_{\operatorname{R}}))$ 就是 $\operatorname{IFWT}(\operatorname{FWT}(X))=X$；

4. $A\circ B=\operatorname{IFWT}(\operatorname{FWT}(A)\times\operatorname{FWT}(B))$。

可以发现 $\operatorname{FWT}$ 和 $\operatorname{IFWT}$ 都是 $O(n\log n)$ 的。

下面考虑几个特殊的 $\operatorname{OP}$。

|$\operatorname{OP}$|$P_0$|$P_1$|$P_2$|$a_1$|$b_1$|$a_2$|$b_2$|
|-|-|-|-|-|-|-|-|
|按位或|$0$|$0$|$1$|$1$|$0$|$1$|$1$|
|按位与|$0$|$1$|$1$|$0$|$1$|$1$|$1$|
|按位异或|$0$|$1$|$0$|$1$|$1$|$1$|$-1$|

## 代码

这里给出 $\operatorname{OP}$ 为按位异或时的递归实现。实际上，为了减小常数，可以仿照 $\operatorname{FFT}$ 将递归改为迭代，在此不再赘述。**注意 $\operatorname{FWT}$ 的结果可能会爆 `int`！**

```cpp
void FWT(long long *x,int n){
	if(n==1)return;
	int l=n>>1;
	FWT(x,l);
	FWT(x+l,l);
	for(int i=0;i<l;i++){
		long long &u=x[i],&v=x[l+i];
		long long uu=u,vv=v;
		u=uu+vv;
		v=uu-vv;
	}
}
void IFWT(long long *x,int n){
	if(n==1)return;
	int l=n>>1;
	for(int i=0;i<l;i++){
		long long &u=x[i],&v=x[l+i];
		long long uu=u,vv=v;
		u=(uu+vv)>>1;
		v=(uu-vv)>>1;
	}
	IFWT(x,l);
	IFWT(x+l,l);
}
```