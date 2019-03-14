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
});

function loadInfo(href){
	return axios({
		method:'get',
		url:href?`./${href}/info.json`:'./index-info.json',
		responseType:'json',
	});
}

Vue.component('post-refence',{
	template:`
		<a :href="'#!'+href" :style="style" :class="classObj" v-if="!data.hidden">
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

Vue.component('blog-list',{
	template:`
		<div>
			<post-refence v-for="id in list" size="large" :href="id"></post-refence>
		</div>
	`,
	data(){
		return {
			list:[],
		};
	},
	mounted(){
		axios({
			method:'get',
			url:'https://api.github.com/repos/LMOliver/lmoliver.github.io/contents/blog?\
client_id=a5ff5dd0495db47c22ab\
&client_secret=da88951dfa058ac808f6032320cb0d7b01e1a936',
			responseType:'json',
		}).then(({data})=>{
			this.list=data
				.filter(f=>f.type==='dir')
				.map(d=>d.name);
		}).catch((reason)=>{
			console.error('blog-post',reason);
		})
	},
})

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
});

Vue.component('blog-context',{
	template:'<article :style="style" :class="classObj"><div></div></article>',
	props:['context'],
	data:function(){
		return {
			style:{
			},
			classObj:{
				contains:true,
			},
			vue:null,
		};
	},
	watch:{
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
});

Vue.component('comment-area',{
	props:['gittalkid'],
	template:`<div><div></div></div>`,
	methods:{
		updateId(){
			console.log(this.gittalkid);
			var el=this.$el;
			el.removeChild(el.children[0]);
			if(typeof this.gittalkid!=='undefined'){
				var gitalkEl=this.els[this.gittalkid];
				if(typeof gitalkEl==='undefined'){
					const gitalk = new Gitalk({
						clientID: '2404bbe3ef6f6fe0b9de',
						clientSecret: '85cc0b2fe72e057ab1757a2fb83c14142c1e7421',
						repo: 'lmoliver.github.io',
						owner: 'LMOliver',
						admin: ['LMOliver'],
						id: this.gittalkid,
						distractionFreeMode: false,
					});
					this.els[this.gittalkid]=document.createElement('div');
					gitalk.render(this.els[this.gittalkid]);
					gitalkEl=this.els[this.gittalkid];
				}
				el.appendChild(gitalkEl);
			}else{
				el.appendChild(document.createElement('div'));
			}
		},
	},
	watch:{
		gittalkid(){
			this.updateId();
		}
	},
	data(){
		return {
			els:{},
		};
	}
});

function renderMetadata(data){
	var {title='无标题',time='',description=''}=data;
	return `
		<div>
			<h1 style="display:inline">${title}</h1>
			<span>${time}</span>
		</div>
		<p><em>${description}</em></p>
		<hr>`
}

function renderMarkdown(md){
	return marked(
		md.replace(/\$.+?\$/g,
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
}