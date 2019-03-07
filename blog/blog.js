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
	template:`
		<div>
			<input v-model.number="add" type="number">
			<input v-model.number="sub" type="number">
			<input v-model.number="speed" type="number">
			<button v-if="!started" @click="start()">Start</button>
			<canvas ref="canvas" :height="V" :width="V" style="border:1px solid gray;"></canvas>
		</div>`,
	computed:{
		R(){
			return this.V/this.S;
		},
	},
	methods:{
		limitNum(num){
			return Math.min(Math.max(num,0),this.MAX_VAL);
		},
		start(){
			this.started=true;
			var ctx=this.$refs.canvas.getContext("2d");
			ctx.fillStyle='#000000';
			ctx.fillRect(0,0,this.V,this.V);
			// var colors=Array(this.S).fill(0).map(()=>Array(this.S).fill('#000000'));
			const draw=(x,y,color)=>{
				// if(colors[x][y]===color)return;
				/*colors[x][y]=*/ctx.fillStyle=color;
				ctx.fillRect(y*this.R,x*this.R,this.R,this.R);
			}
			var life=Array(this.S).fill(0).map(()=>Array(this.S).fill(0));
			var last=Array(this.S).fill(0).map(()=>Array(this.S).fill(0).map(()=>[0,0,0]));
			const set=(x,y,val)=>{
				life[x][y]=val;
				var rp=val/this.MAX_VAL;
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
			const rndStep=()=>{
				function loop(x,p){
					while(x<0)x+=p;
					while(x>=p)x-=p;
					return x;
				}
				var x=rand(this.S);
				var y=rand(this.S);
				var sum=0;
				var lf=life[x][y];
				for(let i=-1;i<=1;i++){
					for(let j=-1;j<=1;j++){
						if(i||j)sum+=life[loop(x+i,this.S)][loop(y+j,this.S)];
					}
				}
				var val=lf;
				if(sum<20||sum>=40)val=this.limitNum(lf-this.sub);
				if(sum>=30&&sum<40)val=this.limitNum(lf+this.add);
				if(lf===val){
					if(val>this.MAX_VAL*0.5){
						val=Math.min(lf+1,this.MAX_VAL);
					}else{
						val=Math.max(lf-1,0);
					}
				}
				var ans=lf===val;
				set(x,y,val);
				return ans;
			}
			for(let i=0;i<this.S;i++){
				for(let j=0;j<this.S;j++){
					set(i,j,rand(this.MAX_VAL/1.5));
				}
			}
			setInterval(()=>{
				for(let _=0;_<this.speed;_++){
					while(!rndStep())
						;
				}
			});
		}
	},
	mounted(){
	},
	data:function(){
		return {
			S:300,
			V:600,
			speed:100,
			MAX_VAL:10,
			add:1,
			sub:1,
			started:false,
		};
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
			// console.log(`href => ${href}`);
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
				// console.log(title,time,description);
				return loadContext(href);
			})
			.then(result=>{
				this.context+=marked(
					result.data.replace(/\$.+?\$/g,
						s=>katex.renderToString(s.slice(1,-1),{
							throwOnError: false
						})
					),{
						highlight: function (code,type) {
							if(type==="")return code;
							return hljs.highlightAuto(code).value;
						}
					}
				);
			})
			.catch(reason=>{
				makeTitle('Error!');
				console.log(href,reason);
				this.context=`<h1>Error!</h1><p>${reason}</p><a href="javascript:window.history.back()">back</a>`;
			});
		}
	},
	watch:{
		href(href){
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
		// console.log('ok',getBlogHref());
		window.onhashchange=()=>{
			this.blogHref=getBlogHref();
		}
	},
});