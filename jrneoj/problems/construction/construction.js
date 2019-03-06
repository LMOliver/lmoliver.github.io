const W=12,H=12;

const MAXLEVEL=20; 

const COLORS=[
	{background:'#000000',color:'#ffffff'},
	{background:'#555555',color:'#ffffff'},
	{background:'#888888',color:'#ffffff'},
	{background:'#000088',color:'#ffffff'},
	{background:'#008800',color:'#ffffff'},
	{background:'#880000',color:'#ffffff'},
	{background:'#ffff00',color:'#000000'},
	{background:'#00ffff',color:'#000000'},
	{background:'orange',color:'#000000'},
	{background:'radial-gradient(circle,greenyellow,green)',color:'#000000'},
	{background:'radial-gradient(circle,skyblue,blue)',color:'#000000'},
	{background:'radial-gradient(circle,yellow,red)',color:'#000000'},
	{background:'linear-gradient(to bottom right,#000000,#0000ff,#ffffff)',color:'#ffffff'},
	{background:'linear-gradient(to bottom right,#000000,#00ff00,#ffffff)',color:'#000000'},
	{background:'linear-gradient(to bottom right,#000000,#ff0000,#ffffff)',color:'#000000'},
	{background:'radial-gradient(circle,blue,black)',color:'#ffffff'},
	{background:'radial-gradient(circle,purple,black)',color:'#ffffff'},
	{background:'radial-gradient(circle,red,black)',color:'#ffffff'},
	{background:'radial-gradient(circle,white,black)',color:'#000000'},
	{background:'radial-gradient(circle,black,white)',color:'#ffffff'},
	{background:'white',color:'#000000'},
];

const PADDING='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';

Vue.component('grid-block',{
	template:'<span :style="style" class="grid">{{lv}}</span>',
	props:['lv','tipped'],
	computed:{
		style(){
			return {
				...COLORS[Number(this.lv)],
				'text-decoration':this.tipped?'underline':'none',
			};
		},
	},
});

