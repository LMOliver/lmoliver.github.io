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
				width:'10%',
				float:this.pos,
			},
		};
	},
});

Vue.component('blog-context',{
	template:'<article :style="style"><div></div></article>',
	props:['href'],
	data:function(){
		return {
			style:{
				width:'70%',
				position:'relative',
				left:'15%',
				border:'2px solid black',
				'border-radius':'5px',
				padding:'10px',
			},
			context:'',
			vue:null,
		};
	},
	watch:{
		href(href){
			this.context='<p>Loading...</p>';
			var vm=this;
			axios({
				method:'get',
				url:href?`./${href}/post.md`:'./index.md',
				responseType:'text',
			})
			.then(function(result){
				vm.context=marked(result.data);
			})
			.catch(function(...reason){
				vm.context=`<h1>GG!</h1><p>${reason}</p><a href="#!">back</a>`;
			});
			console.log(`href => ${href}`);
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
	}
});

var app = new Vue({
	el: '#app',
	data:{
		blogHref:null,
	},
});
function getBlogHref(){
	var c=window.location.hash;
	return c.indexOf('#!')===0?c.slice(2):c;
}
window.onhashchange=function(){
	app.blogHref=getBlogHref();
}
app.blogHref=getBlogHref();