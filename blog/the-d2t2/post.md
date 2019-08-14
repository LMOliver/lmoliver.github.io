有一个机器人，它有一个 $h$ 行 $w$ 列（$1\le h,w\le 200$，$h \times w \ge 2$），$h\times w$ 像素的摄像头。它有 $h\times w+10000$ 
个布尔存储单元（从 $0$ 开始编号）。

机器人的摄像头会拍下一张黑白图片，其上恰有 $2$ 个黑像素，其余皆为白像素。你需要写一个机器人程序，使机器人能够判断这两个黑像素的曼哈顿距离是否恰好为 $k$（$1\le k \le h+w-2$）。

机器人会这样执行它的程序：

- 首先，拍下一张图片。如果第 $x$ 行第 $y$ 列（从 $0$ 开始编号）的像素为黑，就把编号为 $x\times w+y$ 的存储单元设为 `true`，否则设为 `false`；

- 依次执行每条指令。

- 将最后一条指令的输出作为整个程序的输出。

一条指令接受一些输入，进行逻辑运算并得到输出。第 $i$ 条指令（从 $0$ 开始编号）以一些编号为 $0$ 至 $h\times w+i-1$ 的存储单元作为输入，得到输出并存进编号为 $h\times w+i$ 的存储单元。指令有以下 $4$ 种：

- `not`：输入为**恰好**一个存储单元，输出它的逻辑非；

- `and`：输入为**至少一个**存储单元，输出它们的逻辑与；

- `or`：输入为**至少一个**存储单元，输出它们的逻辑或；

- `xor`：输入为**至少一个**存储单元，输出它们的逻辑异或。

你只能使用至多 $10000$ 条指令，所有指令最多接受 $10^6$ 个输入。

你需要实现函数 `void construct_network(int h,int w,int k)`，其会调用 `add_<指令名>` 生成对应的指令。

`add_and`、`add_or` 和 `add_xor` 的参数是一个 `std::vector<int>`，表示作为输入的存储单元的编号，返回一个 `int`，表示新生成的指令的输出所在的存储单元的编号。

`add_not` 的参数是一个 `int`，表示作为输入的存储单元的编号，返回一个 `int`，表示新生成的指令的输出所在的存储单元的编号。

<fold-block title="题解" nocopy>

> <span class="cf-black-red">Siyuan</span>：“太简单了，不写了！”

只有 $10000$ 条指令，却有至多 $40000$ 个像素，不能对像素逐个处理。

注意到可以使用所有逻辑门，表达能力很强，不妨看看**直接写 C++**怎么做：先找到两个黑点的坐标，然后计算它们的曼哈顿距离，与 $k$ 比较。

在计算曼哈顿距离时，行和列是独立的，因此可以把两黑点的曼哈顿距离变为横向距离和纵向距离之和。

两黑点的横向距离就是**右边的黑点所在的列**编号减**左边的黑点所在的列**编号，而这就是**最右的有黑点的列**的编号减**最左的有黑点的列**的编号。

一列是最右的有黑点的列，当且仅当这一列**有**黑点且其右边的列均**无**黑点。（最左同理）

所以，我们先用 $w$ 条指令得到每列是否有黑点，就可以知道每一列是否是最左、最右的有黑点的列。但是，后面需要进行加法、减法和比较，我们需要从一组存储单元中找到唯一的 `true` 的编号，并将其表示为一个易于处理的形式。

最方便的方法就是**直接使用二进制数**。为了从一个存储单元数组中找到唯一的 `true` 的下标，我们对于分别求出结果的每一位。结果的某一位为 $1$ ，当且仅当这些存储单元中 `true` 的下标这一位为 $1$。因此，结果的某一位就是这些存储单元中所有下标这一位为 $1$ 的存储单元的逻辑或。使用这个方法，我们就能得到最左、最右的有黑点的列的编号的**二进制表示**。通过逐位模拟二进制减法，我们得到了两点的横向距离。

通过同样的方法得到两点的纵向距离，再模拟二进制加法将它们相加，就可以计算出两个黑点间的曼哈顿距离。最后，将其与 $k$ 的二进制表示逐位比较，就能知道两个黑点间的曼哈顿距离是否恰好为 $k$ 了。

