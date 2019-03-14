## 一个问题

> 离线求区间第$k$小，区间长为$n$，操作数为$m$，数字最大为$c$。

<span class="cf-black-red">Siyuan</span>大佬:“主席树$O\left( (n+m)\log c\right)$秒杀！”

> 禁用线段树！

<span class="cf-black-red">stepsys</span>大佬:“使用整体二分！”

那么，整体二分是什么？

## 普通二分

我们先考虑用普通的二分答案算法解决本题，对于每个数都二分答案一次，复杂度$O(nm\log c)$。很显然，这样的做法会**TLE**。

那么我们都干了些什么呢？

在每次二分的每一轮，都需要：

1. 处理所有区间内的数，统计$\le mid$的数的个数；

2. 根据结果取左边或右边。

注意到第$1$步在$mid$相同的前提下是可以用树状数组预处理的。这意味着如果能把所有$mid$相同的轮统一处理，就有希望降低复杂度。

## 整体二分

把所有$mid$相同的轮统一处理的需求意味着我们必须**统一处理所有询问**。这也意味着整体二分是一个**离线算法**。我们不妨设`solve(q,l,r)`表示对询问序列$q$，答案区间$[l,r]$进行整体二分的过程，那么这个过程应该看起来像这样：

1. 处理所有数，用树状数组维护区间$\le mid$的数的个数；

2. 对于$q$中的每个询问，求出它应该去左区间还是右区间，分为$q_1$和$q_2$两类。

3. `solve(q1,l,mid);solve(q2,mid+1,r);`

看上去效率提高了！

冷静分析，不同的$mid$可以有$O(m\log c)$种，每种$mid$需要$O(n)$时间……**TLE**

怎么办？$mid$种数似乎无法再优化，但每种$mid$是否非得$O(n)$不可呢？

考虑在`slove(q,l,r)`时，数被根据是否$\le mid$自动分为两类。对于$\le mid$的那些，这些数对$q_1$的影响还需考虑，但它们一定不比在$q_2$的所有二分的$mid$大，这个影响可以提前处理；对于剩下的那些，这些数对$q_2$的影响还需考虑,但它们一定对在$q_2$的所有二分没有影响。因此，我们可以在把询问分成两类时把数也分成两类，分别递归。值得一提的是，如果把数字本身看成**加数操作**，那么就可以统一处理数字与询问，并且在后续问题中可以产生巨大的好处。

复杂度？

二分最多有$O(\log c)$层，每层复杂度最高$O((n+m)\log n)$，所以总复杂度是$O((n+m)\log n\log c)$！**AC**了！

<fold-block title="严重依赖STL的代码">

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=200200;
const int INF=0x3f3f3f3f;

#define DB(x) (cerr<<#x"="<<(x)<<endl)

struct Op{
	int l,r,val,t,id;
	Op(int _l=0,int _r=0,int _val=0,int _t=0,int _i=0){
		l=_l,r=_r,val=_val,t=_t,id=_i;
	}
};
vector<Op> qaq;

struct BIT{
	int a[N];
	void add(int x,int v){
		for(;x<N;x+=x&-x)a[x]+=v;
	}
	int qe(int x){
		int ans=0;
		for(;x;x-=x&-x)ans+=a[x];
		return ans;
	}
}tr;

int ans[N];
void solve(int ql,int qr,int l,int r){
	static vector<Op> q1,q2;
	q1.clear();
	q2.clear();
	if(ql>qr)return;
	if(l==r){
		for(int i=ql;i<=qr;i++){
			if(qaq[i].t==2){
				ans[qaq[i].id]=l;
			}
		}
		return;
	}
	int mid=(l+r)>>1;
	for(int i=ql;i<=qr;i++){
		Op &op=qaq[i];
		if(op.t==1){//加数
			if(op.val<=mid){
				q1.push_back(op);
				tr.add(op.l,1);
			}else{
				q2.push_back(op);
			}
		}else if(op.t==2){//询问
			int lc=tr.qe(op.r)-tr.qe(op.l-1);
			if(op.val<=lc){
				q1.push_back(op);
			}else{
				op.val-=lc;//<=mid 的数一定会对q2产生影响
				q2.push_back(op);
			}
		}else cerr<<"QAQ?"<<endl;
	}
	for(vector<Op>::iterator it=q1.begin();it!=q1.end();++it){
		if(it->t==1)tr.add(it->l,-1);//重置树状数组(不能memset0!)
	}
	int q1s=q1.size();
	copy(q1.begin(),q1.end(),qaq.begin()+ql);
	copy(q2.begin(),q2.end(),qaq.begin()+ql+q1s);
	solve(ql,ql+q1s-1,l,mid);
	solve(ql+q1s,qr,mid+1,r);
}

int a[N];
int b[N];
map<int,int> mp;

int main(){
	int n,m;
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++){
		scanf("%d",&a[i]);
	}
	copy(a+1,a+n+1,b+1);//离散化不必要
	sort(b+1,b+n+1);
	int cnt=unique(b+1,b+n+1)-(b+1);
	for(int i=1;i<=cnt;i++){
		mp[b[i]]=i;
	}
	for(int i=1;i<=n;i++){
		a[i]=mp[a[i]];
	}
	for(int i=1;i<=n;i++){
		qaq.push_back(Op(i,1,a[i],1,i));
	}
	for(int i=1;i<=m;i++){
		int l,r,k;
		scanf("%d%d%d",&l,&r,&k);
		qaq.push_back(Op(l,r,k,2,n+i));
	}
	solve(0,qaq.size()-1,0,N);
	for(int i=1;i<=n;i++){
		printf("%d\n",b[ans[n+i]]);
	}
	return 0;
}
```

</fold-block>

<span class="cf-black-red">Siyuan</span>大佬:“还是没我主席树$O\left( (n+m)\log c\right)$快！”

$\text{emm...}$

## 再来几个问题

> 离线求区间第$k$小，区间长为$n$，操作数为$m$，数字最大为$c$。
>
> 操作有查询区间第$k$小和单点修改。

单点修改拆为一个删数操作和一个加数操作，注意将$q$分为$q_1$和$q_2$时要保证操作的相对顺序。复杂度不变。

<span class="cf-black-red">Siyuan</span>大佬:“树状数组套主席树$O\left( (n+m)\log n\log c\right)$可做！”

----

> 离线求区间第$k$小，区间长为$n$，操作数为$m$，数字最大为$c$。
> 
> 每个位置都是一个`vector<int>`。
> 
> 操作有查询区间(所有`vector`里的数)第$k$小和区间`push_back`。

树状数组换成线段树，还是维护区间$\le mid$的数的个数。

吃瓜群众：“你怎么连着弄了三道区间第$k$小？”

----

[SP10264 METEORS](https://www.luogu.org/problemnew/show/SP10264)

> **Byteotian Interstellar Union**有$n$个成员国。现在它发现了一颗新的星球，这颗星球的轨道被分为$m$份（第$m$份和第$1$份相邻），第$i$份上有第$a_i$个国家的太空站。 这个星球经常会下陨石雨。**BIU**已经预测了接下来$k$场陨石雨的情况。 **BIU**的第$i$个成员国希望能够收集$p_i$单位的陨石样本。你的任务是判断对于每个国家，它需要在第几次陨石雨之后，才能收集足够的陨石。

~~洛谷[双倍经验](https://www.luogu.org/problemnew/show/P3527)，一紫一黑！~~

整体二分套路题，相信到这里你一定能做出来了。（逃