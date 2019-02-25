[U3](https://codeforces.com/contest/1115/problem/U3)怎么做啊QAQ

又写了一个假做法QAQ…… U3弃疗

<fold-block title="假做法">

```qs
namespace Solution{
    open Microsoft.Quantum.Primitive;
    open Microsoft.Quantum.Canon;
	operation Doit(a:Qubit,b:Qubit,c:Qubit):Unit{
		H(b);
		CCNOT(a,b,c);
		X(a);
		H(b);
		X(b);
		CCNOT(a,b,c);
		CCNOT(a,c,b);
		X(a);
		H(c);
		X(c);
		CCNOT(a,c,b);
		X(c);
		H(c);
		CNOT(c,b);
		CNOT(b,c);
	}
    operation Solve (qs : Qubit[]) : Unit {
		let N=Length(qs);
		using (c = Qubit()) {
			for(i in 0..N-2){
				Doit(qs[N-1],qs[i],c);
			}
		}
    }
}
```

</fold-block>

以下是一个U3的爆搜，并没有跑出结果。

<fold-block title="爆搜">

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef complex<double> C;
typedef C Mat[4][4];
#define F(i) for(int i=0;i<4;i++)
void cp(const Mat a,Mat &b){
	F(i)F(j)b[i][j]=a[i][j];
}
void cl(Mat &x,C p=0){
	F(i)F(j)x[i][j]=i==j?p:0;
}
void mul(const Mat a,const Mat b,Mat &c){
	Mat tmp;
	cl(tmp);
	F(i)F(j)F(k)tmp[i][j]+=a[i][k]*b[k][j];
	cp(tmp,c);
}
bool isZero(double x){
	return abs(x)<=0.001;
}
void print(C x){
	printf("% .3f",x.real());
	if(!isZero(x.imag()))printf("%+.2fi",x.imag());
}
void db(const Mat x){
	F(i){
		F(j)print(x[i][j]),cout<<"\t";
		cout<<"\n";
	}
}
const Mat X1={
	{0,0,1,0},
	{0,0,0,1},
	{1,0,0,0},
	{0,1,0,0},
};
const Mat Z1={
	{1,0,0,0},
	{0,1,0,0},
	{0,0,-1,0},
	{0,0,0,-1},
};
const Mat CNOT={
	{1,0,0,0},
	{0,1,0,0},
	{0,0,0,1},
	{0,0,1,0},
};
const Mat SWAP={
	{1,0,0,0},
	{0,0,1,0},
	{0,1,0,0},
	{0,0,0,1},
};
const C rt2=1/sqrt(2);
const Mat H1={
	{rt2,0   ,rt2 ,0   },
	{0  ,rt2 ,0   ,rt2 },
	{rt2,0   ,-rt2,0   },
	{0  ,rt2 ,0	  ,-rt2},
};
const C im=C(0,1);
const Mat Y1={
	{0,0   ,-im ,0   },
	{0  ,0 ,0   ,-im },
	{im,0   ,0,0   },
	{0  ,im ,0	  ,0},
};
Mat T;
int pattern[4][4]={
	{0,1,0,0},
	{1,0,0,0},
	{0,0,1,1},
	{0,0,1,1},
};
const Mat li[]={
	X1,Z1,H1,CNOT,Y1,SWAP
};
const int CNT=sizeof(li)/sizeof(li[0]);
int DEP=0;
int cur=0;
int sol[1000];
void dfs(){
	F(i)F(j){
		if((isZero(T[i][j].real()?0:1))^pattern[i][j]){
			goto no;
		}
	}
	db(T);
	printf("%d OP(s):\n",cur);
	for(int i=0;i<cur;i++){
		printf("OP#%d ",sol[i]);
	}
	printf("\n");
	exit(0);
	no:;
	if(cur==DEP)return;
	for(int i=0;i<CNT;i++){
		sol[cur++]=i;
		mul(li[i],T,T);
		dfs();
		mul(li[i],T,T);
		cur--;
	}
}
int main(){
	cl(T,1);
	for(int i=0;;i++){
		DEP=i;
		dfs();
		cout<<"search "<<i<<" done."<<endl;
	}
	return 0;
}
```

</fold-block>

等比赛结束后的题解了qwq

[CF Announcement](https://codeforces.com/blog/entry/65063)

[Quantum Computing: Lecture Notes by Ronald de Wolf](https://homepages.cwi.nl/~rdewolf/qcnotes.pdf)

[Warmup](https://codeforces.com/contest/1115)