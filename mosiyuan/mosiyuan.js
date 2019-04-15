
const C=126-33+1;
const ENCODE_P={33:125,34:84,35:44,36:102,37:57,38:68,39:50,40:69,41:59,42:83,43:100,44:72,45:116,46:35,47:108,48:89,49:92,50:51,51:65,52:73,53:124,54:119,55:90,56:45,57:47,58:75,59:60,60:95,61:96,62:91,63:63,64:111,65:46,66:101,67:36,68:120,69:104,70:97,71:42,72:55,73:99,74:113,75:53,76:112,77:122,78:114,79:106,80:33,81:79,82:74,83:121,84:61,85:85,86:76,87:49,88:93,89:82,90:40,91:117,92:105,93:62,94:94,95:39,96:78,97:86,98:109,99:41,100:66,101:70,102:48,103:58,104:88,105:103,106:64,107:115,108:80,109:81,110:43,111:123,112:67,113:56,114:107,115:110,116:52,117:118,118:77,119:126,120:87,121:98,122:34,123:71,124:38,125:37,126:54,};
const DECODE_P={125:33,84:34,44:35,102:36,57:37,68:38,50:39,69:40,59:41,83:42,100:43,72:44,116:45,35:46,108:47,89:48,92:49,51:50,65:51,73:52,124:53,119:54,90:55,45:56,47:57,75:58,60:59,95:60,96:61,91:62,63:63,111:64,46:65,101:66,36:67,120:68,104:69,97:70,42:71,55:72,99:73,113:74,53:75,112:76,122:77,114:78,106:79,33:80,79:81,74:82,121:83,61:84,85:85,76:86,49:87,93:88,82:89,40:90,117:91,105:92,62:93,94:94,39:95,78:96,86:97,109:98,41:99,66:100,70:101,48:102,58:103,88:104,103:105,64:106,115:107,80:108,81:109,43:110,123:111,67:112,56:113,107:114,110:115,52:116,118:117,77:118,126:119,87:120,98:121,34:122,71:123,38:124,37:125,54:126,};
function encodeArr(arr){
	function encodeChar(x){
		return String.fromCharCode(ENCODE_P[x+33]);
	}
	return arr.map((x,i)=>encodeChar((x+Number(i)*(C-21))%C)).join('');
}
function decodeArr(str){
	function decodeChar(ch){
		return DECODE_P[ch.charCodeAt(0)]-33;
	}
	return str.split('').map((ch,i)=>(decodeChar(ch)+Number(i)*21)%C);
}
function encode(x){
	var arr=decodeArr(JSON.stringify(x));
	var l=arr.length;
	for(let i=l-1;i>0;i--){
		arr[i]=(arr[i]-arr[i-1]+C)%C;
	}
	return this.PADDING
		+encodeArr(arr)
		+this.PADDING;
}
function decode(x){
	var arr=decodeArr(x.slice(this.PADDING.length,-this.PADDING.length));
	var l=arr.length;
	for(let i=1;i<l;i++){
		arr[i]=(arr[i]+arr[i-1])%C;
	}
	return JSON.parse(encodeArr(arr));
}
function pn(num){
	const EXP_BASE=10;
	const heads=['','U','D','T','q','Q','s','S','O','N'];
	const tails=['','Dc','Vi','Tg','qg','Qg','sg','Sg','Og','Ng'];
	if(typeof num!=='number')return String(num);
	if(!Number.isFinite(num))return num.toString();
	var [val,exp]=num.toExponential(2).split('e').map(parseFloat);
	if(exp<6){
		if(Number.isSafeInteger(num))return num.toString();
		else if(exp<-4)return num.toExponential(3);
		else if(exp<-2)return num.toPrecision(2);
		else return num.toFixed(2);
	}
	val*=Math.pow(10,exp%3);
	var elv=Math.floor(exp/3)-1;
	var suf;
	if(elv<=2){
		suf=['K','M','B'][elv];
	}else if(elv>=EXP_BASE*EXP_BASE){
		return num.toExponential(2);
	}else{
		suf=(heads[elv%EXP_BASE]+tails[Math.floor(elv/EXP_BASE)]).slice(0,2);
	}
	return `${val.toPrecision(3)}${suf}`;
}

