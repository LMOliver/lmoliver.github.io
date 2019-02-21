Vue.component('header-title',{
	template:'<a href="#"><h1 :style="style"><slot></slot></h1></a>',
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
	template:'<div :style="style"><slot></slot><div>',
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
	template:'<div :style="style" v-html="context"><div>',
	props:['href'],
	data:function(){
		return {
			style:{
				width:'80%',
				float:'left',
			},
			context:'',
		};
	},
	watch:{
		href(href){
			this.context='<p>Loading...</p>';
			console.log(href);
			axios.get(href?`./${href}/post.md`:'./index.md')
				.then(function(result){
					this.context=marked(result);
				})
				.catch(function(reason){
					this.context=`<h1>GG!</h1><p>reason:${reason}</p>`;
				});
			console.log(`href => ${href}`);
		}
	}
});
var data={
	blogHref:null,
};
function getBlogHref(){
	var c=window.location.hash;
	return c[0]==='#'?c.slice(1):c;
}
window.onhashchange=function(){
	data.blogHref=getBlogHref();
}
var app = new Vue({
	el: '#app',
	data,
});
data.blogHref=getBlogHref();