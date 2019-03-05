const W=12,H=12;

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

Vue.component('construction-main',{
	template:`
		<div>
			<div>
				<h1 style="margin:0;display:inline-block">Construction</h1>
				<span @click="console.log('QAQ');">score:{{score()}}</span>
			</div>
			<table>
				<tr v-for="x in W">
					<td v-for="y in H" @click="build(x-1,y-1);">
						<grid-block :lv="gameMap[x-1][y-1]" :tipped="canBuild(x-1,y-1,choiceLv)">
						</grid-block>
					</td>
				</tr>
			</table>
			<br>
			<table>
				<tr>
					<td v-for="i in 20" @click="toggle(i-1);" v-if="canUnlock(i-1)">
						<grid-block :lv="i-1" :tipped="choiceLv==i-1">
						</grid-block>
					</td>
				</tr>
			</table>
			<br>
			<button :disabled="curVer==0" @click="undo()">Undo</button>
			<button :disabled="curVer==operations.length" @click="redo()">Redo</button>
			<button @click="impor_(IEstr)">Import</button>
			<button @click="IEstr=expor_()">Export</button>
			<input v-model="IEstr"></input>
			<button @click="clear()" style="color:red;">Clear</button>
		</div>`,
	methods:{
		canBuild(x,y,lv){
			if(lv<0)return false;
			if(typeof this.buildMap[x][y][lv]!=='undefined'){
				return this.buildMap[x][y][lv];
			}
			if(lv<this.gameMap[x][y])return this.buildMap[x][y][lv]=true;
			if(lv==this.gameMap[x][y])return this.buildMap[x][y][lv]=false;
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
				if(!found[i])return this.buildMap[x][y][lv]=false;
			}
			this.unlockLv=Math.max(this.unlockLv,lv);
			return this.buildMap[x][y][lv]=true;
		},
		canUnlock(lv){
			if(this.unlockLv+1!=lv)return this.unlockLv>=lv;
			for(var i=0;i<this.H;i++){
				for(var j=0;j<this.W;j++){
					if(this.canBuild(i,j,lv)){
						this.unlockLv=lv;
						this.store();
						return true;
					}
				}
			}
			return false;
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
		toggle(x){
			if(this.choiceLv==x)this.choiceLv=-1;
			else this.choiceLv=x;
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
		impor_(str){
			const padding='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';
			try{
				[
					this.W,
					this.H,
					this.gameMap,
					this.buildMap,
					this.operations,
					this.curVer,
					this.choiceLv
				]=JSON.parse(
					str
						.slice(padding.length,-padding.length)
						.split('')
						.map(ch=>String.fromCharCode(33+126-ch.charCodeAt(0)))
						.join('')
				);
			}catch(e){
				alert('This save is broken.');
			}
			this.store();
		},
		expor_(){
			const padding='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';
			return padding
				+JSON.stringify([
					this.W,
					this.H,
					this.gameMap,
					this.buildMap,
					this.operations,
					this.curVer,
					this.choiceLv,
					this.unlockLv,
				])
					.split('')
					.map(ch=>String.fromCharCode(33+126-ch.charCodeAt(0)))
					.join('')
				+padding;
		},
		store(){
			localStorage.setItem('save',this.expor_());
			this.IEstr='';
		},
		clear(){
			if(confirm(`Do you want to CLEAR YOUR SAVE?`)){
				[
					this.W,
					this.H,
					this.gameMap,
					this.buildMap,
					this.operations,
					this.curVer,
					this.choiceLv,
					this.unlockLv,
				]=[
					W,
					H,
					Array(H).fill(0).map(()=>Array(W).fill(0)),
					Array(H).fill(0).map(()=>Array(W).fill(0).map(()=>({}))),
					[],
					0,
					-1,
					1,
					1,
				];
			}
			
		},
	},
	data(){
		return {
			W,
			H,
			gameMap:Array(H).fill(0).map(()=>Array(W).fill(0)),
			buildMap:Array(H).fill(0).map(()=>Array(W).fill(0).map(()=>({}))),
			operations:[],
			curVer:0,
			choiceLv:-1,
			unlockLv:1,
			IEstr:'',
		}
	},
	created(){
		var s=localStorage.getItem('save');
		if(s)this.impor_(s);
		window.onkeydown = (e)=>{
			// console.log(e);
			var v1='`1234567890-='.indexOf(e.key);
			if(e.key==='ArrowLeft'){
				v1=this.choiceLv-1;
			}else if(e.key==='ArrowRight'){
				v1=this.choiceLv+1;
			}
			if(v1!==-1&&this.canUnlock(v1)){
				this.choiceLv=v1;
			}
        }
	},
})

var app=new Vue({
	el: '#app',
})