得到每行、每列是否有黑点需要 $h+w$ 条指令，每次数组操作需要 $O(h)$ 或 $O(w)$ 条指令，每次二进制运算需要 $O(\log(h+w))$ 条指令。总计 $O(h+w)$ 条指令，所有命令共有 $O(hw)$ 个输入，可以通过本题。

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef int Boolean;
typedef vector<Boolean> Arr;
const int N=222;
const bool debug=false;
extern Boolean add_not(Boolean n);
extern Boolean add_and(Arr ns);
extern Boolean add_or(Arr ns);
extern Boolean add_xor(Arr ns);
Boolean True,False;
Arr make_array(Boolean a=-1,Boolean b=-1,Boolean c=-1){
	Arr x;
	if(a>=0)x.push_back(a);
	if(b>=0)x.push_back(b);
	if(c>=0)x.push_back(c);
	return x;
}
typedef Arr Number;
Number index_of(Boolean a[],int n){
	if(debug)cerr<<__FUNCTION__<<endl;
	Number x;
	for(size_t i=0;(1<<i)<n;i++){
		Arr y;
		for(int j=0;j<n;j++){
			if((j&(1<<i))){
				y.push_back(a[j]);
			}
		}
		x.push_back(add_or(y));
	}
	return x;
}
Number constant(int n){
	if(debug)cerr<<__FUNCTION__<<endl;
	Number x;
	for(size_t i=0;(1<<i)<=n;i++){
		x.push_back((n&(1<<i))?True:False);
	}
	return x;
}
Number add(Number a,Number b,size_t bits=INT_MAX){
	if(debug)cerr<<__FUNCTION__<<endl;
	if(a.size()<b.size())swap(a,b);
	Number x;
	Boolean c=False;
	for(size_t i=0;i<min(a.size(),bits);i++){
		Boolean ai=a[i];
		Boolean bi=i<b.size()?b[i]:False;
		x.push_back(add_xor(make_array(ai,bi,c)));
		c=add_or(make_array(
			add_and(make_array(ai,bi)),
			add_and(make_array(bi,c)),
			add_and(make_array(c,ai))
		));
	}
	if(x.size()<bits)x.push_back(c);
	return x;
}
Number inv(Number a){
	if(debug)cerr<<__FUNCTION__<<endl;
	Number x;
	for(size_t i=0;i<a.size();i++){
		x.push_back(add_not(a[i]));
	}
	return x;
}
Number neg(Number a){
	if(debug)cerr<<__FUNCTION__<<endl;
	return add(inv(a),constant(1),a.size());
}
Number sub(Number a,Number b){
	if(debug)cerr<<__FUNCTION__<<endl;
	return add(a,neg(b),a.size());
}
Boolean equal(Number a,Number b){
	if(debug)cerr<<__FUNCTION__<<endl;
	if(a.size()<b.size())swap(a,b);
	Boolean x=True;
	for(size_t i=0;i<a.size();i++){
		Boolean ai=a[i];
		Boolean bi=i<b.size()?b[i]:False;
		x=add_and(make_array(x,add_not(add_xor(make_array(ai,bi)))));
	}
	return x;
}
void construct_network(int h,int w,int k){
	if(debug)cerr<<__FUNCTION__<<endl;
	assert(h*w>0);
	True=add_or(make_array(0,add_not(0)));
	False=add_not(True);
	Boolean row[N],col[N];
	for(int i=0;i<h;i++){
		Arr x;
		for(int j=0;j<w;j++){
			x.push_back(i*w+j);
		}
		row[i]=add_or(x);
	}
	for(int j=0;j<w;j++){
		Arr x;
		for(int i=0;i<h;i++){
			x.push_back(i*w+j);
		}
		col[j]=add_or(x);
	}
	Boolean found;
	Boolean isrl[N],isrr[N];
	if(debug)cerr<<"isrl"<<endl;
	found=False;
	for(int i=0;i<h;i++){
		isrl[i]=add_and(make_array(add_not(found),row[i]));
		found=add_or(make_array(found,isrl[i]));
	}
	if(debug)cerr<<"isrr"<<endl;
	found=False;
	for(int i=h-1;i>=0;i--){
		isrr[i]=add_and(make_array(add_not(found),row[i]));
		found=add_or(make_array(found,isrr[i]));
	}
	Boolean iscl[N],iscr[N];
	if(debug)cerr<<"iscl"<<endl;
	found=False;
	for(int i=0;i<w;i++){
		iscl[i]=add_and(make_array(add_not(found),col[i]));
		found=add_or(make_array(found,iscl[i]));
	}
	if(debug)cerr<<"iscr"<<endl;
	found=False;
	for(int i=w-1;i>=0;i--){
		iscr[i]=add_and(make_array(add_not(found),col[i]));
		found=add_or(make_array(found,iscr[i]));
	}
	equal(
		add(
			sub(
				index_of(isrr,h),
				index_of(isrl,h)
			),
			sub(
				index_of(iscr,w),
				index_of(iscl,w)
			)
		),
		constant(k)
	);
}
```

</fold-block>