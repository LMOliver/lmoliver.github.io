
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
	if(!Number.isFinite(num))return '???';
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
function pnr(num){
	const s=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
	if(typeof num!=='number')return String(num);
	if(!Number.isFinite(num))return num.toString();
	if(!Number.isSafeInteger(num)||num<0||num>=s.length)return pn(num);
	return s[num];
}

function dailyMessage(){
	const msgs=[
		'“膜拜Siyuan就是无脑硬肝，现在除了真理等级外的东西我都购买了。第6次尝试怎么这么贵啊！”',
		'你强归你强，Siyuan比你强！',
		'你可以按住<code>Enter</code>来快速点击一个按钮。',
		'Siyuan是我们的红太阳，没有她我们会死！',
		'你<strong>不能</strong>通过按住<code>Shift</code>点击一个按钮以直接购买最大数量的事物。',
		'今天又是美好的一天~',
		'若不是Siyuan相助，也许我到现在还不知道我做错了什么。现在我知道了，是<code>LCT</code>上<code>splay</code>的时候判断父亲是否为根直接用了<code>if(fa->fa)</code>。',
		'洁白的光点游走于漆黑的天幕之上，暗紫色的薄纱在其间舞动。在此无月之夜，是否可以知晓：“后缀自动机怎么写？”',
		'那些文档有一部分真的有用……',
		'Siyuan 膜 她 自 己',
		'Siyuan D 她 自 己',
		'如果你花掉了一些东西，它的花费也会降低，就像你从没买过它一样。',
		'<a href="https://lmoliver.github.io">qwq</a>',
		'要想探寻真理，不仅要虔诚膜拜Siyuan，领导者的实力也是很重要的。',
		'<code>code.replace(/\\n\\s*\\{/mg,\'{\');</code>',
		'嘤嘤嘤',
		'Hello world!',
		'在夕阳的照耀下，教堂的圆顶散发出金色的光辉。',
		'这一刻，我们都是Siyuan的忠实粉丝。',
		'Do the magic!',
		'传说Siyuan会在被她抛弃的终端上用 root 权限执行<code>rm -rf /*</code>。',
		'Siyuan太强了，所以你复制不了这个网站中的任何一个Siyuan。',
		'空谈误国，实干兴邦。',
		'<img src="./daily1.png">',
		'<img src="./daily2.png">',
		'<img src="./daily3.png">',
		'OrzSiyuan 就来 <a href="https://orzsiyuan.com">orzsiyuan.com</a>！',
		'你知道吗？Siyuan几乎每天都会上几次<a href="http://lydsy.online">http://lydsy.online</a>！(难道网址中的<code>dsy</code>是天意？)',
		'追寻真理的各种花费与你本轮尝试次数有关。',
		'追寻真理时重置会将当前成功轮数也清空！',
		'<iframe src="https://majsoul.union-game.com/0/">这是什么呀qwq</iframe>',
		'在真理之路上，要不畏艰辛，敢于推翻重来，才不会在错误的道路上越走越远。',
		'窝 又 被 Siyuan D 了 QAQ',
	];
	try{
		return msgs[Math.floor(Math.random()*msgs.length)].replace(/Siyuan/g,'<span class="siyuan"></span>');
	}catch(e){
		return 'emm...';
	}
}