const RESOURCES={
	moValue:{
		name:'膜拜次数',
		format:'您已膜拜VALUE次',
	},
	advancedMoLevel:{
		name:'真诚膜拜等级',
		format:'真诚膜拜Lv.VALUE',
	},
	moer:{
		name:'信徒',
		format:'信徒*VALUE',
	},
	church:{
		name:'教堂',
		format:'教堂*VALUE',
	},
	XY:{
		name:'信仰',
		format:'信仰:VALUE',
	},
	book:{
		name:'经书',
		format:'经书*VALUE',
	},
	temple:{
		name:'遗迹',
		format:'已探索VALUE个遗迹',
	},
	hugeStone:{
		name:'巨石',
		format:'巨石*VALUE',
	},
	crystal:{
		name:'水晶',
		format:'水晶*VALUE',
	},
	wisdomLevel:{
		name:'智慧',
		format:'智慧Lv.VALUE',
	},
	mysteryLevel:{
		name:'奥秘',
		format:'奥秘Lv.VALUE',
	},
	natureLevel:{
		name:'本质',
		format:'本质Lv.VALUE',
	},
	truthLevel:{
		name:'真理',
		format:'真理Lv.VALUE',
	},
	len:{
		name:'透镜',
		format:'透镜*VALUE',
	},
	gem:{
		name:'宝石',
		format:'宝石*VALUE',
	},
	magicStone:{
		name:'魔法石',
		format:'魔法石*VALUE',
	},
	altar:{
		name:'神坛',
		format:'神坛*VALUE',
	},
	theology:{
		name:'神学',
		format:'神学:VALUE',
	},
	magician:{
		name:'魔法师',
		format:'魔法师*VALUE',
	},
	magic:{
		name:'魔力',
		format:'魔力:VALUE',
	},
	scientist:{
		name:'科学家',
		format:'科学家*VALUE',
	},
	science:{
		name:'研究',
		format:'研究:VALUE',
	},
};

var gameData;

const ACTIONS={
	moSiyuan:{
		display:()=>true,
		disabled:()=>false,
		cost:()=>({}),
		effect(r){
			this.moValue+=r*this.moDelta;
		}
	},
};

function isResource(name){
	return name in RESOURCES;
}

