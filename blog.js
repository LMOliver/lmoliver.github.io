Vue.component('header-title',{
	template:'<a href="#!"><h1 :style="style"><slot></slot></h1></a>',
	data:function(){
		return {
			style:{
				display:'inline',
				color: 'dodgerblue',
				margin: 0,
			},
		}
	},
});

Vue.component('side-bar',{
	template:'<aside :style="style"><slot></slot></aside>',
	props:['pos'],
	data:function(){
		return {
			style:{
				width:'15%',
				margin:'0 1.5%',
				float:this.pos,
			},
		};
	},
});

Vue.component('side-block',{
	template:'<div :style="style" :class="classObj"><strong>{{title}}</strong><hr><slot></slot></div>',
	props:['title'],
	data:function(){
		return {
			style:{
				width:'calc(100% - 24px)',
			},
			classObj:{
				contains:true,
			},
		};
	},
});

function copyText(text){
	var temp = document.createElement('textarea');
	temp.value = text;
	document.body.appendChild(temp);
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
}

Vue.component('fold-block',{
	props:['title','initshow'],
	template:`
		<div :class="classObj" style="">
			<strong v-if="title" style="display:inline-block">{{title}}</strong>
			<button @click="show = !show" :style="btnStyle">{{show?'收起':'展开'}}</button>
			<button @click="copy()" :style="btnStyle">贺</button>
			<div v-show="show" ref="block"><slot></slot></div>
		</div>`,
	methods:{
		copy(){
			copyText(this.$refs.block.innerText);
		},
	},
	data:function(){
		return {
			classObj:{
				contains:true,
			},
			btnStyle:{
				'margin-left':'auto',
			},
			show:false,
		};
	},
	mounted(){
		if(!this.title)this.title="";
		if(typeof this['initshow']!=='undefined'){
			this.show=true;
		}
	},
})

Vue.component('post-refence',{
	template:`
		<a :href="'#!'+href" :style="style" :class="classObj">
			<template v-if="size==='small'">
				<span>{{data.title}}</span>
				<span>{{data.description}}</span>
			</template>
			<div v-else-if="size==='large'">
				<p>
					<h3 style="display:inline">{{data.title}}</h3>
					<span>{{data.time}}</span>
				</p>
				<p>
					<span>{{data.description}}</span>
				</p>
			</div>
			<div v-else>
				<span>{{data.title}}</span>
				<br>
				<span>{{data.description}}</span>
			</div>
		</a>`,
	props:['href','size'],
	data:function(){
		return {
			style:{
				display:({
					small:'inline',
					middle:'inline-block',
					large:'block',
				}[this.size]||'inline-block'),
			},
			data:{
				title:'Loading...',
				time:undefined,
				description:'正在加载QAQ',
			},
			classObj:{
				contains:true,
			},
		}
	},
	mounted(){
		loadInfo(this.href)
		.then(result=>{
			this.data=result.data;
		})
		.catch(reason=>{
			this.data={
				title:'Error!',
				time:undefined,
				description:reason,
			}
		})
	},
});

Vue.component('life-canvas',{
	template:'<canvas id="x" height="600" width="600"></canvas>',
	mounted(){
		const H=200;
		const W=200;
		const R=3;
		const MAX_VAL=10;
		var ctx=this.$el.getContext("2d");
		ctx.fillStyle='#000000';
		ctx.fillRect(0,0,W,H);
		function draw(x,y,color){
			// console.log(color);
			ctx.fillStyle=color;
			ctx.fillRect(y*R,x*R,R,R);
		}
		var life=Array(H).fill(0).map(()=>Array(W).fill(0));
		var last=Array(H).fill(0).map(()=>Array(W).fill(0).map(()=>[0,0,0]));
		function set(x,y,val){
			life[x][y]=val;
			var rp=val/MAX_VAL;
			last[x][y].shift();
			last[x][y].push(rp);
			var [r,g,b]=last[x][y];

			draw(x,y,'#'+
			[b,g,r].map(
				x=>Math.floor(x*255).toString(16).padStart(2,'0')
			).join(''));
		}
		function rand(n){
			return Math.floor(Math.random()*n);
		}
		function rndStep(){
			function loop(x,p){
				while(x<0)x+=p;
				while(x>=p)x-=p;
				return x;
			}
			var x=rand(H);
			var y=rand(W);
			var sum=0;
			var lf=life[x][y];
			for(let i=-1;i<=1;i++){
				for(let j=-1;j<=1;j++){
					if(i||j)sum+=life[loop(x+i,H)][loop(y+j,W)];
				}
			}
			var val=lf;
			if(sum<20||sum>=40)val=Math.max(lf-3,0);
			if(sum>=30&&sum<40)val=Math.min(lf+5,10);
			var ans=lf==val;
			set(x,y,val);
			return ans;
		}
		for(let i=0;i<H;i++){
			for(let j=0;j<W;j++){
				set(i,j,rand(MAX_VAL+1));
			}
		}
		setInterval(()=>{
			for(let _=0;_<1000;_++){
				while(!rndStep())
					;
			}
		});
	}
})

Vue.component('blog-context',{
	template:'<article :style="style" :class="classObj"><div></div></article>',
	props:['href'],
	data:function(){
		return {
			style:{
			},
			classObj:{
				contains:true,
			},
			context:'',
			vue:null,
		};
	},
	methods:{
		onHrefUpdate(href){
			this.context='<p>Loading...</p>';
			makeTitle('Loading...');
			console.log(`href => ${href}`);
			loadInfo(href)
			.then(result=>{
				var data=result.data;
				var {title=href,time='未知时间',description='没有描述'}=data;
				makeTitle(title);
				this.context=`
					<div>
						<h1 style="display:inline">${title}</h1>
						<span>${time}</span>
					</div>
					<p>${description}</p>`;
				console.log(title,time,description);
				return loadContext(href);
			})
			.then(result=>{
				this.context+=marked(result.data);
			})
			.catch(reason=>{
				makeTitle('Error!')
				this.context=`<h1>Error!</h1><p>${reason}</p><a href="#!">back</a>`;
			});
		}
	},
	watch:{
		href(href){
			console.log(this);
			this.onHrefUpdate(href);
		},
		context(text){
			var res=Vue.compile('<div>'+text+'</div>');
			if(this.vue)this.vue.$destroy();
			this.vue=new Vue({
				el:this.$el.children[0],
				render:res.render,
				staticRenderFns:res.staticRenderFns,
				parent:this,
			})
		},
	},
	mounted(){
		this.onHrefUpdate(this.href);
	},
});
function loadInfo(href){
	return axios({
		method:'get',
		url:href?`./${href}/info.json`:'./index-info.json',
		responseType:'json',
	});
}
function loadContext(href){
	return axios({
		method:'get',
		url:href?`./${href}/post.md`:'./index.md',
		responseType:'text',
	});
}
function makeTitle(title){
	document.title=(title?title+' - ':'')+'LMOliver\'s Blog';
}
function getBlogHref(){
	var c=window.location.hash;
	return c.indexOf('#!')===0?c.slice(2):c;
}
var app = new Vue({
	el: '#app',
	data:{
		blogHref:getBlogHref(),
	},
	mounted(){
		console.log('ok',getBlogHref());
		window.onhashchange=()=>{
			this.blogHref=getBlogHref();
		}
	},
});