const SAVE_ITEMS={
	moValue:{
		name:'膜拜次数',
		format:'VALUE次膜拜',
	},
	moCount:{
		name:'点击次数',
		format:'VALUE次点击',
	},
	advancedMoLevel:{
		name:'真诚膜拜等级',
		format:'真诚膜拜Lv.VALUE',
	},
	moers:{
		name:'信徒',
		format:'VALUE位信徒',
	},
	churchs:{
		name:'教堂',
		format:'VALUE座教堂',
	},
	XY:{
		name:'信仰',
		format:'VALUE信仰',
	},
	books:{
		name:'经书',
		format:'VALUE本经书',
	},
	temple:{
		name:'遗迹',
		format:'已探索VALUE个遗迹',
	},
	hugeStone:{
		name:'巨石',
		format:'VALUE巨石',
	},
	crystal:{
		name:'水晶',
		format:'VALUE水晶',
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
		format:'VALUE枚透镜',
	},
	gem:{
		name:'宝石',
		format:'VALUE枚宝石',
	},
	magicStone:{
		name:'魔法石',
		format:'VALUE枚魔法石',
	},
	altar:{
		name:'神坛',
		format:'VALUE座神坛',
	},
	theology:{
		name:'神学',
		format:'VALUE神学',
	},
	magician:{
		name:'魔法师',
		format:'VALUE位魔法师',
	},
	magic:{
		name:'魔力',
		format:'VALUE魔力',
	},
	scientist:{
		name:'科学家',
		format:'VALUE名科学家',
	},
	science:{
		name:'研究',
		format:'VALUE研究',
	},
	truthUpgradeStage:{
		name:'升级真理阶段',
		format:'第VALUE阶段',
	},
	truthUpgradeAttempt:{
		name:'升级真理尝试次数',
		format:'第VALUE次尝试',
	},
	truthUpgradeGemNeed:{
		name:'升级真理所需宝石',
		format:'需要VALUE宝石',
	},
	truthUpgradeMagicStoneNeed:{
		name:'升级真理所需魔法石',
		format:'需要VALUE魔法石',
	},
	truthUpgradeLenNeed:{
		name:'升级真理所需透镜',
		format:'需要VALUE透镜',
	},
	tech:{
		name:'科技',
		format:'...',
		default:{},
	},
	devotion:{
		name:'虔诚',
		format:'VALUE虔诚',
	},
};

const TECH={
	1:{
		optics:{
			name:'光学',
			description:'水晶的获取使光学成为最先被发展的科学学科。',
			require:[],
			cost(lv){
				return [
					['len',(Math.pow(lv,2)+1)*50],
					['science',(Math.pow(lv,3)+1)*50],
				];
			},
		},
		focus:{
			name:'聚焦',
			description:'用水晶打磨成镜片，利用阳光增幅信仰获取。',
			require:[
				['optics',1],
			],
			cost(lv){
				return [
					['crystal',(Math.pow(lv,2)+1)*100],
				];
			},
		},
		magnifier:{
			name:'放大镜',
			description:'让你的魔法师不用超凡的眼力也能弄清魔法石内部的魔力结构。',
			require:[
				['optics',2],
			],
			cost(lv){
				return [
					['crystal',(Math.pow(lv,1.5)+1)*75],
				];
			},
		},
		glasses:{
			name:'眼镜',
			description:'黑色的框架配上镜片，足以使老龄科学家与神学家看得更清楚。',
			require:[
				['optics',3],
			],
			cost(lv){
				return [
					['len',Math.ceil(Math.pow(lv+1,1.5)*10)],
					['science',Math.ceil(Math.pow(lv+1,2)*1000)],
					['magic',Math.ceil(Math.pow(1.5,lv))],
				];
			}
		},
		xuanxue:{
			name:'玄学',
			description:'经过她手里的随机事件便受她掌控，但没被她看到的呢？玄学便是为了探究这个问题而生。',
			require:[],
			cost(lv){
				return [
					['crystal',Math.pow(lv+1,2.5)*10],
					['magicStone',Math.pow(lv+1,3)*10],
				];
			},
		},
		dunai:{
			name:'毒奶',
			description:'通过反向毒奶可以减少实验时不该产生的误差，进而减少水晶消耗。',
			require:[
				['xuanxue',3],
			],
			cost(lv){
				return [
					['theology',2333+Math.pow(lv,2)*4333],
					['magic',Math.pow(lv+1,2)*6666],
				];
			},
		},
		tidy:{
			name:'整洁',
			description:'洗个澡，把衣服穿戴整齐，往往运气会更好！只在水晶个数模 50 为零时有效。',
			require:[
				['xuanxue',4],
			],
			cost(lv){
				return [
					['crystal',50*(lv+1)**2],
				];
			},
		},
		spell:{
			name:'法术',
			description:'使用不了法术，还能称之为魔法吗？',
			require:[],
			cost(lv){
				return [
					['magicStone',500*(lv+1)],
					['magic',(2.5)**lv *500/3],
				];
			},
		},
		spellWater:{
			name:'流水术',
			description:'江河湖海，皆在掌控。',
			require:[
				['spell',2],
			],
			cost(lv){
				return [
					['magic',Math.pow(3.5,lv)*100],
				];
			}
		},
		devotionInduction:{
			name:'虔诚感应',
			description:'一束玄妙的魔力丝通向天空，让她知道你正在认真地膜拜她。',
			require:[
				['focus',1],
				['spell',4],
				['spellWind',1],
			],
			cost(lv){
				return [
					['theology',Math.pow(2,lv)*1000],
					['magic',Math.pow(lv+1,3)*1000],
				];
			},
		},
	},
	2:{
		spellWind:{
			name:'风语术',
			description:'隐匿于气，交谈于风。',
			require:[
				['spell',6],
			],
			cost(lv){
				return [
					['magic',Math.pow(4,lv)*100],
				];
			}
		},
		spellBird:{
			name:'御鸟术',
			description:'与鸟相关？对了一半。这法术确实与麻雀相关……',
			require:[
				['spell',8],
				['spellWind',3],
			],
			cost(lv){
				return [
					['magic',Math.pow(5,lv)*500],
				];
			}
		},
	},
	3:{

	},
};

