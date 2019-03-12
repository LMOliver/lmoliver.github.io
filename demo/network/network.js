const sum=(arr)=>arr.reduce((a,b)=>a+b,0);

const LAYER_NAMES=[
	'结点',
	'链',
	'菊花',
	'树',
	'森林',
	'图',
	'网络',
];

const MAX_LAYER=6;

function objInit(layer,weight=1){
	var obj={
		weight,
		layer,
		show:true,
		point:1,
	};
	if(layer===0){
		obj.level=1;
	}else{
		obj.sons=[objInit(layer-1,weight)];
	}
	return obj;
}

function calcSum(obj){
	return (obj.layer===0?obj.level*obj.weight:sum(obj.sons.map(calcSum)))*obj.point;
}

function upgradeCost(obj){
	if(obj.layer!==0){
		throw new Error('obj must be layer 0');
	}else{
		return obj.weight*Math.pow(obj.level,2);
	}
}

function upgrade(obj){
	gameData.coin-=upgradeCost(obj);
	obj.level++;
}

function addSonCost(arr){
	return 10*Math.pow(arr[0].layer+2,arr.length*3);
}

function addSon(arr){
	gameData.coin-=addSonCost(arr);
	arr.push(objInit(arr[0].layer,arr[0].weight*(arr.length+1)));
}

var gameData={
	coin:0,
	obj:objInit(MAX_LAYER),
}

Vue.component('obj-shower',{
	props:['obj','id'],
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
				{{calcSum(obj)}}财富/秒
			</span>
			<button @click="obj.show=!obj.show">{{obj.show?'收起':'展示'}}</button>
			<div v-show="obj.show">
				<div v-if="obj.layer===0">
					<span>{{obj.level}}级<span>
					<button @click="upgrade(obj)" :disabled="gameData.coin&lt;upgradeCost(obj)">
						升级
					</button>
					<span>花费:{{upgradeCost(obj)}}财富<span>
				</div>
				<div v-else>
					<ul>
						<li v-for="(son,id) in obj.sons">
							<obj-shower :obj="son" :id="id">
							</obj-shower>
						</li>
						<button @click="addSon(obj.sons)" :disabled="gameData.coin&lt;addSonCost(obj.sons)">
							增加新的{{LAYER_NAMES[obj.layer-1]}}
						</button>
						<span>花费:{{addSonCost(obj.sons)}}</span>
					</ul>
				</div>
				<p v-if="obj.point&gt;1">点数:{{obj.point}}</p>
			</div>
		</div>
	`,
});

var app=new Vue({
	el:'#app',
	data:gameData,
	methods:{
		gt(ms){
			this.coin+=calcSum(this.obj)*ms/1000;
		},
	},
	mounted(){
		var time=(new Date()).getTime();
		this.inv=setInterval(()=>{
			var newTime=(new Date()).getTime();
			this.gt.call(this,newTime-time);
			time=newTime;
		});
	},
	beforeDestroy(){
		clearInterval(this.inv);
	},
});