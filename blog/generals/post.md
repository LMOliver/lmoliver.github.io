
_嘘……_

**记得改`username`**

<fold-block title="脚本">

```
const username = '5teps AK IOI';
const user_id = 'Sk-TRL5SV';
const gameType = 'FFA';
const custom_game_id = 'pqlh';
const doDebug = true;


const COLOR_PLAYERINDEX={
    'red':0,
    'blue':1,
    'green':2,
    'purple':3,
    'teal':4,
    'darkgreen':5,
    'orange':6,
    'maroon':7,
};
class Socket{
    constructor(){
        this.callback={};
        this.inGame=false;
        this.event('connecting');
        var conInv=setInterval(()=>{
            if(document.querySelector('#main-menu-username-input').value==='')return;
            clearInterval(conInv);
            this.event('connect');
            setInterval(()=>{
                var nowInGame=Boolean(document.querySelector('#game-page'))
                    &&document.querySelector('#turn-counter').innerText!=='Turn 0'
                    &&!document.querySelector('#game-page > div.alert.center > center > h1');
                if(this.inGame&&!nowInGame){
                    if(document.querySelector('#game-page > div.alert.center > center > h1').innerText==='Game Over'){
                        this.event('game_lost',{
                            killer:document
                                .querySelector('#game-page > div.alert.center > center > p > span > span')
                                .innerText
                        });
                    }else{
                        this.event('game_won');
                    }
                }
                if(!this.inGame&&nowInGame){
                    var data={
                        playerIndex:this.infoTable().filter(x=>x.name===username)[0].i,
                        replay_id:'I_DON\'T KNOW',
                        chat_room:'USELESS',
                        usernames:this.infoTable().map(x=>x.name),
                    }
                    this.event('game_start',data);
                    var old_map=[];
                    var old_cities=[];
                    var ot=this;
                    function tick(turn){
                        var et=ot.elList();
                        var it=ot.infoTable();
                        var map=[...ot.mapSize(),...et.map(x=>x.armies),...et.map(x=>x.terrain)];
                        var cities=et.filter(x=>x.isCity).map(x=>x.id);
                        var generals=et.reduce(
                            (arr,x)=>(
                                x.isGeneral?
                                    ((id,val)=>(
                                        [...arr.slice(0,id),val,...arr.slice(id+1)]
                                    ))(x.terrain,x.id)
                                :arr
                            ),
                            Array(it.length).fill(-1)
                        );
                        socket.event('game_update',{
                            turn,
                            map_diff:ot.makeDiff(old_map,map),
                            cities_diff:ot.makeDiff(old_cities,cities),
                            generals,
                            scores:it,
                            stars:[]
                        });
                    }
                    var disTurn='';
                    clearInterval(gameInv);
                    var toarr=[];
                    var gameInv=setInterval(()=>{
                        if(!this.inGame){
                            clearInterval(gameInv);
                            if(toarr){
                                for(let i of toarr){
                                    clearTimeout(i);
                                }
                            }
                        }
                        var te=document.querySelector('#turn-counter');
                        if(te){
                            var nowTT=te.innerText;
                            // console.log(nowTT);
                            var gt=Number(nowTT.replace(/\D/g,''));
                            if(disTurn!==nowTT){
                                toarr=[
                                    setTimeout(()=>{
                                        tick(gt*2-1);
                                    }),
                                    setTimeout(()=>{
                                        tick(gt*2);
                                    },500)
                                ];
                            }
                            disTurn=nowTT;
                        }
                    });
                }
                this.inGame=nowInGame;
            });
        });
    }
    getElIndex(el){
        for(let index in COLOR_PLAYERINDEX){
            if(el.classList.contains(index)){
                return COLOR_PLAYERINDEX[index];
            }
        }
        return TILE_EMPTY;
    }
    infoTable(){
        return [...document.querySelector('#game-leaderboard > tbody').children]
            .slice(1)
            .map(el=>({
                name:el.children[1].innerText,
                total:Number(el.children[2].innerText),
                tiles:Number(el.children[3].innerText),
                i:this.getElIndex(el.children[1]),
            }));
    }
    mapSize(){
        return [
            document.querySelector('#map > tbody').children[0].children.length,
            document.querySelector('#map > tbody').children.length
        ];
    }
    elList(){
        return [...document.querySelector('#map > tbody').children]
            .map(el=>[...el.children])
            .flat()
            .map((el,id)=>({
                terrain:(
                    el.classList.contains('mountain')?TILE_MOUNTAIN:(
                        el.classList.contains('fog')?(
                            el.classList.contains('obstacle')?
                            TILE_FOG_OBSTACLE
                            :TILE_FOG
                        )
                        :this.getElIndex(el)
                    )
                ),
                armies:Number(el.innerText.replace(/\D/g,'')),
                id,
                isCity:el.classList.contains('city'),
                isGeneral:el.classList.contains('general'),
                el:el
            }));
    }
    on(name,callback){
        if(!this.callback[name]){
            this.callback[name]=[];
        }
        this.callback[name].push(callback);
    }
    fireKeyEvent(el, evtType, keyCode){
        var doc = el.ownerDocument,
            win = doc.defaultView || doc.parentWindow,
            evtObj;
        if(doc.createEvent){
            if(win.KeyEvent) {
                evtObj = doc.createEvent('KeyEvents');
                evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
            }
            else {
                evtObj = doc.createEvent('UIEvents');
                Object.defineProperty(evtObj, 'keyCode', {
                    get : function() { return this.keyCodeVal; }
                });   
                Object.defineProperty(evtObj, 'which', {
                    get : function() { return this.keyCodeVal; }
                });
                evtObj.initUIEvent( evtType, true, true, win, 1 );
                evtObj.keyCodeVal = keyCode;
                if (evtObj.keyCode !== keyCode) {
                    console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
                }
            }
            el.dispatchEvent(evtObj);
        }
        else if(doc.createEventObject){
            evtObj = doc.createEventObject();
            evtObj.keyCode = keyCode;
            el.fireEvent('on' + evtType, evtObj);
        }
    }
    press(el,key){
        this.fireKeyEvent(el,'keydown',key.charCodeAt(0));
        this.fireKeyEvent(el,'keypress',key.charCodeAt(0));
        this.fireKeyEvent(el,'keyup',key.charCodeAt(0));
    }
    emit(name,...data){
        ({
            set_username(){},
            play(){
                document.querySelector('#main-menu > center > div.center > button.big').click();
                document.querySelector('#main-menu > center > div.popup-background > div > center > button:nth-child(1)').click();
			},
			join_1v1(){
                document.querySelector('#main-menu > center > div.center > button.big').click();
				document.querySelector('#main-menu > center > div.popup-background > div > center > button:nth-child(3)').click();
			},
			join_team(){
                document.querySelector('#main-menu > center > div.center > button.big').click();
				document.querySelector('#main-menu > center > div.popup-background > div > center > button:nth-child(5)').click();
				document.querySelector('#custom-queue-content > center > div:nth-child(4) > button').click();
			},
            set_force_start(id,state){
                var qaq=setInterval(()=>{
                    var el=document.querySelector('#custom-queue-content > center > button:nth-child(5)');
                    if(el){
                        if(el.classList.contains('inverted')^state)el.click();
                        clearInterval(qaq);
                    }
                });
            },
            attack(old,now,is50){
                function click(el){
                    el.dispatchEvent(new Event("touchstart"));
                    el.dispatchEvent(new Event("touchend"));
                }
                // console.log(old,now,is50);
                var ell=this.elList();
                var elo=ell[old].el;
                var eln=ell[now].el;
                // console.log(elo,eln);
                if(elo.classList.contains('attackable'))this.press(document.body,' ');
                if(!elo.classList.contains('selected'))click(elo);
                if(is50)click(elo);
                click(eln);
            },
            chat_message(msg){
                var input=document.querySelector('#chatroom-input');
                input.value=msg;
                this.press(input,'\r');
            },
            leave_game(){
                document.querySelector('#game-page > div.alert.center > center > button:nth-child(7)').click();
            },
        })[name].call(this,...data);
    }
    event(name,...data){
        var cb=this.callback[name];
        if(cb){
            for(let c of cb){
                c.call(this,...data);
            }
        }
    }
    makeDiff(old,now){
        var res=[];
        var tmp=[];
        var st=1;
        for(let i=0;i<now.length;i++){
            var nst=old[i]===now[i]?1:2;
            if(nst!==st){
                res.push(tmp.length);
                if(st===2)res.push(...tmp);
                st=nst;
                tmp=[];
            }
            tmp.push(now[i]);
        }
        res.push(tmp.length);
        if(st===2)res.push(...tmp);
        return res;
    }
};

function MAKE_AND(f, g) {
    return function() {
        return f.apply(this, arguments) && g.apply(this, arguments);
    };
}
function MAKE_OR(f, g) {
    return function() {
        return f.apply(this, arguments) || g.apply(this, arguments);
    };
}
function MAKE_NOT(f) {
    return function() {
        return !f.apply(this, arguments);
    };
}

class Debugger{
    static init(){
        this.codeS = 'abcdefgh';
        this.codeL = 'ABCDEFGH';
        var longest = 0;
        for (var s of Game.usernames) {
            longest=Math.max(longest,s.length);
        }
        this.tabledNames = Game.usernames.map(s=>s.padEnd(longest,' '));
    }
    static get turnStr(){
        return `[Turn ${Math.floor((Game.turn-1)/2)+1}:${(Game.turn - 1) % 2 + 1}]`;
    }
    static table(x){
        var res=[];
        for(let i=0;i<Game.height;i++){
            res.push(x.slice(i*Game.width,(i+1)*Game.width));
        }
        console.table(res.map(arr=>arr.map(x=>typeof x==='number'?Math.floor(x):x)));
    }
    static discribe(index) {
        var trValue = Game.terrain[index];
        switch (trValue) {
            case TILE_MOUNTAIN:
                return 'M';
            case TILE_FOG:
                return ' ';
            case TILE_FOG_OBSTACLE:
                return '?';
            case TILE_EMPTY: {
                if (Bot.isCity(index))
                    return '#';
                if (Game.armies[index] === 0)
                    return '.'
                    else return '+';
            }
            default:{
                if (Bot.isCity(index))
                    return this.codeL[trValue];
                if (this.isGeneral(index)) {
                    return Bot.isOwn(index) ? '$' : '!';
                }
                return this.codeS[trValue];
            }
   
        }
    }
    static vis(index) {
        var row = Math.floor(index / Game.width);
        var col = index % Game.width;
        return this.discribe(index) + '(' + row + ',' + col + ')';
    }
    static debug(res) {
        if (Game.totalArmy[Game.playerIndex] === 0)
			return;
		console.log('Mode:'+Bot.mode);
		if(typeof window==='undefined'){
			var chatWidth = 77 - Game.width;
			var showing = [];
			for (let chat of Game.messages) {
				while (chat !== '') {
					showing.push(chat.slice(0, chatWidth));
					chat = chat.slice(chatWidth);
				}
			}
			showing.reverse();
			console.log('\n');
			console.log(this.turnStr);
			var dstr = '|';
			for (let i in Game.terrain) {
				var index = Number(i);
				dstr += discribe(index);
				if ((Number(index) + 1) % Game.width === 0) {
					dstr += '|';
					var line = Math.floor(index / Game.width);
					if (line < Game.scores.length) {
						var itsP = Game.scores[line].i;
						dstr += '(' + this.codeS[itsP] + ')' + this.tabledNames[itsP] + ':' + Game.totalArmy[itsP] + '(' +
							Game.tiles[itsP] + ')';
					} else {
						var chatLine = Game.height - line - 1;
						if (chatLine < showing.length)
							dstr += showing[chatLine];
					} // if((Number(index)+1)%width === 0)
					console.log(dstr);
					dstr = '|';
				} // if
			} // for
			// console.log(dstr);
		}else{
			this.table(Game.armies.map((a,i)=>!Bot.isFog(i)?Bot.getTileValue(i,1):''));
		}
        if (Bot.nearestEnemyDistance!==Infinity)
            console.log(
                'Nearest enemy is ' + Bot.nearestEnemyDistance + ' tile' + ((Bot.nearestEnemyDistance > 1) ? 's' : '') +
                ' away.');
   
        // if (res) {
        //     console.log('Attacked from ' + vis(res[0][0]) + ' to ' + vis(res[0][1]) + '.(score:' + res[1] + ')');
        // } else {
        //     console.log('Did nothing.');
        // }
   
    } // function debug
};

const TILE_EMPTY = -1;
const TILE_MOUNTAIN = -2;
const TILE_FOG = -3;
const TILE_FOG_OBSTACLE = -4; // Cities and Mountains show up as Obstacles in the fog of war.
const CITY_TURN = 300;
const MODE_EXPEND='expend';
const MODE_ATTACK='attack';
const MODE_COLLECT='collect';
const DEFALT_MODE=MODE_EXPEND;
const STRATEGY_VALUE={
    [MODE_EXPEND]:{
        baseValue:20,
        cityDistance:0.3,
        enemyGeneralsDistance:1.0,
        enemyDistance:0.05,
        ownGeneralDistance:-0.1,
        edgeDistance:0.2,
        capatureValue:30,
		attackValue:30,
		viewValue:1.0,
		mergeValue:0,
    },
    [MODE_ATTACK]:{
        baseValue:20,
        cityDistance:0.1,
        enemyGeneralsDistance:2.0,
        enemyDistance:0.5,
        ownGeneralDistance:-0.2,
        edgeDistance:0,
        capatureValue:5,
        attackValue:30,
		viewValue:5.0,
		mergeValue:0.05,
	},
	[MODE_COLLECT]:{
        baseValue:20,
        cityDistance:0,
        enemyGeneralsDistance:0,
        enemyDistance:0.01,
        ownGeneralDistance:0.1,
        edgeDistance:-0.05,
        capatureValue:10,
		attackValue:0,
		viewValue:0.0,
		mergeValue:10.0,
	},
}
class Bot{
    static init(data){
        this.edgeDistance = [];
        this.ownGeneralDistance = [];
        this.enemyDistance = [];
        this.cityDistance = [];
        this.enemyGeneralsDistance = [];
        this.nearestEnemyDistance = Infinity;
        this.mode=DEFALT_MODE;
        this.generals=[];
        this.generalIndex=Game.generals[Game.playerIndex];
		this.lasts=[];
		this.explored=Array(Game.size).fill(false);
        socket.emit('chat_message', Game.chat_room, 'QAQ');
    }
    static checkMode(oldMode){
		if(this.nearestEnemyDistance===Infinity)return MODE_EXPEND;
		if(oldMode==MODE_COLLECT&&Game.armies[this.strongestArmy]<Game.totalArmy[Game.playerIndex]*0.1){
			return MODE_COLLECT;
		}
		if(oldMode==MODE_EXPEND&&Game.armies[this.strongestArmy]<Game.totalArmy[Game.playerIndex]*0.05){
			return MODE_COLLECT;
		}
		var maxPI=Game.playerIndex;
		for(let ter of Game.terrain){
			if(ter>=0&&Game.totalArmy[ter]>Game.totalArmy[maxPI]){
				maxPI=ter;
			}
		}
		return maxPI===Game.playerIndex?MODE_ATTACK:MODE_EXPEND;
    }
    static isOwn(index) {
        return Game.terrain[index] === Game.playerIndex
    }
    static isCapturable(index) {
        return Game.terrain[index] >= TILE_EMPTY || Game.terrain[index] === TILE_FOG
    }
    static isEmpty(index) {
        return Game.terrain[index] === TILE_EMPTY || Game.terrain[index] === TILE_FOG
    }
    static isCity(index) {
        return (Game.cities.indexOf(index) >= 0)
    }
    static isGeneral(index) {
        return (Bot.generals.indexOf(index) >= 0)
    }
    static isCaptured(index){
        return Bot.isCapturable(index)&&!Bot.isEmpty(index);
    }
    static isEnemy(index){
        return Bot.isCaptured(index)&&!Bot.isOwn(index);
	}
	static isFog(index){
		return Game.terrain[index]===TILE_FOG||Game.terrain[index]===TILE_FOG_OBSTACLE;
	}
    static seenByEnemy(index){
        return !Bot.aroundTiles(index).every(MAKE_NOT(Bot.isEnemy));
	}
	static isExplored(index){
		return Boolean(Bot.explored[index]);
	}
    static wantToCapture(mult) {
        return function(index) {
            return (Game.totalArmy[Game.playerIndex] - Game.tiles[Game.playerIndex] >= Game.armies[index] * mult) && Bot.isCapturable(index);
        }
    }
    static worthAttack(index,endIndex){
        // Too early.
        if (Game.turn < 24)
            return false;
        // Invalid move.
        if (Game.armies[index] <= 1) {
            // console.log('Army<=1');
            return false;
        }
        if (!this.isCapturable(endIndex)) {
            // console.log('End:Mountain');
            return false;
        }
       
        if (!this.isOwn(endIndex)) {
            var armyAround = 0;
            var ch = this.toTiles(endIndex);
            for (var i in ch) {
                var armyIndex = Number(ch[i]);
                if (this.isOwn(armyIndex)) {
                    if (Game.armies[index] < Game.armies[armyIndex])
                        return false;//Use the strongest army to attack.
                    armyAround += (Game.armies[armyIndex] - 1);
                } else if (this.isEnemy(armyIndex) && !this.isEnemy(endIndex)) {
                    armyAround -= (Game.armies[armyIndex] - 1);
                }
            }
   
            // console.log(vis(endIndex),armyAround);
            var need = Game.armies[endIndex];
            if (this.seenByEnemy(endIndex) && !this.isEnemy(endIndex)) {
                need *= 5;
            } // if
            if (armyAround < need + 1) {
                return false;
            }
        }//if(!this.isOwn(endIndex))
        return true;
    }
    static getTileValue(index,army){
        var valueTable=STRATEGY_VALUE[this.mode];
        // console.log(index,army,endArmy);
        if(Game.terrain[index]===TILE_FOG||Game.terrain[index]===TILE_FOG_OBSTACLE)return 0;
        if(Game.terrain[index]===TILE_MOUNTAIN)return 0;
        var value=valueTable.baseValue;
        if(this.isCity(index)&&!this.isOwn(index)){
            if(Game.turn<=CITY_TURN){
                return 0;
            }else{
                value+=Game.turn/8;
            }
        }
        function distanceValue(distanceTable){
            return Math.min(100,100/Math.sqrt(distanceTable[index]+1));
        }
        if(Game.turn>CITY_TURN){
            value+=valueTable.cityDistance*distanceValue(this.cityDistance);
        }
        value+=valueTable.enemyGeneralsDistance*distanceValue(this.enemyGeneralsDistance);
        if(this.isEnemy(index)){
            value+=valueTable.ownGeneralDistance*distanceValue(this.ownGeneralDistance);
        }else{
            value+=valueTable.edgeDistance*distanceValue(this.edgeDistance);
        }
        value+=valueTable.enemyDistance*distanceValue(this.enemyDistance);
        if(!this.isOwn(index))value+=valueTable.capatureValue;
		if(this.isEnemy(index))value+=valueTable.attackValue;
		value+=this.aroundTiles(index).filter(
			MAKE_AND(
				this.isCapturable,
				MAKE_NOT(this.isExplored)
			)).length
			*valueTable.viewValue;
        return value*army;
    }
    static toTiles(index){
        var result = [];
        var row = Math.floor(index / Game.width);
        var col = index % Game.width;
        if (col > 0) { // left
            result.push(index - 1);
        }
        if (col < Game.width - 1) { // right
            result.push(index + 1);
        }
        if (row < Game.height - 1) { // down
            result.push(index + Game.width);
        }
        if (row > 0) { // up
            result.push(index - Game.width);
        }
        return result;
    }
    static aroundTiles(index){
        var result=[];
        var row = Math.floor(index / Game.width);
        var col = index % Game.width;
        for(let i=(row>0?-Game.width:0);
            i<=(row<Game.height-1?Game.width:0);
            i+=Game.width){
            for(let j=(col>0?-1:0);j<=(col<Game.width-1?1:0);j++){
                if(i||j)result.push(index+i+j);
            }
        }
        return result;
    }
    static BFS(start, access) {
        var res = {};
        res.distance = new Array(Game.size).fill(Infinity);
        var visited = new Array(Game.size).fill(false);
   
        var queue = [];
        for (var i in Game.terrain) {
            index = Number(i);
            if (start(index)) {
                queue.push(index);
                res.distance[index] = 0;
                visited[index] = true;
            }
        }
   
        while (queue.length > 0) {
            var now = queue.shift();
            var ch = this.toTiles(now);
            for (var i in ch) {
                var index = ch[i];
                if (!visited[index] && access(index)) {
                    queue.push(index);
                    res.distance[index] = res.distance[now] + 1;
                    visited[index] = true;
                }
            }
        }
        return res;
    }
    static update(data) {
        // Remember generals.
        var old_generals=this.generals;
        this.generals = Game.generals;
        for(let i in Game.generals){
            if(this.generals[i]===-1&&typeof old_generals[i]!=='undefined'){
                this.generals[i]=old_generals[i];
            }
		}
		
        for(let item of Game.scores){
            if(item.lose){
                this.generals[item.i]=-1;
            }
		}
		
		for(let i in Game.terrain){
			if(!this.isFog(i)){
				this.explored[i]=true;
			}
		}

		function citySatisfy(index){
			if(!Bot.isCity(index)||Bot.isOwn(index))return false;
			if(Bot.isEnemy(index))return true;
			if(Game.turn>CITY_TURN&&Bot.wantToCapture(4 / 3)(index)){
				if(Bot.isEmpty(index)){
					return !Bot.seenByEnemy(index);
				}else{
					return true;
				}
			}
		}

        // BFS to get the distances.
        this.ownGeneralDistance = this.BFS(MAKE_AND(this.isOwn, this.isGeneral),this.isCapturable).distance;
   
        this.edgeDistance = this.BFS(
			MAKE_AND(
				MAKE_NOT(this.isOwn),
				MAKE_AND(
					this.wantToCapture(4 / 3),
					MAKE_OR(
						MAKE_NOT(this.isCity),
						citySatisfy
					)
				)
			),this.isOwn).distance;
   
        this.enemyDistance = this.BFS(this.isEnemy,this.isCapturable).distance;
   
        this.cityDistance = this.BFS(
            citySatisfy,
            this.isCapturable
        ).distance; // Cities
                                                                                                    // distance
        this.enemyGeneralsDistance = this.BFS(
            MAKE_AND(
                MAKE_AND(this.isGeneral, this.wantToCapture(1)),
                MAKE_NOT(this.isOwn)
            ), this.isCapturable).distance; // Enemy generals distance
   
        this.nearestEnemyDistance = this.enemyDistance[Bot.generalIndex];
   
        this.strongestArmy = Bot.generalIndex;
        for (let index in Game.terrain) {
            if (this.isOwn(index) && (Game.armies[index] > Game.armies[this.strongestArmy])) {
                this.strongestArmy = index;
            }
        }
    }
    static think(move) {
        var index = move[0];
		var endIndex = move[1];
		var valueTable=STRATEGY_VALUE[this.mode];
        if(!this.worthAttack(index,endIndex))return -Infinity;
		var value = 0;
		var indexArmy=Game.armies[index];
		var endIndexArmy=Game.armies[endIndex];
        value+=this.getTileValue(endIndex,indexArmy);
        value-=this.getTileValue(index,indexArmy);
		if(this.isOwn(endIndex)&&indexArmy>=endIndexArmy)value+=valueTable.mergeValue*(indexArmy-1)*(endIndexArmy-1);
        if(move[0]===this.last)value=value+1;
        return value;
    }
    static decide() {
        // Make a move.
        this.mode=this.checkMode(this.mode);
        var best = [-1,0];
        var bestValue = -Infinity;
        for (var id in Game.terrain) {
            var index = Number(id);
            // Pick a tile.
            // If we own this tile, make some moves starting from it.
            if (this.isOwn(index)) {
                // console.log(vis(index));
                var ch = this.toTiles(index);
                // for(var i in ch)console.log('L',vis(ch[i]));
                for (var i in ch) {
                    var move = [index, ch[i]];
                    var value = this.think(move);
                    if (value > bestValue) {
                        bestValue = value;
                        best = move
                    };
                }
            }
		} // for
			
		if (best[0] !== -1){
			if (this.lasts.length >= 10)
				this.lasts.shift();
			this.lasts.push(best[0]);
		}
        this.last=best[1];
        return [best, bestValue]; // Attacked.
    }
};

class Game{
	static init(data) {
        // Game data.
		this.humanControl=false;
		this.keepPlaying=true;
        this.playerIndex = data.playerIndex;
        this.chat_room = data.chat_room;
        this.messages = [];
        this.usernames = data.usernames;
        this.updated=false;
        this.replay_url = 'http://bot.generals.io/replays/' + encodeURIComponent(data.replay_id);
	}
    static update(data){
        function patch(old, diff) {
            var out = [];
            var i = 0;
            while (i < diff.length) {
                if (diff[i]) { // matching
                    Array.prototype.push.apply(out, old.slice(out.length, out.length + diff[i]));
                }
                i++;
                if (i < diff.length && diff[i]) { // mismatching
                    Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
                    i += diff[i];
                }
                i++;
            }
            return out;
        }
        this.cities = patch(this.cities, data.cities_diff);
        this.map = patch(this.map, data.map_diff);
        this.generals = data.generals;
        if (!this.updated) {
            this.turn = 0;
            this.width = this.map[0];
            this.height = this.map[1];
            this.size = this.width*this.height;
            this.map = [];
            this.cities = [];
            Bot.init();
            this.updated=true;
        }
        /* The first two terms in |map| are the dimensions.
        ** The next |size| terms are army values.
        ** armies[0] is the top-left corner of the map.
        ** The last |size| terms are terrain values.
        ** terrain[0] is the top-left corner of the map.
        */
        this.armies = this.map.slice(2, this.size + 2);
        this.terrain = this.map.slice(this.size + 2, this.size + 2 + this.size);
        this.scores = data.scores;
        this.turn = data.turn;
   
        this.tiles = [];
        this.totalArmy = [];
        this.rank=[];
        for (var i in this.scores) {
            this.tiles[this.scores[i].i] = this.scores[i].tiles;
            this.totalArmy[this.scores[i].i] = this.scores[i].total;
            this.rank[this.scores[i].i] = Number(i);
        }
        Bot.update(data);
    }
    static register(){
        var socket=typeof window==='undefined'?
            require('socket.io-client')('http://botws.generals.io')
            :new Socket();
        socket.on('connecting', function() {
            console.log('Connecting to server...');
        });
        socket.on('connect', function() {
            console.log('Connected to server.');
        });
        socket.on('connect_failed', function() {
            console.log('Connect failed.');
        });
        socket.on('disconnect', function() {
            console.error('Disconnected from server.');
        });
        socket.on('reconnecting', function() {
            console.log('Reconnecting to server...');
        });
        socket.on('reconnect', function() {
            console.log('Reconnected to server.');
        });
        socket.on('reconnect_failed', function() {
            console.log('Reconnected failed.');
        });
        socket.on('game_start', function(data) {
            // Get ready to start playing the game.
            Game.init(data);
            Debugger.init();
            console.log('Game starting!\nThe replay will be available after the game at\n' + Game.replay_url);
        });
        socket.on('game_update', function(data) {
            Game.update(data);
            console.groupCollapsed(Debugger.turnStr);
            var res = Bot.decide();
            if (doDebug) {
                Debugger.debug(res);
            }
            var choice=res[0];
            if(!Game.humanControl&&choice[0]!==-1){
                socket.emit('attack', choice[0], choice[1],false);
            }
            console.groupEnd();
        });
        socket.on('chat_message', function(c, data) {
            if (c === Game.chat_room) {
                var logStr = Debugger.turnStr;
                if (data.playerIndex >= 0)
                    logStr += '(' + Debugger.codeS[data.playerIndex] + ')';
                if (data.username)
                    logStr += data.username + ':';
                logStr += data.text;
                Game.messages.push(logStr);
            }
        });
        socket.on('connect', function() {
            // Set the username for the bot.
            socket.emit('set_username', user_id, username);
            Game.startGame(gameType);
        });
        socket.on('game_lost', function(data) {
            console.log(Debugger.turnStr + 'Defeated by ' + Game.usernames[data.killer] + '.');
            Game.gameEnd();
        });
        socket.on('game_won', function(data) {
            console.log(Debugger.turnStr + 'Won the game!');
            Game.gameEnd();
        });
        return socket;
    }
    static startGame(gameType) {
        switch (gameType) {
            case 'Custom': {
                socket.emit('join_private', custom_game_id, user_id);
                setInterval(() => {
                    socket.emit('set_force_start', custom_game_id, true);
                }, 2500);
                console.log('Joined custom game at http://bot.generals.io/games/' + encodeURIComponent(custom_game_id));
                break;
            }
            case 'FFA': {
                socket.emit('play', user_id);
                setInterval(() => {
                    socket.emit('set_force_start', null, true);
                }, 2500);
                console.log('Joining a FFA game...');
                break;
            }
            case '1v1': {
                socket.emit('join_1v1', user_id);
                console.log('Joining a 1v1 game...');
                break;
            }
            case '2v2': {
                socket.emit('join_team',null, user_id);
                console.log('Joining a 2v2 game...');
                break;
            }
        }
    }
    static gameEnd() {
        console.log('Game ending!\nThe replay url is ' + Game.replay_url);
        socket.emit('leave_game');
		this.chat_room = null;
		if(Game.keepPlaying){
      		Game.startGame(gameType);
		}else{
        	if(typeof process!=='undefined')process.exit(0);
		}
    }
};
const socket=Game.register();
```

</fold-block>