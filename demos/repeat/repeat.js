const WIDTH=600;
const HEIGHT=600;

const D_LEFT=-1;
const D_STOP=0;
const D_RIGHT=1;
const PLAYER_CTRL={
	bot(game){
		const plane=game.planes.find(p=>p.owner===game.player);
		return {
			d:[D_LEFT,D_STOP,D_RIGHT][Math.floor(Math.random()*3)],
			// d:D_STOP,
			shoot:true,
		}
	},
	human(game){
		var a=1;
		if(pressing.A){
			a--;
		}
		if(pressing.D){
			a++;
		}
		return {
			d:[D_LEFT,D_STOP,D_RIGHT][a],
			shoot:pressing.W,
		};
	},
	human2(game){
		var a=1;
		if(pressing.ARROWRIGHT){
			a--;
		}
		if(pressing.ARROWLEFT){
			a++;
		}
		return {
			d:[D_LEFT,D_STOP,D_RIGHT][a],
			shoot:pressing.ARROWUP,
		};
	},
};

var pressing={};
window.addEventListener('keydown',(e)=>{
	pressing[e.key.toUpperCase()]=true;
});
window.addEventListener('keyup',(e)=>{
	pressing[e.key.toUpperCase()]=false;
});


const methods={
	getPlayerId(name){
		return 0;
	},
};
const data={
	pressing,
}

const R=Math.PI/180;

class Pos{
	constructor(x=0,y=0){
		this.x=x;
		this.y=y;
	}
	toString(){
		return `${this.x},${this.y}`;
	}
	apply(sp){
		this.x+=sp.x;
		this.y+=sp.y;
	}
	sqDist(pos){
		return Math.pow(this.x-pos.x,2)+Math.pow(this.y-pos.y,2);
	}
	copy(){
		return new Pos(this.x,this.y);
	}
};

class Speed{
	constructor(x=0,y=0){
		this.x=x;
		this.y=y;
	}
	toString(){
		return `${this.x},${this.y}`;
	}
	mul(r=1){
		return new Speed(this.x*r,this.y*r);
	}
	add(sp){
		return new Speed(this.x+sp.x,this.y+sp.y);
	}
	copy(){
		return new Speed(this.x,this.y);
	}
};

function angleSpeed(angle){
	return new Speed(Math.sin(angle*R),-Math.cos(angle*R));
}

const PLANE_COOLDOWN=15;
class Plane{
	constructor(...args){
		this.spawn(...args);
	}
	spawn(owner,pos,speed,angle,color){
		this.owner=owner;
		this.pos=pos;
		this.speed=speed;
		this.angle=this.da=angle;
		this.cooldown=0;
		this.died=false;
		this.respawnTime=0;
		this.color=color;
	}
	bulletSpeed(){
		return this.speed.add(angleSpeed(this.angle).mul(5));
	}
	destroy(){
		this.died=true;
		this.respawnTime=250;
	}
};
Vue.component('svg-plane',{
	props:['plane'],
	data(){
		return data;
	},
	methods,
	template:`<g :transform="'translate('+plane.pos+')'">
	<g :transform="'rotate('+plane.angle+')'">
		<circle cx="0" cy="0" r="15" :fill="plane.color"/>
		<rect x="-5" y="-20" width="10" height="20"
			style="fill:gray;stroke:black;stroke-width:2;"/>
		<circle cx="0" cy="0" :r="10"
			style="fill:gray;stroke:black;stroke-width:2;"/>
		<circle cx="0" cy="0" :r="Math.max(1-plane.cooldown/PLANE_COOLDOWN,0)*8" fill="yellow"/>
	</g>
</g>`,
});

class Bullet{
	constructor(owner,pos,speed){
		this.owner=owner;
		this.pos=pos;
		this.speed=speed;
	}
};
Vue.component('svg-bullet',{
	props:['bullet'],
	data(){
		return data;
	},
	methods,
	template:`<g :transform="'translate('+bullet.pos+')'">
		<g :transform="'rotate('+Math.atan2(bullet.speed.x,-bullet.speed.y)/R+')'">
			<circle r="5" fill="black"/>
			<rect x="-5" y="0" width="10" height="5" fill="black"/>
		</g>
	</g>`,
});

var app=new Vue({
	el:'#app',
	data:{
		planes:[
			new Plane('human2',new Pos(WIDTH/2,0),new Speed(),180,'#ff0000'),
			new Plane('human',new Pos(WIDTH/2,HEIGHT),new Speed(),0,'#0000ff'),
		],
		bullets:{},
		playerMemory:{},
		...data,
	},
	mounted(){
		setInterval(() => {
			function bounceX(obj){
				if(obj.pos.x<0){
					obj.pos.x*=-1;
					obj.speed.x*=-1;
				}else if(obj.pos.x>WIDTH){
					obj.pos.x*=-1;
					obj.pos.x+=2*WIDTH;
					obj.speed.x*=-1;
				}
			}
			function action(){
				for(plane of this.planes){
					let hasPlaneDied=this.planes.some(p=>p.died);
					let res=plane.died?{
						d:D_STOP,
						shoot:false,
					}:PLAYER_CTRL[plane.owner]({
						player:plane.owner,
						planes:this.planes,
						bullets:this.bullets,
					});
					if(hasPlaneDied){
						res.shoot=false;
					}
					let da=plane.da;
					let ta=((plane.angle-da)+540)%360-180;
					switch(res.d){
						case D_LEFT:{
							ta=Math.max(ta-5,-30);
							break;
						}
						case D_STOP:{
							ta=Math.sign(ta)*Math.max(Math.abs(ta)-3,0);
							break;
						}
						case D_RIGHT:{
							ta=Math.min(ta+5,30);
							break;
						}
					}
					plane.angle=ta+da;
					function r8(){
						return (Math.floor(Math.random()*16**8)).toString(16);
					}
					function r32(){
						return r8()+r8()+r8()+r8();
					}
					if(res.shoot&&plane.cooldown===0){
						Vue.set(this.bullets,r32(),new Bullet(plane.owner,plane.pos.copy(),plane.bulletSpeed()));
						plane.cooldown=PLANE_COOLDOWN;
					}else{
						plane.cooldown=Math.max(plane.cooldown-1,0);
					}
				}
			}
			function sim(){
				for(plane of this.planes){
					plane.speed.x+=0.3*Math.sin(plane.angle*R);
					plane.speed=plane.speed.mul(0.97);
					plane.pos.apply(plane.speed);
					bounceX(plane);
				}
				for(const id in this.bullets){
					const bullet=this.bullets[id];
					if(bullet.pos.y<0||bullet.pos.y>HEIGHT){
						Vue.delete(this.bullets,id);
					}
				}
				for(const id in this.bullets){
					const bullet=this.bullets[id];
					bullet.pos.apply(bullet.speed);
					bounceX(bullet);
					for(const plane of this.planes){
						if(bullet.owner===plane.owner)continue;
						if(bullet.pos.sqDist(plane.pos)<20**2){
							Vue.delete(this.bullets,id);
							plane.destroy();
						}
					}
				}
			}
			action.call(this);
			sim.call(this);
		},20);
	},
});