const TRUTH_UPGRADES={
	0:{
		stages:2,
		attempts:5,
		minCost:10,
		maxCost:50,
		gen(){
			return {
				x:Math.floor(Math.random()*41+10),
				y:Math.floor(Math.random()*41+10),
				z:Math.floor(Math.random()*41+10),
			};
		},
		dis(x,y,z,tx,ty,tz){
			return Math.abs(x-tx)+Math.abs(y-ty)+Math.abs(z-tz);
		},
		message(x,y,z,tx,ty,tz,dis){
			return `差距:${pn(dis)}`;
		},
	},
	1:{
		stages:3,
		attempts:5,
		minCost:50,
		maxCost:100,
		gen(){
			return {
				x:Math.floor(Math.random()*51+50),
				y:Math.floor(Math.random()*51+50),
				z:Math.floor(Math.random()*51+50),
			};
		},
		dis(x,y,z,tx,ty,tz){
			return Math.sqrt((x-tx)**2+(y-ty)**2+(z-tz)**2);
		},
		message(x,y,z,tx,ty,tz,dis){
			return `距离:${pn(dis)}`;
		},
	},
	2:{
		stages:3,
		attempts:2+3*6+1,
		minCost:100,
		maxCost:160,
		gen(){
			return {
				x:Math.floor(Math.random()*61+100),
				y:Math.floor(Math.random()*61+100),
				z:Math.floor(Math.random()*61+100),
			};
		},
		dis(x,y,z,tx,ty,tz){
			var dx=Math.abs(x-tx);
			var dy=Math.abs(y-ty);
			var dz=Math.abs(z-tz);
			var md=Math.max(dx,dy,dz);
			var res=[];
			if(dx===md)res.push('宝石');
			if(dy===md)res.push('魔法石');
			if(dz===md)res.push('透镜');
			return res;
		},
		message(x,y,z,tx,ty,tz,dis){
			if(dis.length===3){
				return '所有差距相同';
			}else{
				return `${dis.join('、')}差距最大`;
			}
		},
	},
	3:{
		stages:3,
		attempts:9,
		minCost:160,
		maxCost:220,
		gen(){
			return {
				x:Math.floor(Math.random()*61+160),
				y:Math.floor(Math.random()*61+160),
				z:Math.floor(Math.random()*61+160),
			};
		},
		dis(x,y,z,tx,ty,tz){
			var dx=Math.abs(x-tx);
			var dy=Math.abs(y-ty);
			var dz=Math.abs(z-tz);
			return 1+(dx^dy^dz)%9;
		},
		message(x,y,z,tx,ty,tz,dis){
			return `相位:${dis}`;
		},
	},
};