var app=new Vue({
	el: '#app',
	methods:{
		unlockLv(){
			if(this.unlockLvStore){
				return this.unlockLvStore;
			}
			var maxLevel=0;
			for(let i=0;i<H;i++){
				for(let j=0;j<W;j++){
					maxLevel=Math.max(maxLevel,this.gameMap[i][j]);
				}
			}
			for(let i=0;i<H;i++){
				for(let j=0;j<W;j++){
					if(this.canBuild(i,j,maxLevel+1)){
						return this.unlockLvStore=maxLevel+1;
					}
				}
			}
			return this.unlockLvStore=maxLevel;
		},
		isUnlocked(lv){
			return this.unlockLv()>=lv;
		},
		score(){
			var s=0;
			for(var i=0;i<this.H;i++){
				for(var j=0;j<this.W;j++){
					if(this.gameMap[i][j]>0){
						s+=Math.pow(2,this.gameMap[i][j]-1);
					}
				}
			}
			return s;
		},
		_canBuild(x,y,lv){
			if(lv<this.gameMap[x][y])return true;
			if(lv==this.gameMap[x][y])return false;
			var found={};
			for(d of [
				{x:1,y:0},
				{x:0,y:1},
				{x:-1,y:0},
				{x:0,y:-1},
			]){
				let tx=x+d.x,ty=y+d.y;
				if(tx<0||tx>=this.H||ty<0||ty>=this.W)continue;
				found[this.gameMap[tx][ty]]=true;
			}
			for(let i=Math.max(0,lv-4);i<=lv-1;i++){
				if(!found[i])return false;
			}
			return true;
		},
		canBuild(x,y,lv){
			if(lv<0)return false;
			if(!this.buildMap[x][y][lv]){
				this.buildMap[x][y]={};
				for(let i=0;i<MAXLEVEL;i++){
					this.buildMap[x][y][i]=this._canBuild(x,y,i);
				}
			}
			return this.buildMap[x][y][lv];
		},
		update(x,y){
			for(d of [
				{x:0,y:0},
				{x:1,y:0},
				{x:0,y:1},
				{x:-1,y:0},
				{x:0,y:-1},
			]){
				let tx=x+d.x,ty=y+d.y;
				if(tx<0||tx>=this.H||ty<0||ty>=this.W)continue;
				this.buildMap[tx][ty]={};
			}
			this.unlockLvStore=null;
		},
		build(x,y){
			if(!this.canBuild(x,y,this.choiceLv))return;
			if(this.curVer<this.operations.length){
				this.operations=this.operations.slice(0,this.curVer);
			}
			this.curVer++;
			this.operations.push({
				x,
				y,
				old:this.gameMap[x][y],
				new:this.choiceLv,
			});
			this.gameMap[x][y]=this.choiceLv;
			this.update(x,y);
			this.store();
		},
		toggle(lv){
			if(this.choiceLv==lv)this.choiceLv=-1;
			else this.choiceLv=lv;
		},
		undo(){
			var op=this.operations[--this.curVer];
			this.gameMap[op.x][op.y]=op.old;
			this.update(op.x,op.y);
			this.store();
		},
		redo(){
			var op=this.operations[this.curVer++];
			this.choiceLv=this.gameMap[op.x][op.y]=op.new;
			this.update(op.x,op.y);
			this.store();
		},
		encode(obj){
			return PADDING+JSON.stringify(obj)
					.split('')
					.map(ch=>String.fromCharCode(33+126-ch.charCodeAt(0)))
					.join('')
				+PADDING;
		},
		decode(str){
			return JSON.parse(
				str
					.slice(PADDING.length,-PADDING.length)	
					.split('')
					.map(ch=>String.fromCharCode(33+126-ch.charCodeAt(0)))
					.join('')
			);
		},
		impor_(str){
			try{
				var v=this.decode(str);
				if(typeof v.W==='undefined'
					||typeof v.H==='undefined'
					||typeof v.gameMap==='undefined'
					||typeof v.operations==='undefined'
					||typeof v.curVer==='undefined'
					||typeof v.choiceLv==='undefined'){
					throw new Error();
				}
				({
					W:this.W,
					H:this.H,
					gameMap:this.gameMap,
					operations:this.operations,
					curVer:this.curVer,
					choiceLv:this.choiceLv,
				}=v);
				this.buildMap=Array(H).fill(0).map(()=>Array(W).fill(0).map(()=>({})));
				this.choiceLv=-1;
				this.IEstr='';
				this.unlockLvStore=null;
				this.store();
			}catch(e){
				alert('代码无效，无法提交。');
			}
		},
		expor_(){
			return this.encode({
				W:this.W,
				H:this.H,
				gameMap:this.gameMap,
				operations:this.operations,
				curVer:this.curVer,
				choiceLv:this.choiceLv,
			});
		},
		store(){
			localStorage.setItem('game-save',this.expor_());
			this.IEstr='';
		},
		clear(){
			this.impor_(this.encode({
				W:W,
				H:H,
				gameMap:Array(H).fill(0).map(()=>Array(W).fill(0)),
				operations:[],
				curVer:0,
				choiceLv:-1,
			}));
		},
		getInitData(){
			return {
				W:W,
				H:H,
				gameMap:Array(H).fill(0).map(()=>Array(W).fill(0)),
				operations:[],
				curVer:0,
				choiceLv:-1,
			}
		}
	},
	data(){
		return {
			W,
			H,
			gameMap:Array(H).fill(0).map(()=>Array(W).fill(0)),
			operations:[],
			curVer:0,
			buildMap:Array(H).fill(0).map(()=>Array(W).fill(0).map(()=>({}))),
			choiceLv:-1,
			IEstr:'',
		}
	},
	created(){
		var s=localStorage.getItem('game-save');
		if(s)this.impor_(s);
		window.onkeydown = (e)=>{
			// console.log(e);
			var v1='`1234567890-='.indexOf(e.key);
			if(e.key==='ArrowLeft'){
				v1=this.choiceLv-1;
			}else if(e.key==='ArrowRight'){
				v1=this.choiceLv+1;
			}
			if(v1!==-1&&this.isUnlocked(v1)){
				this.choiceLv=v1;
			}
		}
	},
})