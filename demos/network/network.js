!function(){
const VERSION='1.0.3';
const VERSION_ID='1.0.3.0';

const sum=(arr)=>arr.reduce((a,b)=>a+b,0);
const product=(arr)=>arr.reduce((a,b)=>a*b,1);

const PADDING='WW91JTIwYXJlJTIwdG9vJTIweWF1bmclMjB0b28lMjBzaW1wbGUldUZGMENzb21ldGltZXMlMjBuYWl2ZS4lMEE=';
function encode(obj){
	return PADDING+JSON.stringify(obj)
			.split('')
			.map(ch=>String.fromCharCode(33+126-ch.charCodeAt(0)))
			.join('')
		+PADDING;
}
function decode(str){
	return JSON.parse(
		str
			.slice(PADDING.length,-PADDING.length)	
			.split('')
			.map(ch=>String.fromCharCode(33+126-ch.charCodeAt(0)))
			.join('')
	);
}

var gameData;

function printNumber(num){
	const EXP_BASE=10;
	const heads=['','U','D','T','q','Q','s','S','O','N'];
	const tails=['','Dc','Vi','Tg','qg','Qg','sg','Sg','Og','Ng'];
	if(typeof num!=='number')return String(num);
	if(!Number.isFinite(num))return num.toString();
	var [val,exp]=num.toExponential(2).split('e').map(parseFloat);
	if(exp<6){
		if(Number.isSafeInteger(num))return num.toString();
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

const MAX_NAMED_LAYER=6;
const LAYER_NAMES=[
	'结点',
	'链',
	'菊花',
	'树',
	'森林',
	'图',
	'网络',
];

function initObj(layer,weight=1){
	var obj={
		weight,
		layer,
		show:true,
		point:1,
	};
	obj.level=1;
	if(layer!==0){
		obj.sons=[initObj(layer-1,weight)];
	}
	return obj;
}

function forEachObj(callback){
	function forEachInObj(obj){
		callback(obj);
		if(obj.layer>0){
			obj.sons.forEach(obj => {
				forEachInObj(obj);
			});
		}
	}
	gameData.arr.forEach(obj => {
		forEachInObj(obj);
	});
}

function calcSum(obj){
	return Math.pow(
		obj.level*(obj.layer===0?
			obj.weight*obj.weight
			:calcArrSum(obj.sons)),
		obj.point
	);
}

function calcArrSum(arr){
	return sum(arr.map(calcSum));
}

function calcGlobalSum(){
	var s=calcArrSum(gameData.arr);
	s+=calcGlobalAdd();
	s*=calcGlobalMult();
	s**=calcGlobalPower();
	return s;
}

function calcPoint(obj){
	const minPro=obj.weight*2+18;
	const valPro=obj.level;
	const rate=1/(Math.pow(obj.layer+1,3));
	return (Math.log2(valPro)-Math.log2(minPro-1))*rate+1
}

function calcArrPoint(arr){
	return product(arr.map(o=>o.point));
}

const PRICE_INCERASE_RATE=1.44;
const PRICE_INCERASE_RATE_PER_LAYER=0.36;
function upgradeCost(obj){
	return obj.weight*Math.pow(1e5,Math.pow(obj.layer,1.6))*Math.pow(
		PRICE_INCERASE_RATE+obj.layer*PRICE_INCERASE_RATE_PER_LAYER,
		obj.level-1);
}

function upgrade(obj){
	gameData.coin-=upgradeCost(obj);
	obj.level++;
}

const APPEND_COST_PER_LAYER=1e5;
function addSonCost(arr){
	return 25*Math.pow(APPEND_COST_PER_LAYER,arr[0].layer)
		*Math.pow((arr[0].layer+1)*4,arr.length)
		*Math.sqrt(arr[0].weight);
}

function addSon(arr){
	gameData.coin-=addSonCost(arr);
	arr.push(initObj(arr[0].layer,arr[0].weight*(arr.length+1)));
}

function canToPoint(obj){
	return calcPoint(obj)-obj.point>1e-3;
}

function toPoint(obj){
	obj.point=calcPoint(obj);
	if(obj.layer==0){
		obj.level=1;
	}else{
		obj.sons=[initObj(obj.layer-1)];
	}
}

function showImproveAreas(){
	return showSkillArea()||showLayerArea();
}

function canToNewSkill(){
	var lastSkill=gameData.skills.length-1;
	if(lastSkill>=gameData.layer)return false;
	return canToSkill(lastSkill+1);
}

const COIN_TO_SKILL=1e6;
const SKILLPOINT_TO_SKILL=1e6;
function canToSkill(id){
	if(id===0){
		return gameData.coin>=COIN_TO_SKILL;
	}else{
		return gameData.skills[id-1].skillPoint>=SKILLPOINT_TO_SKILL;
	}
}

function calcSkillPointGain(id){
	var v=id===0?
		(gameData.coin/COIN_TO_SKILL)-1
		:(gameData.skills[id-1].skillPoint/SKILLPOINT_TO_SKILL)-1;
	return v>=0?Math.sqrt(v):0;
}

function clearNetwork(){
	gameData.coin=0;
	gameData.arr=[initObj(gameData.layer)];
}
function clearSkill(id){
	for(let i=0;i<id;i++){
		gameData.skills[i]=initSkill();
	}
}
function clearSkills(){
	gameData.skills=[];
}
function toSkill(id){
	gameData.skills[id].skillPoint+=calcSkillPointGain(id);
	clearNetwork();
	clearSkill(id);
}

function showSkillArea(){
	return gameData.skills.length>0;
}

function skillLevelName(id){
	return id<=3?
		('超'.repeat(id)+'转'+(id===0?'生':''))
		:(`超.${id}转`);
}

function skillPointName(id){
	if(id==='-1')return '财富';
	return id<=3?
		('超'.repeat(id)+'技能点')
		:(`超.${id}技能点`);
}

function initSkill(){
	return {
		skillPoint:0,
		coinGen:0,
		globalMult:0,
		globalPower:0,
		toPointMult:0,
		show:true,
	};
}

const SKILLS={
	coinGen:{
		name:'财富获取',
		format:'+VALUE财富/秒',
		effect(lv){
			return 100*lv**4;
		},
		costBase:5,
		costMult:1,
		enable(skillId){
			return skillId===0;
		},
	},
	globalMult:{
		name:'全局加成',
		format:'xVALUE',
		effect(lv){
			return Math.pow(2,lv);
		},
		costBase:2,
		costMult:1,
		enable(skillId){
			return true;
		},
	},
	globalPower:{
		name:'全局指数',
		format:'^VALUE',
		effect(lv){
			return 1+lv*0.01;
		},
		costBase:4,
		costMult:5,
		enable(skillId){
			return skillId>=1;
		},
	},
	// toPointMult:{
	// 	name:'回转加成(无效,请勿购买)',
	// 	format:'xVALUE',
	// 	effect(lv){
	// 		return Math.pow(1.01,lv);
	// 	},
	// 	costBase:3,
	// 	costMult:3,
	// 	enable:2,
	// },
};

function isSkill(skillId){
	return typeof SKILLS[skillId]!=='undefined';
}
function skillName(skillId){
	return SKILLS[skillId].name;
}
function isSkillEnabled(skillId,id){
	return SKILLS[skillId].enable(id);
}
function skillValue(skill,skillId){
	return SKILLS[skillId].effect(skill[skillId]);
}
function skillEffectString(skill,skillId){
	return SKILLS[skillId].format.replace(
		'VALUE',
		printNumber(skillValue(skill,skillId))
	);
}
function skillCost(skill,skillId){
	const skInfo=SKILLS[skillId];
	return skInfo.costMult*Math.pow(skInfo.costBase,skill[skillId]);
}
function canLearnSkill(skill,skillId){
	return skill.skillPoint>=skillCost(skill,skillId);
}
function learnSkill(skill,skillId){
	skill.skillPoint-=skillCost(skill,skillId);
	skill[skillId]++;
}

function calcGlobalAdd(){
	return sum(gameData.skills.map(s=>skillValue(s,'coinGen')));
}

function calcGlobalMult(){
	return product(gameData.skills.map(s=>skillValue(s,'globalMult')));
}

function calcGlobalPower(){
	return product(gameData.skills.map(s=>skillValue(s,'globalPower')));
}

function showLayerArea(){
	return canLayerUp()||canToSkill(gameData.skills.length);
}
function canLayerUp(){
	if(gameData.layer<MAX_NAMED_LAYER){
		return gameData.arr.length>=30;
	}else{
		return false;
	}
}
function layerUpHint(){
	if(gameData.layer<MAX_NAMED_LAYER){
		return `${LAYER_NAMES[gameData.arr[0].layer]}的数量必须不小于${printNumber(30)}`;
	}else{
		return '作者还没做这部分，拿头提升';
	}
}
function layerUp(){
	gameData.layer+=1;
	clearNetwork();
	clearSkills();
}

function newGameData(){
	return {
		version:VERSION,
		versionID:VERSION_ID,
		coin:0,
		arr:[initObj(0)],
		layer:0,
		showSkills:true,
		skills:[],
	};
}

function fixGameData(gd){
	function fixKey(obj,key,def){
		if(typeof obj[key]==='undefined'){
			obj[key]=def;
		}
	}
	// console.log('存档版本',gd.versionID);
	if(typeof gd.versionID==='undefined'){
		fixKey(gd,'version','1.0.2');
		fixKey(gd,'versionID','1.0.2.0');
		fixKey(gd,'coin',0);
		fixKey(gd,'layer',0);
		fixKey(gd,'arr',[initObj(gd.layer)]);
		fixKey(gd,'showSkills',true);
		fixKey(gd,'skills',[]);
		for(let s of gd.skills){
			fixKey(s,'show',true);
			for(let skillId in SKILLS){
				fixKey(s,skillId,0);
			}
		}
	}
	if(gd.versionID<'1.0.3.0'){
		forEachObj(o=>{
			fixKey(o,'level',1);
		})
		gd.versionID='1.0.3.0';
	}
	// console.log(JSON.parse(JSON.stringify(gd)));
}

const CHANGE_LOG={
	'v1.0.3':
`增加了对非结点结构的升级功能
大幅改进界面
${SKILLS.coinGen.name}现在仅在${skillLevelName(0)}中可用
`,

	'v1.0.2':
`新的技能:${SKILLS.coinGen.name}
	生成固定的财富收入
	最低要求:${skillLevelName(0)}
改进了界面`,

	'v1.0.1':
`增加了层次系统`,

};

const methods={
	sum,
	product,
	printNumber,
	addSon,
	upgradeCost,
	upgrade,
	toSkill,
	calcSum,
	calcArrPoint,
	calcArrSum,
	calcGlobalMult,
	calcGlobalAdd,
	calcGlobalPower,
	calcGlobalSum,
	calcSkillPointGain,
	calcPoint,
	canLayerUp,
	canLearnSkill,
	canToNewSkill,
	canToPoint,
	canToSkill,
	clearNetwork,
	clearSkill,
	clearSkills,
	toPoint,
	encode,
	decode,
	doGameTick,
	addSonCost,
	initObj,
	showImproveAreas,
	initSkill,
	showSkillArea,
	isSkill,
	isSkillEnabled,
	skillValue,
	showLayerArea,
	layerUp,
	layerUpHint,
	learnSkill,
	skillPointName,
	skillName,
	skillCost,
	skillLevelName,
	skillEffectString,
	forEachObj,
	fixGameData,
	newGameData,
};

const data={
	get gameData(){
		return gameData;
	},
	set gameData(gd){
		gameData=gd;
	},
	VERSION,
	VERSION_ID,
	LAYER_NAMES,
	SKILLPOINT_TO_SKILL,
	MAX_NAMED_LAYER,
	SKILLS,
	PADDING,
	COIN_TO_SKILL,
	APPEND_COST_PER_LAYER,
	CHANGE_LOG,
}

Vue.component('arr-shower',{
	props:['arr'],
	methods,
	data(){
		return data;
	},
	template:`
	<ul>
		<li v-for="(obj,id) in arr">
			<obj-shower :obj="obj" :id="id">
			</obj-shower>
		</li>
		<button @click="addSon(arr)" class="btn-enabled" :disabled="gameData.coin&lt;addSonCost(arr)">
			增加新的{{LAYER_NAMES[arr[0].layer]}}
		</button>
		<span>花费:{{printNumber(addSonCost(arr))}}财富</span>
	</ul>`,
})

Vue.component('obj-shower',{
	props:['obj','id'],
	methods,
	data(){
		return data;
	},
	template:`
		<div :class="['object','obj-layer-name-'+obj.layer%(MAX_NAMED_LAYER+1)]">
			<strong>
				<span>
				{{LAYER_NAMES[obj.layer]}}
				</span>
				<span v-if="typeof id!=='undefined'">
					#{{id+1}}
				</span>
			</strong>
			<span>
				{{printNumber(calcSum(obj))}}财富/秒
			</span>
			<button @click="obj.show=!obj.show" class="btn">{{obj.show?'收起':'展示'}}</button>
			<div v-if="obj.show">
				<div>
					<span>{{obj.level}}级<span>
					<button @click="upgrade(obj)" class="btn-enabled" :disabled="gameData.coin&lt;upgradeCost(obj)">
						升级
					</button>
					<span>花费:{{printNumber(upgradeCost(obj))}}财富<span>
				</div>
				<div v-if="obj.layer!==0">
					<arr-shower :arr="obj.sons"></arr-shower>
				</div>
				<div v-if="obj.point&gt;1||canToPoint(obj)">
					<span>指数:{{obj.point.toFixed(2)}}</span>
					<span v-if="canToPoint(obj)">
						<span>=> {{calcPoint(obj).toFixed(2)}}</span>
						<button @click="toPoint(obj)" class="btn-danger">回转{{LAYER_NAMES[obj.layer]}}</button>
					</span>
				<div>
			</div>
		</div>
	`,
});

function doGameTick(ms){
	this.gameData.coin+=calcGlobalSum()*ms/1000;
	while(canToNewSkill()){
		this.gameData.skills.push(initSkill());
	}
}

var app=new Vue({
	el:'#app',
	data,
	methods,
	created(){
		var save=localStorage.getItem('game-network-save');
		if(save!=null){
			try{
				var gd;
				try{
					this.gameData=gd=decode(save);
				}catch(e){
					throw e;
				}
				if(typeof gd.version==='undefined'||gd.version!==VERSION){
					if(typeof gd.versionID==='undefined'||gd.versionID<VERSION_ID){	
						fixGameData(gd);
						console.log(CHANGE_LOG);
					}else{
						throw new Error(`${gd.version}版的存档拿头解析\n当前版本:${VERSION}`);
					}
				}
			}catch(e){
				console.error(e);
				this.gameData=newGameData();
			}finally{
				console.log('存档载入成功');
			}
		}else{
			this.gameData=newGameData();
		}
		var time=(new Date()).getTime();
		this.inv=setInterval(()=>{
			var newTime=(new Date()).getTime();
			this.doGameTick.call(this,newTime-time);
			time=newTime;
			localStorage.setItem('game-network-save',encode(this.gameData));
		});
		console.group('更新记录');
		for(const ver in CHANGE_LOG){
			const el=CHANGE_LOG[ver];
			console.log(`%c${ver}\n%c${el}`,'font-weight:bold','');
		}
		console.groupEnd();
	},
	beforeDestroy(){
		clearInterval(this.inv);
	},
});

// window.debug={
// 	data,
// 	methods,
// };

}();