function hasUpgrade(lv){
	return lv in TRUTH_UPGRADES;
}

Vue.component('hint-message',{
	props:['value','update'],
	template:`
		<span class="message" :style="{opacity:op}" v-if="op>0">
			{{value}}
		</span>`,
	watch:{
		update(){
			if(this.value){
				this.sec=0;
			}
		},
	},
	computed:{
		op(){
			return Math.max(0,Math.min(1,3-this.sec/5));
		},
	},
	data(){
		return {
			sec:Infinity,
		};
	},
	mounted(){
		setInterval(()=>{
			this.sec+=0.1;
		},100);
	},
});

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
				if(!this.canBuyMoer)return;
				this.moValue-=this.moerCost;
				this.moers+=1;
			},
			buyChurch(){
				if(!this.canBuyChurch)return;
				this.moers-=this.churchCost;
				this.churchs+=1;
			},
			buyChurchMax(){
				while(this.canBuyChurch||this.canBuyMoer){
					while(this.canBuyChurch){
						this.buyChurch();
					}
					while(this.canBuyMoer){
						this.buyMoer();
					}
				}
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
				var s=1+Math.sqrt(this.natureLevel);
				while(Math.random()<4/5){
					s*=5/4*0.9;
				}
				s=Math.min(s,300);
				this.moers+=Math.round(s);
			},
			exploreTemple(){
				this.XY-=this.exploreTempleCost;
				this.temple+=1;
			},
			pray(){
				if(!this.canPray)return;
				this.moValue-=this.prayCost;
				this.crystal+=1;
			},
			wisdomUpgrade(){
				if(!this.canUpgradeWisdom)return;
				this.crystal-=this.wisdomUpgradeCost;
				this.wisdomLevel+=1;
			},
			mysteryUpgrade(){
				if(!this.canUpgradeMystery)return;
				this.crystal-=this.mysteryUpgradeCost;
				this.mysteryLevel+=1;
			},
			natureUpgrade(){
				if(!this.canUpgradeNature)return;
				this.crystal-=this.natureUpgradeCost;
				this.natureLevel+=1;
			},
			wisdomUpgradeMax(){
				while(this.canPray||this.canUpgradeWisdom){
					while(this.canUpgradeWisdom){
						this.wisdomUpgrade();
					}
					while(this.canPray){
						this.pray();
					}
				}
			},
			mysteryUpgradeMax(){
				while(this.canPray||this.canUpgradeMystery){
					while(this.canUpgradeMystery){
						this.mysteryUpgrade();
					}
					while(this.canPray){
						this.pray();
					}
				}
			},
			natureUpgradeMax(){
				while(this.canPray||this.canUpgradeNature){
					while(this.canUpgradeNature){
						this.natureUpgrade();
					}
					while(this.canPray){
						this.pray();
					}
				}
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

			genTruthUpgradeNeed(){
				var s=TRUTH_UPGRADES[this.truthLevel].gen();
				this.truthUpgradeGemNeed=s.x;
				this.truthUpgradeMagicStoneNeed=s.y;
				this.truthUpgradeLenNeed=s.z;
			},
			truthUpgrade(){
				if(!this.canUpgradeTruth){
					return;
				}

				this.gem-=this.gemChosen;
				this.magicStone-=this.magicStoneChosen;
				this.len-=this.lenChosen;
				this.crystal-=this.truthUpgradeCrystalCost;
				this.theology-=this.truthUpgradeTheologyCost;
				this.magic-=this.truthUpgradeMagicCost;
				this.science-=this.truthUpgradeScienceCost;

				var tu=TRUTH_UPGRADES[this.truthLevel];

				if(this.truthUpgradeAttempt==0){
					this.genTruthUpgradeNeed();
				}
				this.truthUpgradeAttempt++;

				if(this.gemChosen===this.truthUpgradeGemNeed
					&&this.magicStoneChosen===this.truthUpgradeMagicStoneNeed
					&&this.lenChosen===this.truthUpgradeLenNeed){

					this.truthUpgradeResult='实验成功';
					this.truthUpgradeStage++;
					this.truthUpgradeAttempt=0;
					if(this.truthUpgradeStage>=tu.stages){
						this.truthUpgradeMessage='发现新的真理！';
						this.truthLevel++;
						this.truthUpgradeStage=0;
					}else{
						this.truthUpgradeMessage='离真理更进一步';
					}
				}else{
					var xyzt=[this.gemChosen,
						this.magicStoneChosen,
						this.lenChosen,
						this.truthUpgradeGemNeed,
						this.truthUpgradeMagicStoneNeed,
						this.truthUpgradeLenNeed
					];
					var dis=tu.dis(...xyzt);
					this.truthUpgradeResult='实验失败';
					this.truthUpgradeMessage=tu.message(...xyzt,dis);
				}
				this.updateTruthUpgradeMessage();
			},
			resetTruthUpgrade(){
				this.truthUpgradeStage=0;
				this.truthUpgradeAttempt=0;
				this.truthUpgradeResult='';
				this.truthUpgradeMessage='';
				this.updateTruthUpgradeMessage();
			},
			updateTruthUpgradeMessage(){
				this.truthUpgradeMessageUpdate=(new Date()).getTime();
			},
			techLevel(id){
				return Number(this.tech[id]|0);
			},
			canBuyTech(lv,id){
				return TECH[lv][id].cost(this.techLevel(id)).every(([item,value])=>(this[item]>=value));
			},
			buyTech(lv,id){
				if(this.canBuyTech(lv,id)){
					TECH[lv][id].cost(this.techLevel(id)).forEach(([item,value]) => {
						this[item]-=value;
					});
					this.tech[id]=this.techLevel(id)+1;
				}
			},
			getDevotion(){
				this.devotion+=Math.pow(this.techLevel('devotionInduction'),2);
			},
		},
		computed:{
			moSiyuanTag(){
				return this.books?(`(${pn(this.bookEffect)}点击/秒)`):'';
			},
			moDelta(){
				return Math.ceil((1+this.advancedMoLevel)*(1+this.moers)*(1+this.wisdomLevel)*this.devotionInductionFactor);
			},

			canBuyAdvancedMo(){
				return this.moValue>=this.advancedMoCost;
			},
			advancedMoText(){
				return `真诚膜拜${this.advancedMoLevel>0?` Lv.${pn(this.advancedMoLevel)}`:''} [${pn(this.advancedMoCost)}次膜拜]`;
			},
			advancedMoCost(){
				return Math.floor(10*Math.pow(1+0.2/(this.churchs+1)+0.1/Math.sqrt(this.mysteryLevel+1),this.advancedMoLevel));
			},

			canBuyMoer(){
				return this.moValue>=this.moerCost;
			},
			moerText(){
				return `信徒${this.moers>0?`*${pn(this.moers)}`:''} [${pn(this.moerCost)}次膜拜]`;
			},
			moerCost(){
				return Math.ceil(100*Math.pow(1e3*Math.pow(1.6**(1/2.5),this.moers/this.tidyEffectFactor**1.2)/(1e3+this.XY*(1+this.natureLevel)),2.5));
			},

			churchText(){
				return `教堂${this.churchs>0?`*${pn(this.churchs)}`:''} [${pn(this.churchCost)}位信徒]`;
			},
			canBuyChurch(){
				return this.moers>=this.churchCost;
			},
			churchCost(){
				return Math.floor(5+Math.pow(this.churchs,1.2));
			},

			XYText(){
				return `转化信仰 (+${pn(this.XYEarn)}信仰)`;
			},
			XYEarn(){
				return this.moValue/2000*this.churchs*(1+this.wisdomLevel)*(1+this.techLevel('focus')/4);
			},

			spText(){
				return `传教 [${pn(this.spCost)}经书]`;
			},
			spCost(){
				return Math.pow(Math.max(this.moers,10),0.9)+Math.ceil(Math.pow(1.2,Math.max(this.moers-this.advancedMoLevel/4,0)));
			},

			canBuyBook(){
				return this.XY>=this.bookCost;
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

			canPray(){
				return this.moValue>=this.prayCost;
			},
			prayCost(){
				return Math.pow(1.6,this.crystal/this.temple/(1+this.truthLevel))*1e10/Math.pow(this.XY,1/3);
			},
			canUpgradeWisdom(){
				return this.crystal>=this.wisdomUpgradeCost;
			},
			wisdomUpgradeCost(){
				return Math.ceil(Math.pow(this.wisdomLevel/(1+this.truthLevel)+1.5,2)/(1+this.altar/3));
			},
			canUpgradeMystery(){
				return this.crystal>=this.mysteryUpgradeCost;
			},
			mysteryUpgradeCost(){
				return Math.ceil(Math.pow(this.mysteryLevel/(1+this.truthLevel)+4.5,3)/this.wisdomLevel/(1+this.magician/3));
			},
			canUpgradeNature(){
				return this.crystal>=this.natureUpgradeCost;
			},
			natureUpgradeCost(){
				return Math.ceil(Math.pow(this.natureLevel/(1+this.truthLevel)+4.5,3)/this.mysteryLevel/(1+this.scientist/3));
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
				return Math.max(0,Math.sqrt(this.moDelta*this.gem)-(1+this.theology)/this.altar)/1e4*(1+this.techLevel('glasses'));
			},
			magicianCost(){
				return 16*Math.pow(1.5,this.magician);
			},
			magicCostPerSec(){
				return Math.max(0.01,this.magicStone/5e2)*Math.sqrt(this.magician);
			},
			magicRate(){
				return 5*this.magician*(1+this.techLevel('magnifier')/4);
			},
			scientistCost(){
				return 16*Math.pow(1.5,this.scientist);
			},
			sciencePerSec(){
				return Math.max(0,Math.sqrt(this.len*this.scientist)/2)*Math.sqrt(1+this.techLevel('glasses'));
			},
			scienceLimit(){
				return 50*Math.pow(this.scientist,2)*(1+this.techLevel('glasses'));
			},

			truthUpgradeAttemptFactor(){
				return Math.max(1,Math.pow(3.5,this.truthUpgradeAttempt-TRUTH_UPGRADES[this.truthLevel].attempts+1));
			},
			truthUpgradeTheologyCost(){
				return this.gemChosen*Math.pow(4,this.truthLevel)*16*this.truthUpgradeAttemptFactor/(1+this.techLevel('spellWater')/20);
			},
			truthUpgradeMagicCost(){
				return this.magicStoneChosen*Math.pow(4,this.truthLevel)*36*this.truthUpgradeAttemptFactor/(1+this.techLevel('spellWater')/10);
			},
			truthUpgradeScienceCost(){
				return this.lenChosen*Math.pow(4,this.truthLevel)*64*this.truthUpgradeAttemptFactor/(1+this.techLevel('spellWater')/5);
			},
			truthUpgradeCrystalCost(){
				return Math.ceil(
					this.truthUpgradeAttemptFactor
					*Math.pow(2.5,this.truthLevel)
					*(this.gemChosen+this.magicStoneChosen+this.lenChosen)
					*(2/(3+Math.sqrt(this.techLevel('dunai'))))
				);
			},
			truthUpgradeVaild(){
				function isVaild(l,x,u){
					return typeof(x)==='number'&&Number.isSafeInteger(x)&&!isNaN(x)&&l<=x&&x<=u;
				}
				var t=TRUTH_UPGRADES[this.truthLevel];
				return isVaild(t.minCost,this.gemChosen,t.maxCost)
					&& isVaild(t.minCost,this.magicStoneChosen,t.maxCost)
					&& isVaild(t.minCost,this.lenChosen,t.maxCost);
			},
			canUpgradeTruth(){
				return this.truthUpgradeVaild
					&& this.gem>=this.gemChosen
					&& this.magicStone>=this.magicStoneChosen
					&& this.len>=this.lenChosen
					&& this.crystal>=this.truthUpgradeCrystalCost
					&& this.theology>=this.truthUpgradeTheologyCost
					&& this.magic>=this.truthUpgradeMagicCost
					&& this.science>=this.truthUpgradeScienceCost;
			},

			devotionInductionFactor(){
				var x=this.devotion;
				return Math.pow(1.2,Math.sin(Math.pow(x,1/3))*Math.log2(x+1));
			},

			tidyEffectFactor(){
				if(this.crystal%50!==0)return 1;
				return (1+this.techLevel('tidy')/4);
			}
		},
		data:function(){
			const PADDING='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';
			var data=localStorage.getItem('game-mosiyuan-save');
			if(!data){
				data={};
			}else{
				data=decode.call({
					PADDING,
				},data);
			}
			for(var resName in SAVE_ITEMS){
				if(!data[resName]){
					if(typeof SAVE_ITEMS[resName].default!=='undefined'){
						data[resName]=SAVE_ITEMS[resName].default;
					}else{
						data[resName]=0;
					}
				}
			}
			data.PADDING=PADDING;
			if(hasUpgrade(data.truthLevel)){
				data.gemChosen=TRUTH_UPGRADES[data.truthLevel].minCost;
				data.magicStoneChosen=TRUTH_UPGRADES[data.truthLevel].minCost;
				data.lenChosen=TRUTH_UPGRADES[data.truthLevel].minCost;
			}else{
				data.gemChosen=0;
				data.magicStoneChosen=0;
				data.lenChosen=0;
			}
			data.truthUpgradeResult='';
			data.truthUpgradeMessage='';
			data.truthUpgradeMessageUpdate=(new Date()).getTime();
			data.dailyMessage=dailyMessage();
			data.selectedTruthLevel=1;
			return data;
		},
		created(){
		},
		mounted(){
			setInterval(()=>{
				save={};
				for(var resName in SAVE_ITEMS){
					if(!save[resName]){
						save[resName]=this[resName];
					}
				}
				localStorage.setItem('game-mosiyuan-save',encode.call(this,save));
			});
			var now=Date.now();
			var loop=()=>{
				var nt=Date.now();
				var s=(nt-now)/1000;

				this.moSiyuan(s*this.bookEffect);
				
				this.theology+=s*this.theologyPerSec;
				var msc=Math.min(this.magicStone,s*this.magicCostPerSec);
				this.magicStone-=msc;
				this.magic+=msc*this.magicRate;
				var sci=this.science;
				sci+=s*this.sciencePerSec;
				sci=Math.min(sci,this.scienceLimit);
				this.science=sci;

				var dd=Math.min(this.devotion,s*Math.max(this.devotion*0.001*Math.max(1,Math.sqrt(this.devotionInductionFactor)),2));
				this.devotion-=dd;

				now=nt;

				requestAnimationFrame(loop);
			};
			requestAnimationFrame(loop);
		},
	});
	window._=_;
}();