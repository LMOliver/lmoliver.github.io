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

Vue.component('demo-button',{
	template:`
		<div style="display:inline;">
			<button @click="moZZD" style="color:red">{{moText}}</button>
			<span>{{moValueText}}</span>
			<div>
				<button @click="buyAdvancedMo" v-if="moCount>=10"
				:disabled="moValue<advancedMoCost">{{advancedMoText}}</button>
			</div>
			<div>
				<button @click="buyMoer" v-if="advancedMoLevel>=10"
				:disabled="moValue<moerCost">{{moerText}}</button>
			</div>
			<div>
				<button @click="buyChurch" v-if="advancedMoLevel>=20"
				:disabled="moers<churchCost">{{churchText}}</button>
			</div>
		</div>`,
	methods:{
		moZZD(){
			this.moCount+=1;
			this.moValue+=this.moDelta;
		},
		buyAdvancedMo(){
			this.moValue-=this.advancedMoCost;
			this.advancedMoLevel+=1;
		},
		buyMoer(){
			this.moValue-=this.moerCost;
			this.moers+=1;
		},
		buyChurch(){
			this.moers-=this.churchCost;
			this.churchs+=1;
		},
	},
	computed:{
		moDelta(){
			return (1+this.advancedMoLevel)*(1+this.moers);
		},
		moText(){
			return '膜拜ZZD'+(this.moDelta>1?(this.moDelta+'次'):'');
		},
		moValueText(){
			return this.moValue>0?('您已膜拜'+this.moValue+'次'):'';
		},
		advancedMoText(){
			return `真诚膜拜${this.advancedMoLevel>0?`Lv.${this.advancedMoLevel}`:''} [${this.advancedMoCost}次膜拜]`;
		},
		advancedMoCost(){
			return Math.floor(10*Math.pow(1.3,this.advancedMoLevel)/Math.pow(4,this.churchs));
		},
		moerText(){
			return `信徒${this.moers>0?`*${this.moers}`:''} [${this.moerCost}次膜拜]`;
		},
		moerCost(){
			return Math.floor(100*Math.pow(1.8,this.moers));
		},
		churchText(){
			return `教堂${this.churchs>0?`*${this.churchs}`:''} [${this.churchCost}位信徒]`;
		},
		churchCost(){
			return Math.floor(5+Math.pow(this.churchs,1.2));
		},
	},
	data:function(){
		return {
			moCount:0,
			moValue:0,
			advancedMoLevel:0,
			moers:0,
			churchs:0,
		};
	},
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