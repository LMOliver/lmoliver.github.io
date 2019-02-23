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