const fs=require('fs');
const io=require('socket.io-client');
const socket=io('http://botws.generals.io');
function log(str){
	fs.writeFileSync('./io.log',String(str)+'\n',{flag:'a'},()=>{});
}
function write(str){
	console.log(String(str));
}
socket.on('connect',function(){
	write('connect');
});
socket.on('disconnect', function() {
	log(`Disconnected`);
	write('disconnect');
	process.exit(1);
});

let map;
let cities;
let height;
let width;
socket.on('game_start', function(data) {
	write('game_start');
	write(data.playerIndex);
	write(data.replay_id);
	write(data.chat_room);
	if('team_chat_room' in data){
		write(data.team_chat_room);
	}
	let playerCount;
	playerCount=data.usernames.length;
	write(playerCount);
	for(let name of data.usernames){
		write(name);
	}
	if(!('teams' in data)){
		data.teams=new Array(playerCount).fill(0).map((x,i)=>i+1);
	}
	write(data.teams.join(' '));
	map=[];
	cities=[];
});
socket.on('game_update',function(data){
	function patch(old, diff) {
		var out = [];
		var i = 0;
		while (i < diff.length) {
			if (diff[i]) {  // matching
				Array.prototype.push.apply(out, old.slice(out.length, out.length + diff[i]));
			}
			i++;
			if (i < diff.length && diff[i]) {  // mismatching
				Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
				i += diff[i];
			}
			i++;
		}
		return out;
	}
	write('game_update');
	write(data.turn);
	map=patch(map,data.map_diff);
	height=map[1];
	width=map[0];
	write(`${height} ${width}`);
	let size=height*width;
	const splitPos=(pos)=>`${Math.floor(pos/width)} ${pos%width}`;
	let armies=map.slice(2,size+2);
	for(let x=0;x<height;x++){
		write(armies.slice(x*width,(x+1)*width).join(' '));
	}
	let terrain=map.slice(size+2,size*2+2);
	for(let x=0;x<height;x++){
		write(terrain.slice(x*width,(x+1)*width).join(' '));
	}
	cities=patch(cities,data.cities_diff);
	write(cities.length);
	for(let pos of cities){
		write(splitPos(pos));
	}
	for(let pos of data.generals){
		if(pos===-1){
			write(`-1 -1`);
		}
		else{
			write(splitPos(pos));
		}
	}
	for(let score of data.scores){
		write(`${score.i} ${score.total} ${score.tiles}`);
	}
});
socket.on('game_lost', function(data) {
	write('game_lost');
	write(data.killer);
});
socket.on('game_won', function(data) {
	write('game_won');
});
const SUBMIT_TABLE={
	set_username(user_id,user_name){
		socket.emit('set_username',user_id,user_name);
	},
	play(user_id){
		socket.emit('play',user_id);
	},
	join_1v1(user_id){
		socket.emit('join_1v1', user_id)
	},
	join_private(custom_game_id,user_id){
		socket.emit('join_private',custom_game_id,user_id);
	},
	set_force_start(queue_id,doForce){
		socket.emit('set_force_start',queue_id,doForce==='true');
	},
	attack(startX,startY,endX,endY,is50){
		function makePos(x,y){
			return Number(x)*width+Number(y);
		}
		socket.emit('attack',makePos(startX,startY),makePos(endX,endY),is50==='true');
	},
	clear_moves(){
		socket.emit('clear_moves');
	},
	leave_game(){
		socket.emit('leave_game');
	},
	chat_message(chat_room,text){
		socket.emit('chat_message',chat_room,text);
	},
};
async function send(str){
	if(str.trim()==='')return;
	let [eventName,...args]=str.split(' ');
	if(eventName==='#'){
		log(`${str.slice(2)}`);
	}
	else if(eventName==='quit'){
		process.exit(0);
	}
	else if(eventName in SUBMIT_TABLE){
		let action=SUBMIT_TABLE[eventName];
		let argCount=action.length;
		if(args.length>action.length){
			args=[
				...(args.slice(0,argCount-1)),
				args.slice(argCount-1).join(' ')
			];
		}
		action(...args);
	}else{
		log(`Unknown eventName ${str}`);
		process.exit(1);
	}
}
let curLen=0;
async function loop(){
	try{
		let s=fs.readFileSync('./data.txt');
		let data=s.toString();
		let a=data.split('\n');
		if(a.length>curLen+1){
			for(let str of a.slice(curLen,a.length-1)){
				await send(str);
			}
			curLen=a.length-1;
		}
		setImmediate(loop);
	}catch(e){
		log(`Runtime errorn\n${e.toString()}`);
		process.exit(1);
	}
}
setImmediate(loop);