var app=new Vue({
	el:'#app',
	computed:{
		data(){
			try{
				return JSON.parse(this.metadata);
			}catch(e){
				return {};
			}
		},
		storage(){
			return JSON.stringify({
				metadata:this.metadata,
				md:this.md,
			});
		},
	},
	watch:{
		metadata(){
			this.save();
		},
		md(){
			this.save();
		},
	},
	methods:{
		save(){
			localStorage.setItem('blog-save',this.storage);
		},
		load(){
			var s=localStorage.getItem('blog-save');
			if(s){
				({
					metadata:this.metadata='',
					md:this.md='',
				}=JSON.parse(s));
			}
		},
	},
	data:{
		metadata:'',
		md:'',
	},
	mounted(){
		this.load();
	},
})