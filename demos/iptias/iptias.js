{
	const TPS=60;
	const W=600;
	const H=600;
	function posZero(){
		return {x:0,y:0};
	}
	function posAdd(pos1,pos2){
		return {
			x:pos1.x+pos2.x,
			y:pos1.y+pos2.y,
		};
	}
	function posAddTo(pos1,pos2){
		pos1.x+=pos2.x;
		pos1.y+=pos2.y;
	}
	function posMul(pos,r){
		return {
			x:pos.x*r,
			y:pos.y*r,
		};
	}
	function posMulTo(pos,r){
		pos.x*=r;
		pos.y*=r;
	}
	function posSub(pos1,pos2){
		return {
			x:pos1.x-pos2.x,
			y:pos1.y-pos2.y,
		};
	}
	function sqrLen(pos){
		return pos.x**2+pos.y**2;
	}
	function sqrDis(pos1,pos2){
		return sqrLen(posSub(pos1,pos2));
	}
	class BulletBase{
		constructor(){}
		name(){}
		gameTick(game){}
		html(){}
		dead(){}
		hit(pos,radius){}
	};
	class NewtonBullet extends BulletBase{
		constructor({pos,speed=posZero(),acceleration=posZero()}){
			super();
			this.pos=pos;
			this.speed=speed;
			this.acceleration=acceleration;
		}
		gameTick(game){
			posAddTo(this.speed,posMul(this.acceleration,1/TPS));
			posAddTo(this.pos,posMul(this.speed,1/TPS));
		}
	};
	function makeElement(document,tagName,attributes){
		// let element=document.createElement(tagName);
		// for(let name in attributes){
		// 	element.setAttribute(name,attributes[name]);
		// }
		// for(let className of classList){
		// 	element.classList.add(className);
		// }
		// return element;
		let s=[];
		for(let attr in attributes){
			s.push(`${attr}="${attributes[attr]}"`);
		}
		return `<${tagName} ${s.join(' ')}></${tagName}>`;
	}
	class CircleBullet extends NewtonBullet{
		constructor({pos,speed,acceleration,radius=10,color=null}){
			super({pos,speed,acceleration});
			this.radius=radius;
			this.color=color;
		}
		gameTick(game){
			super.gameTick(game);
		}
		live(){
			return this.pos.y>-this.radius&&this.pos.x<W+this.radius
				&&this.pos.y>-this.radius&&this.pos.y<H+this.radius;
		}
		render(document){
			return [
				{
					element:makeElement(document,'circle',{
						cx:this.pos.x,
						cy:this.pos.y,
						r:this.radius+1,
						fill:this.color,
					}),
					z:0,
				},
				{
					element:makeElement(document,'circle',{
						cx:this.pos.x,
						cy:this.pos.y,
						r:this.radius-1,
						style:'fill:rgba(255,255,255,0.5)',
					}),
					z:1,
				},
			];
		}
		hit(player){
			return sqrDis(this.pos,player.pos)<(player.radius+this.radius)**2;
		}
	};
	class Player{
		constructor({pos,radius=10}){
			this.pos=pos;
			this.speed={x:0,y:0};
			this.radius=radius;
			this.dead=false;
		}
		render(document){
			return [
				{
					element:makeElement(document,'circle',{
						cx:this.pos.x,
						cy:this.pos.y,
						r:this.radius,
						style:`fill:${this.dead?'red':'blue'}`,
					}),
					z:2,
				},
			];
		}
		gameTick(game){
			if(!this.dead){
				posAddTo(this.pos,this.speed);
			}
			this.pos.x=Math.max(this.pos.x,this.radius);
			this.pos.x=Math.min(this.pos.x,W-this.radius);
			this.pos.y=Math.max(this.pos.y,this.radius);
			this.pos.y=Math.min(this.pos.y,H-this.radius);
		}
		setSpeed(speed){
			this.speed=speed;
		}
	}
	class Game{
		constructor(){
			this.bullets=[];
			this.timing=[];
			this.players=[];
			this.tick=0;
		}
		addPlayer(player){
			this.players.push(player);
		}
		addBullet(bullet){
			this.bullets.push(bullet);
		}
		planBullet(bullet,tick){
			this.timing.push({
				bullet,
				tick:this.tick+tick,
			});
		}
		gameTick(){
			this.players.forEach(p=>p.gameTick(game));
			let newBullets=this.bullets.filter(b=>b.live());
			newBullets.push(...(this.timing.filter(t=>this.tick>=t.tick)));
			this.timing=this.timing.filter(t=>this.tick<t.tick);
			newBullets.forEach(b=>b.gameTick(game));
			newBullets.forEach(b=>{
				game.players.forEach(p=>{
					if(b.hit(p)){
						p.dead=true;
					}
				});
			});
			this.bullets.splice(0,this.bullets.length,...newBullets);
			this.tick++;
		}
		render(document){
			let elements=[];
			this.bullets.forEach(b=>elements.push(...(b.render(document))));
			this.players.forEach(p=>elements.push(...(p.render(document))));
			elements.sort((a,b)=>a.z-b.z);
			return elements.map(e=>e.element);
		}
	};

	let game=new Game();

	let pressed=new Set();
	document.addEventListener('keydown',(e)=>pressed.add(e.key.toUpperCase()));
	document.addEventListener('keyup',(e)=>pressed.delete(e.key.toUpperCase()));

	function start(){
		let player=new Player({
			pos:{x:W*0.5,y:H*0.8},
			radius:6,
		});
		game.addPlayer(player);
		game.addBullet(new CircleBullet({
			pos:{x:0,y:0},
			speed:{x:150,y:500},
			acceleration:{x:0,y:-250},
			radius:100,
			color:'red',
		}));
		for(let i=0;i<=10;i++){
			game.addBullet(new CircleBullet({
				pos:{x:W/2,y:0},
				speed:{x:(i-5)*15,y:50},
				acceleration:{x:(5-i)*2,y:0},
				radius:8,
				color:'blue',
			}));
		}
		this.fpTime=[];
		function gameTick(){
			let now=Date.now();
			while(fpTime.length>0&&now-fpTime[0]>=1000){
				fpTime.shift();
			}
			fpTime.push(now);
			document.getElementById('fps').innerHTML=`FPS:${fpTime.length}`;
			let speed=posZero();
			const PPF=3;
			if(pressed.has('W'))posAddTo(speed,{x:0,y:-PPF});
			if(pressed.has('S'))posAddTo(speed,{x:0,y:PPF});
			if(pressed.has('A'))posAddTo(speed,{x:-PPF,y:0});
			if(pressed.has('D'))posAddTo(speed,{x:PPF,y:0});
			let spLen=Math.sqrt(sqrLen(speed));
			if(spLen>PPF){
				posMulTo(speed,PPF/spLen);
			}
			player.setSpeed(speed);
			game.gameTick();
			if(game.tick%5==0){
				game.addBullet(new CircleBullet({
					pos:{x:W*Math.random(),y:0},
					speed:{x:(Math.random()-0.5)*2*W*0.2,y:Math.random()*W/4+W/4},
					acceleration:{x:(Math.random()-0.5)*2*W*0.2,y:(Math.random()-0.5)*2*H*0.2},
					color:'green',
				}));
			}
			let gameBox=document.getElementById('game');
			gameBox.innerHTML=game.render(document).join('');
			requestAnimationFrame(gameTick);
		}
		requestAnimationFrame(gameTick);
	}

	start();
}