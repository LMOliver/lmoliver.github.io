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
	document.title=(title?(title+' - '):'')+'LMOliver\'s Blog';
}
function getBlogHref(){
	var c=window.location.hash;
	return c.indexOf('#!')===0?c.slice(2):c;
}
function updateHref(){
	var href=getBlogHref();
	this.context='<p>Loading...</p>';
	makeTitle('Loading...');
	loadInfo(href).then(result=>{
		makeTitle(result.data.title);
		this.context=renderMetadata(result.data);
		return loadContext(href);
	}).then(result=>{
		this.context+=renderMarkdown(result.data);
	}).catch(reason=>{
		makeTitle('Error!');
		console.log(href,reason);
		this.context=typeof reason==='string'?`
			<h1>Error!</h1>
			<p>${reason}</p>
			<a href="javascript:window.history.back()">back</a>
		`:`
			<h1>Error!</h1>
			<p>${JSON.stringify(reason)}</p>
			<a href="javascript:window.history.back()">back</a>
		`;
	});
}
var app = new Vue({
	el: '#app',
	data:{
		context:'',
	},
	mounted(){
		window.onhashchange=()=>updateHref.call(this);
		updateHref.call(this);
		// const gitalk = new Gitalk({
		// 	clientID: '2404bbe3ef6f6fe0b9de',
		// 	clientSecret: '85cc0b2fe72e057ab1757a2fb83c14142c1e7421',
		// 	repo: 'lmoliver.github.io',
		// 	owner: 'LMOliver',
		// 	admin: ['LMOliver'],
		// 	id: 'blog-'+getBlogHref(),      // Ensure uniqueness and length less than 50
		// 	distractionFreeMode: false  // Facebook-like distraction free mode
		// });
		// gitalk.render('gitalk-container');
	},
});