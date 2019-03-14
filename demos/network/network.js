!function(){
const VERSION='1.1';

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

function printNumber(num){
	const EXP_BASE=10;
	const heads=['','U','D','T','q','Q','s','S','O','N'];
	const tails=['','Dc','Vg','Tg','qg','Qg','sg','Sg','Og','Ng'];
	if(!isFinite(num))return num.toString();
	var [val,exp]=num.toExponential(2).split('e').map(Number);
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
	if(layer===0){
		obj.level=1;
	}else{
		obj.sons=[initObj(layer-1,weight)];
	}
	return obj;
}

function calcSum(obj){
	return Math.pow(
		obj.layer===0?
			obj.level*obj.weight*obj.weight
			:calcArrSum(obj.sons),
		obj.point
	);
}

function calcArrSum(arr){
	return sum(arr.map(calcSum));
}

function calcGlobalSum(){
	return Math.pow(calcGlobalMult()*calcArrSum(gameData.arr),calcGlobalPower());
}

function calcPoint(obj){
	const minPro=Math.pow(10,obj.layer)*(obj.weight*2+18);
	const valPro=obj.layer===0?obj.level:calcArrPoint(obj.sons);
	return Math.log2(valPro)-Math.log2(minPro-1)+1
}

function calcArrPoint(arr){
	return product(arr.map(o=>o.point));
}

function upgradeCost(obj){
	if(obj.layer!==0){
		throw new Error('obj must be layer 0');
	}else{
		return obj.weight*Math.pow(1.44,obj.level-1);
	}
}

function upgrade(obj){
	gameData.coin-=upgradeCost(obj);
	obj.level++;
}

const APPEND_COST_PER_LAYER=1e4;
function addSonCost(arr){
	return 25*Math.pow(APPEND_COST_PER_LAYER,arr[0].layer)
		*Math.pow((arr[0].layer+1)*4,arr.length);
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

function skillLevelName(id){
	return id<=3?
		('超'.repeat(id)+'转'+(id===0?'生':''))
		:(`超^${id}转`);
}

function skillPointName(id){
	if(id==='-1')return '财富';
	return id<=2?
		('超'.repeat(id)+'技能点')
		:(`超^${id}技能点`);
}

function initSkill(){
	return {
		skillPoint:0,
		globalMult:0,
		globalPower:0,
		toPointMult:0,
		show:true,
	};
}

const SKILLS={
	globalMult:{
		name:'全局加成',
		format:'xVALUE',
		effectBase:2,
		effectAdd:0,
		costBase:2,
		costMult:1,
		enable:0,
	},
	globalPower:{
		name:'全局指数',
		format:'^VALUE',
		effectBase:1,
		effectAdd:0.1,
		costBase:2,
		costMult:10,
		enable:1,
	},
	toPointMult:{
		name:'回转加成',
		format:'xVALUE',
		effectBase:1.01,
		effectAdd:0,
		costBase:3,
		costMult:3,
		enable:2,
	},
};

function isSkill(skillId){
	return typeof SKILLS[skillId]!=='undefined';
}
function skillName(skillId){
	return SKILLS[skillId].name;
}
function isSkillEnabled(skillId,id){
	return id>=SKILLS[skillId].enable;
}
function skillValue(skill,skillId){
	const skInfo=SKILLS[skillId];
	return (1+skInfo.effectAdd*skill[skillId])*Math.pow(skInfo.effectBase,skill[skillId]);
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

function calcGlobalMult(){
	return product(gameData.skills.map(s=>skillValue(s,'globalMult')));
}

function calcGlobalPower(){
	return product(gameData.skills.map(s=>skillValue(s,'globalPower')));
}

function canLayerUp(){
	if(gameData.layer<MAX_NAMED_LAYER){
		return gameData.arr.length>=30;
	}else{
		return false;
	}
}
function layerUp(){
	gameData.layer+=1;
	clearNetwork();
	clearSkills();
}

var gameData={
	coin:0,
	arr:[initObj(0)],
	layer:0,
	showSkills:true,
	skills:[],
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
	initSkill,
	isSkill,
	isSkillEnabled,
	skillValue,
	layerUp,
	learnSkill,
	skillPointName,
	skillName,
	skillCost,
	skillLevelName,
	skillEffectString,
};

const data={
	gameData,
	VERSION,
	LAYER_NAMES,
	SKILLPOINT_TO_SKILL,
	MAX_NAMED_LAYER,
	SKILLS,
	PADDING,
	COIN_TO_SKILL,
	APPEND_COST_PER_LAYER,
}

Vue.component('obj-shower',{
	props:['obj','id'],
	methods,
	data(){
		return data;
	},
	template:`
		<div class="obj-shower">
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
			<button @click="obj.show=!obj.show">{{obj.show?'收起':'展示'}}</button>
			<div v-show="obj.show">
				<div v-if="obj.layer===0">
					<span>{{obj.level}}级<span>
					<button @click="upgrade(obj)" class="btn-active" :disabled="gameData.coin&lt;upgradeCost(obj)">
						升级
					</button>
					<span>花费:{{printNumber(upgradeCost(obj))}}财富<span>
				</div>
				<div v-else>
					<ul>
						<li v-for="(son,id) in obj.sons">
							<obj-shower :obj="son" :id="id">
							</obj-shower>
						</li>
						<button @click="addSon(obj.sons)" class="btn-active" :disabled="gameData.coin&lt;addSonCost(obj.sons)">
							增加新的{{LAYER_NAMES[obj.layer-1]}}
						</button>
						<span>花费:{{printNumber(addSonCost(obj.sons))}}财富</span>
					</ul>
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
	mounted(){
		var gd;
		try{
			gd=decode(localStorage.getItem('game-network-save'));
		}catch(e){

		}
		finally{
			for(key in gd){
				this.gameData[key]=gd[key];
			}
		}
		var time=(new Date()).getTime();
		this.inv=setInterval(()=>{
			var newTime=(new Date()).getTime();
			this.doGameTick.call(this,newTime-time);
			time=newTime;
			localStorage.setItem('game-network-save',encode(this.gameData));
		});
	},
	beforeDestroy(){
		clearInterval(this.inv);
	},
});

}();