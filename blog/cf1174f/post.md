_CF 1174F 是 Div.2 F，而非 Div.1 F。_

## [题面](https://codeforces.com/problemset/problem/1174/F)

**这是一道交互题。**

给你一棵有 $n$（$2 \le n \le {2 \times 10^5}$）个点的树，点编号从 $1$ 开始，树根为 $1$ 号点。

树上有一个神秘点，编号为 $x$。你需要进行最多 $36$ 次询问，找到这个神秘点。

询问有两种：

- `d <a>`：询问点 $a$ 与点 $x$ 的距离（两点间最短路边数）。

- `s <a>`：询问在点 $1$ 到点 $x$ 的路径上，点 $a$ 的下一个点。**如果点 $a$ 不在这条路径上或者 $a=x$，你将立刻收到 `Wrong Answer` 的结果！**

最后，使用 `! <x>` 回答神秘点的编号。

----

## 题解

<fold-block>

首先发现 `d 1` 是好东西，它能让我们知道神秘点的深度。知道了神秘点的深度，就可以用 `d` 询问知道某个点与神秘点的 $\operatorname{LCA}$。

由于 `s` 只能在点 $1$ 到点 $x$ 的路径上使用，我们最好从点 $1$ 开始，顺着这条路径往下走。但是我们只能进行 $36 ≈ 2\log n$ 次询问，因此我们需要一个能在 $O(\log n)$ 次操作内走一条链的方法——**树链剖分**。

将原树树链剖分，如果每 $2$ 次询问能让我们过至少一条轻边，就可以完成本题。

注意到 `d <a>` 让我们走到 $\operatorname{LCA}(a,x)$，`s <a>` 让我们走到 $s$ 的某个孩子，如果当前所在的点为点 $h$，考虑所有可能的操作并分类：

- 直接 `s` 询问：我们花了 $1$ 次操作，走的有可能是重儿子，不一定能过轻边。

- `d` 询问点 $h$ 所在子树**外**的点：我们已经知道答案了，没有用处。

- `d` 询问点 $h$ 所在的重链**外**的点：如果找到的 $\operatorname{LCA}$ 在 $h$ 所在的重链上，就没有过轻边。

- `d` 询问点 $h$ 所在的重链**上**的点：看似和询问重链外的点一样，但是如果求得的 $\operatorname{LCA}$  在点 $h$ 所在的重链上且是询问点的祖先，那么下一次 `s` 询问一定能让我们走一条轻边！

所以，我们只需要每次 `d` 询问点 $h$ 所在重链的链底，如果发现点 $x$ 在重链上就直接作答，否则 `s` 询问 $\operatorname{LCA}$。此时，`s` 询问一定会走轻边，使 $h$ 所在子树大小减半。因此，我们用 $2 \log n+O(1)$ 次询问解决了问题。

```cpp
#include<bits/stdc++.h>
using namespace std;
int dis(int x){
	printf("d %d\n",x);
	fflush(stdout);
	int r;
	scanf("%d",&r);
	return r;
}
int nxt(int x){
	printf("s %d\n",x);
	fflush(stdout);
	int r;
	scanf("%d",&r);
	return r;
}
void answer(int x){
	printf("! %d\n",x);
	fflush(stdout);
	exit(0);
}
const int N=200200;
vector<int> es[N];
void ae(int u,int v){
	es[u].push_back(v);
}
#define Fs(x) for(vector<int>::iterator it=es[x].begin();it!=es[x].end();++it)
int sz[N];
bool h[N]={false};
int dep[N];
void dfs1(int x,int fa=-1){
	dep[x]=fa==-1?0:dep[fa]+1;
	sz[x]=1;
	int mx=-1;
	Fs(x){
		if(*it==fa)continue;
		dfs1(*it,x);
		if(mx==-1||sz[*it]>sz[mx])mx=*it;
		sz[x]+=sz[*it];
	}
	if(mx!=-1)h[mx]=true;
}
int bot[N];
int dfn[N];
int ord[N];
int dft=0;
void dfs2(int x,int fa=-1){
	dfn[x]=++dft;
	ord[dft]=x;
	bot[x]=x;
	Fs(x)if(*it!=fa&&h[*it]){
		dfs2(*it,x);
		bot[x]=bot[*it];
	}
	Fs(x)if(*it!=fa&&!h[*it])dfs2(*it,x);
}
int n;
int main(){
	scanf("%d",&n);
	for(int i=0;i<n-1;i++){
		int u,v;
		scanf("%d%d",&u,&v);
		ae(u,v);
		ae(v,u);
	}
	dfs1(1);
	dfs2(1);
	int adep=dis(1);
	for(int head=1;;){
		int qp=bot[head];
		if(qp==head){
			answer(head);
		}
		int d=dis(qp);
		int qd=dep[qp];
		if(adep+d==qd){
			answer(ord[dfn[head]+adep-dep[head]]);
		}
		else{
			int lcad=adep-(adep+d-qd)/2;
			head=nxt(ord[dfn[head]+lcad-dep[head]]);
		}
	}
	return 0;
}
```

[提交记录](https://codeforces.com/contest/1174/submission/58433150)

</fold-block>