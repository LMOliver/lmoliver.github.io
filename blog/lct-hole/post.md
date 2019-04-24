**感谢 Siyuan 的帮助！终于AC了qwq**

在~~看上去长达数月的~~ Debug 后，我最终决定膜拜 <span class="cf-black-red">Siyuan</span> 。

具体操作：

1. 试图让她使用指针写`LCT`；

2. 在 Siyuan 秒掉模板题后要一份代码；

3. 对于`LCT`中的每个函数：

   1. 将此函数替换为 Siyuan 的代码;
   
   2. 提交，如果**AC**，`break`；
   
   3. 撤销操作。

在替换`splay`的时候**AC**了，寻找 BUG ，发现是判父亲是否为`splay`根直接用了`if(fa->fa)`……

[AC](https://www.luogu.org/recordnew/show/17432144)

----

[WA+TLE 30](https://www.luogu.org/recordnew/show/16694154)

有没有大佬帮我查查错啊QAQ

[洛谷模板题](https://www.luogu.org/problemnew/show/P3690)

<fold-block title="无法AC的LCT" initshow>

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

    inline void pd(){
        if(rev){
            if(ch[0])ch[0]->mk();
            if(ch[1])ch[1]->mk();
            rev=false;
        }
    }
    inline bool isr(){
        return !fa||(fa->ch[0]!=this&&fa->ch[1]!=this);
    }
    inline void mk(){
        rev^=1;
        swap(ch[0],ch[1]);
    }
#define sz(p) ((p)?(p)->size:0)
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
        for(np x=this;!x->isr();x=x->fa)qaq.push(x->fa);
		// OK;
        while(!qaq.empty()){
			// cerr<<"rel "<<qaq.top()<<endl;
            qaq.top()->pd();
            qaq.pop();
        }
		pd();
        while(!isr()){
            if(fa->fa)(fa->id()==id()?fa:this)->rot();
            rot();
        }
    }
    np lim(int id){
        pd();
        return ch[id]?ch[id]->lim(id):(splay(),this);
    }
    void access(){
        for(np x=this,y=NULL;x;x=x->fa){
            x->splay();
            x->ch[1]=y;
            x->upd();
            y=x;
        }
        splay();
    }
    void mkroot(){
        access();
        mk();
    }
    np findroot(){
        access();
        np ans=lim(0);
        return ans;
    }
    void split(np y){
        mkroot();
        y->access();
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
        // x->pd();
        db(x->ch[0]);
#define CD(e) #e"="<<(x->e)<<" "
        // printf("%d ",x->val);
        cerr<<x<<" "<<CD(val)<<CD(fa)<<CD(ch[0])<<CD(ch[1])<<CD(rev)<<CD(x)<<endl;
        db(x->ch[1]);
    }
}
int n,m;
void debug(){
	for(int i=1;i<=n;i++){
		if(a[i].isr()){
			cerr<<"Chain"<<endl;
			db(&a[i]);
		}
	}
}

int main(){
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++){
        int x;
        scanf("%d",&x);
        a[i]=Node(x);
    }
	// debug();
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
        }else{
			// DEBUG
			if(op==10){
				cerr<<(a[x].isr()?"Y":"N")<<endl;
			}else if(op==20){
				a[x].access();
			}else if(op==30){
				cerr<<a[x].findroot()<<endl;
			}else if(op==40){
				a[x].mkroot();
			}
		}
		// cerr<<endl;
		// debug();
    }
    return 0;
}
```

</fold-block>

<fold-block title="一组小样例(过了)">

```
3 11
0
4
7
1 1 2
3 1 1
1 2 3
3 3 3
3 2 2
0 1 3
1 1 3
2 2 3
0 2 1
2 2 3
0 3 3

```

</fold-block>
