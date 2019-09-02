function loadContext(href){
	return axios({
		method:'get',
		url:href?`./${href}/post.md`:'./index.md',
		responseType:'text',
	});
}
function makeTitle(title){
	document.title=(title?(title+' - '):'')+'LMOliver\'s Blog';
}
function getBlogHref(){
	var c=window.location.hash;
	return c.indexOf('#!')===0?c.slice(2):c;
}
function updateHref(){
	var href=getBlogHref();
	this.context='<p>Loading...</p>';
	this.commentId=undefined;
	makeTitle('Loading...');
	loadInfo(href).then(({data:{title,time,description,comment=true}})=>{
		makeTitle(title);
		this.commentId=comment?('blog-'+href):undefined;
		this.context=renderMetadata({title,time,description});
		return loadContext(href);
	}).then(({data})=>{
		this.context+=renderMarkdown(data);
	}).catch(reason=>{
		makeTitle('Error!');
		console.error('blog-context',href,reason);
		var c;
		if(typeof reason==='string'){
			c=`<h1>Error!</h1><p>${reason}</p>`;
		}else if(typeof reason.status!=='undefined'
			&&typeof reason.statusText!=='undefined'){
			c=`<h1>${reason.status} ${reason.statusText}</h1>`;
		}else{
			c=`<h1>Error!</h1><p>${JSON.stringify(reason)}</p>`;
		}
		this.context=c+'<a href="javascript:window.history.back()">back</a>';
	});
}
var app = new Vue({
	el: '#app',
	data:{
		context:'',
		commentId:undefined,
	},
	mounted(){
		window.onhashchange=()=>updateHref.call(this);
		updateHref.call(this);
	},
});