!function(){
	var _=new Vue({
		el:'#app',
		methods:{
			moSiyuan(r=1){
				this.moCount+=r;
				this.moValue+=r*this.moDelta;
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
			buyXY(){
				this.XY+=this.XYEarn;
				this.moValue=0;
			},
			buyBook(){
				this.XY-=this.bookCost;
				this.books+=1;
			},
			sp(){
				this.books-=this.spCost;
				var s=1+this.natureLevel;
				while(Math.random()<4/5){
					s*=5/4*0.999;
				}
				this.moers+=Math.round(s);
			},
			exploreTemple(){
				this.XY-=this.exploreTempleCost;
				this.temple+=1;
			},
			pray(){
				this.moValue-=this.prayCost;
				this.crystal+=1;
			},
			wisdomUpgrade(){
				this.crystal-=this.wisdomUpgradeCost;
				this.wisdomLevel+=1;
			},
			mysteryUpgrade(){
				this.crystal-=this.mysteryUpgradeCost;
				this.mysteryLevel+=1;
			},
			natureUpgrade(){
				this.crystal-=this.natureUpgradeCost;
				this.natureLevel+=1;
			},
			makeLen(){
				this.len+=this.makeLenEarn;
				this.crystal=0;
			},
			makeGem(){
				this.gem+=this.makeGemEarn;
				this.crystal=0;
			},
			makeMagicStone(){
				this.magicStone+=this.makeMagicStoneEarn;
				this.crystal=0;
			},
			makeLen(){
				this.len+=this.makeLenEarn;
				this.crystal=0;
			},
			buyAltar(){
				this.gem-=this.altarCost;
				this.altar+=1;
			},
			buyMagician(){
				this.magicStone-=this.magicianCost;
				this.magician+=1;
			},
			buyScientist(){
				this.len-=this.scientistCost;
				this.scientist+=1;
			},
		},
		computed:{
			moSiyuanTag(){
				return this.books?(`(${pn(this.bookEffect)}点击/秒)`):'';
			},
			moDelta(){
				return (1+this.advancedMoLevel)*(1+this.moers)*(1+this.wisdomLevel);
			},
			moText(){
				return '膜拜Siyuan'+(this.moDelta>1?(pn(this.moDelta)+'次'):'');
			},

			advancedMoText(){
				return `真诚膜拜${this.advancedMoLevel>0?`Lv.${pn(this.advancedMoLevel)}`:''} [${pn(this.advancedMoCost)}次膜拜]`;
			},
			advancedMoCost(){
				return Math.floor(10*Math.pow(1+0.2/(this.churchs+1)+0.1/Math.sqrt(this.mysteryLevel+1),this.advancedMoLevel));
			},

			moerText(){
				return `信徒${this.moers>0?`*${pn(this.moers)}`:''} [${pn(this.moerCost)}次膜拜]`;
			},
			moerCost(){
				return Math.floor(100*Math.pow(1e3*Math.pow(1.6**(1/2.5),this.moers)/(1e3+this.XY*(1+this.natureLevel)),2.5));
			},

			churchText(){
				return `教堂${this.churchs>0?`*${pn(this.churchs)}`:''} [${pn(this.churchCost)}位信徒]`;
			},
			churchCost(){
				return Math.floor(5+Math.pow(this.churchs,1.2));
			},

			XYText(){
				return `转化信仰 (+${pn(this.XYEarn)}信仰)`;
			},
			XYEarn(){
				return this.moValue/2000*this.churchs*(1+this.wisdomLevel);
			},

			spText(){
				return `传教 [${pn(this.spCost)}经书]`;
			},
			spCost(){
				return Math.sqrt(Math.max(this.moers,10))+Math.ceil(Math.pow(Math.max(this.moers-this.advancedMoLevel/3,0),1.12))-1;
			},

			bookText(){
				return `经书${this.books>0?`*${pn(this.books)}`:''} [${pn(this.bookCost)}信仰]`;
			},
			bookCost(){
				return 100*Math.pow(1.15,this.books);
			},
			bookEffect(){
				return Math.floor(this.books*1.2*Math.pow(1+this.mysteryLevel,1.5));
			},

			exploreTempleText(){
				return `探索遗迹 [${pn(this.exploreTempleCost)}信仰]`;
			},
			exploreTempleCost(){
				return Math.pow(2,Math.pow(1.8,this.temple))*5e6;
			},

			prayCost(){
				return Math.pow(1.6,this.crystal/this.temple)*1e10/Math.pow(this.XY,1/3);
			},

			wisdomUpgradeCost(){
				return Math.ceil(Math.pow(this.wisdomLevel+1.5,2)/(1+this.altar/3));
			},
			mysteryUpgradeCost(){
				return Math.ceil(Math.pow(this.mysteryLevel+4.5,3)/this.wisdomLevel/(1+this.magician/3));
			},
			natureUpgradeCost(){
				return Math.ceil(Math.pow(this.natureLevel+4.5,3)/this.mysteryLevel/(1+this.scientist/3));
			},

			makeGemEarn(){
				return Math.max(0,Math.floor(this.crystal/3*(this.wisdomLevel/6)-this.gem*0.6));
			},
			makeMagicStoneEarn(){
				return Math.max(0,Math.floor(this.crystal/3*(this.mysteryLevel/6)-this.magicStone*0.6));
			},
			makeLenEarn(){
				return Math.max(0,Math.floor(this.crystal/3*(this.natureLevel/6)-this.len*0.6));
			},

			altarCost(){
				return 16*Math.pow(1.5,this.altar);
			},
			theologyPerSec(){
				return Math.max(0,Math.sqrt(this.moDelta*this.gem)-this.theology/this.altar)/3e4;
			},
			magicianCost(){
				return 16*Math.pow(1.5,this.magician);
			},
			magicCostPerSec(){
				return Math.max(0.01,Math.sqrt(this.magician)/1e2*this.magicStone);
			},
			magicRate(){
				return 0.9;
			},
			scientistCost(){
				return 16*Math.pow(1.5,this.scientist);
			},
			sciencePerSec(){
				return Math.max(0,Math.sqrt(this.len*this.scientist)/2);
			},
			scienceLimit(){
				return 50*Math.pow(this.scientist,2);
			},
		},
		data:function(){
			this.PADDING='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';
			var save=localStorage.getItem('game-mosiyuan-save');
			if(!save){
				save={
					moCount:0,
					moValue:0,
					advancedMoLevel:0,
					moers:0,
					churchs:0,
					books:0,
					XY:0,
					temple:0,
					hugeStone:0,
					crystal:0,
					wisdomLevel:0,
					mysteryLevel:0,
					natureLevel:0,
					truthLevel:0,
					len:0,
					gem:0,
					magicStone:0,
					altar:0,
					theology:0,
					magician:0,
					magic:0,
					scientist:0,
					science:0,
				};
			}else{
				save=decode.call(this,save);
			}
			save.PADDING='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';
			return save;
		},
		created(){
			for(var resName in RESOURCES){
				if(!this[resName]){
					this[resName]=0;
				}
			}
		},
		mounted(){
			for(var resName in RESOURCES){
				if(!this[resName]){
					this[resName]=0;
				}
			}
			setInterval(()=>{
				localStorage.setItem('game-mosiyuan-save',encode.call(this,{
					moCount:this.moCount,
					moValue:this.moValue,
					advancedMoLevel:this.advancedMoLevel,
					moers:this.moers,
					churchs:this.churchs,
					books:this.books,
					XY:this.XY,
					temple:this.temple,
					hugeStone:this.hugeStone,
					crystal:this.crystal,
					wisdomLevel:this.wisdomLevel,
					mysteryLevel:this.mysteryLevel,
					natureLevel:this.natureLevel,
					truthLevel:this.truthLevel,
					PADDING:this.PADDING,
					len:this.len,
					gem:this.gem,
					magicStone:this.magicStone,
					altar:this.altar,
					theology:this.theology,
					magician:this.magician,
					magic:this.magic,
					scientist:this.scientist,
					science:this.science,
				}));
			});
			var now=(new Date()).getTime();
			var loop=()=>{
				var nt=(new Date()).getTime();
				var s=(nt-now)/1000;
				for(let _=1;_<=this.bookEffect;_++){
					this.moSiyuan(s);
				}
				
				this.theology+=s*this.theologyPerSec;
				var msc=Math.min(this.magicStone,s*this.magicCostPerSec);
				this.magicStone-=msc;
				this.magic+=msc*this.magicRate;
				var sci=this.science;
				sci+=s*this.sciencePerSec;
				sci=Math.min(sci,this.scienceLimit);
				this.science=sci;

				now=nt;
			};
			setInterval(loop);
		},
	});
	window._=_;
}();