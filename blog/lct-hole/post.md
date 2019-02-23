有没有大佬帮我查查错啊QAQ

[洛谷模板题](https://www.luogu.org/problemnew/show/P3690)

```cpp
#include<bits/stdc++.h>
using namespace std;
#define OK (printf("%s %d OK\n",__FUNCTION__,__LINE__))
const int N=300300;
struct Node{
    typedef Node *np;
    int val,size,x;
	bool rev;
    np ch[2],fa;
    Node(int _val=0){
        val=_val;
		x=val;
        size=1;
        fa=ch[0]=ch[1]=NULL;
		rev=false;
	}
#define sz(p) ((p)?(p)->size:0) 
	inline void pd(){
		if(rev){
			if(ch[0])ch[0]->mk();
			if(ch[1])ch[1]->mk();
			rev=false;
		}
	}
	inline bool isr(){
		return !fa||fa->ch[0]==this||fa->ch[1]==this;
	}
	inline void mk(){
		rev^=1;
		swap(ch[0],ch[1]);
	}
#define X(p) ((p)?(p)->x:0)
    inline void upd(){
		size=sz(ch[0])+1+sz(ch[1]);
		x=X(ch[0])^val^X(ch[1]);
    }
	inline int id(){
		return fa&&fa->ch[0]==this?0:1;
	}
	inline void rot(){
		np gfa=fa->fa;
		int d=id(),gd=fa->id();
		np ms=ch[1^d];
		if(!fa->isr())gfa->ch[gd]=this;
		ch[1^d]=fa;
		fa->fa=this;
		fa->ch[d]=ms;
		if(ms)ms->fa=fa;
		// OK;
		fa->upd();
		fa=gfa;
		upd();
	}
	inline void splay(){
		static stack<np> qaq;
		for(np x=this;!x->isr();x=x->fa)qaq.push(x);
		while(!qaq.empty()){
			qaq.top()->pd();
			qaq.pop();
		}
		while(!isr()){
			OK;
			if(fa->fa)(fa->id()==id()?fa:this)->rot();
			rot();
		}
		OK;
	}
	np lim(int id){
		pd();
		return ch[id]?ch[id]->lim(id):this;
	}
	void access(){
		for(np x=this,y=NULL;x;x=x->fa){
			x->splay();
			OK;
			x->ch[1]=y;
			x->upd();
			y=x;
		}
	}
	void mkroot(){
		access();
		OK;
		splay();
		OK;
		mk();
	}
	np findroot(){
		access();
		splay();
		np ans=lim(0);
		ans->splay();
		return lim(0);
	}
	void split(np y){
		mkroot();
		y->access();
		y->splay();
	}
	bool link(np y){
		mkroot();
		if(y->findroot()!=this)return y->splay(),fa=y,true;
		else return false;
	}
	bool cut(np y){
		split(y);
		splay();
		return ch[1]==y&&!y->ch[0]?(ch[1]=NULL,upd(),true):false;
	}
};
typedef Node *np;
Node a[N];
void db(np x){
	if(x){
		x->pd();
		db(x->ch[0]);
// #define CD(e) #e"="<<(x->e)<<" "
		printf("%d ",x->val);
		// cerr<<x<<" "<<CD(val)<<CD(fa)<<CD(ch[0])<<CD(ch[1])<<CD(rev)<<endl;
		db(x->ch[1]);
	}
}
int main(){
	int n,m;
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++){
		int x;
		scanf("%d",&x);
		a[i]=Node(x);
	}
	while(m--){
		int op,x,y;
		scanf("%d%d%d",&op,&x,&y);
		if(op==0){
			a[x].split(&a[y]);
			printf("%d\n",a[y].x);
		}else if(op==1){
			a[x].link(&a[y]);
		}else if(op==2){
			a[x].cut(&a[y]);
		}else if(op==3){
			a[x].splay();
			a[x].val=y;
			a[x].upd();
		}else cerr<<"QAQ?"<<endl;
	}
	return 0;
}
```
