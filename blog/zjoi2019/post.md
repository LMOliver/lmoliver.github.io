# R1

## Day -1

- 上午

  > 我们默认你有如下基础:……(多项式全家桶)……

  $[\text{\color{grey}{LMOliver}\color{black}{已掉线}}]$
  
- 下午
  
  <span class="cf-black-red">kcz</span>的杂题选讲~~，还是听不懂~~。
  
  (窝太菜了，因此就没有什么可以说的东西QAQ)
  
  QQ 裙里出现了刷屏……

## Day 0

- 上午

  不同阶莫队好妙啊~

  大于$k$的与小于等于$k$的直接合并？QAQ

  然后看了一下讲义预览。

  > Warning:"水题"与"Ynoi"互斥
  
  果然后面还是掉线了。

  中途被大佬安利了**雀魂**。

- 下午
  
  ~~还是想听模拟退火和遗传算法~~
  
  $1k$**行**的期望$O(n+m)$最小生成树算法！

看来我爆零预定了。

## Day 1

### T1

[110.png]

对麻将的热情消失殆尽。(雀魂玩家$-1$)

记忆化搜索似乎跑得飞快，看上去难道可以过$n=13$？


### T2

每次操作可以视为以$\frac{1}{2}$概率执行，
考虑维护每个点有$\text{Tag}$的概率。

发现一个点有$\text{Tag}$，要么是直接被标记的，要么是从祖先传下来的。
所以要维护每个点自己是$\text{Tag}$的概率和祖先中有$\text{Tag}$的概率。

然后直接处理标记下传，注意一个点被直接标记时会更新所有子孙祖先有$\text{Tag}$的概率，要打标记。

然后陷入艰苦的调试。

然后发现做法假了。

祖先中有$\text{Tag}$的概率 $\rightarrow$ 自己没$\text{Tag}$且祖先中有$\text{Tag}$的概率。

继续调试。

过大样例了，打上文件操作，去看**T3**。

### T3

$\text{DP}$ing……

只剩下半个小时了，脑子里一团浆糊，最后一分钟打完$10$分暴力。

## Day 2

Day 2 = Day 1 的后一天（逃

知乎：如何评价 XK 刷屏？

<span class="cf-black-red">Siyuan</span> 制作了一张~P图~语录……

这时 <span class="cf-black-red">Siyuan</span> 在裙里带窝节奏！ QAQ

怎么办？<span class="cf-black-red">Siyuan</span> 比我强不知多少，轻松吊打我，~~连QQ都上不去的~~我怎么能刷屏或反带她节奏呢？

窝只能默默[膜拜<span class="cf-black-red">Siyuan</span>](https://lmoliver.github.io/mosiyuan/index.html)……

# R2

## Day -2

  在机房看 <span class="cf-black-red">Siyuan</span> 给我的《幼儿园数论》，可惜还是没能看懂莫比乌斯反演。

## Day -1

- 上午

  zzy 的“难度略高于提高组”的边分治、点分治和全局平衡二叉树，然而模板题对我而言全是不可做题。
  
  ~~计算鸭好评！~~
  
- 下午

  神题选讲，根本不会！
  
  原来他们眼中的“水题”和我们眼中的“水题”差距这么大啊……
  
  我感觉 R2 每题连暴力分我都会拿不到。要爆零了 QAQ

### 总结

技不如人，甘拜下风。

还能说点什么呢？放几位神仙的游记，你就知道窝有多菜了。

- [Siyuan](https://orzsiyuan.com/archives/Summary/ZJOI-2019)

- [zhouzhendong](https://www.cnblogs.com/zhouzhendong/p/ZJOI2019Day1.html)

- [Trimsteanima](https://www.cnblogs.com/wjnclln/p/10610759.html)

- [Stepsys](https://www.cnblogs.com/stepsys/p/10596863.html)

- [realSpongeBob](https://www.cnblogs.com/realSpongeBob/p/10597042.html)
