const ADD='(O=>I=>(O+I))';
const CALL='(O=>I=>O(I))';
const FREV='(I=>O=>O(I))';
const I='(I=>I)';

const MAX_DEP=6;

function ecall(f,x,dep){
	if(dep>=MAX_DEP){
		return `(${f}(${x}))`;
	}else{
		if(Math.random()<0.5)return ecall(ecall(CALL,f,dep+2),x,dep+1);
		else return ecall(ecall(FREV,x,dep+1),f,dep+2);
	}
}

function evalue(x,dep){
	if(dep>=MAX_DEP){
		return x;
	}else{
		return ecall(I,x,dep+2);
	}
}

function estr(msg,dep){
	if(dep>=MAX_DEP){
		return `'${msg.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')}'`;
	}
	if(msg.length>1){
		let pos=Math.floor(Math.random()*(msg.length-1))+1;
		return ecall(ecall(ADD,estr(msg.slice(0,pos),dep+1),dep+2),estr(msg.slice(pos),dep+1),dep+2);
	}else{
		return evalue(`'${msg.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')}'`,dep+3);
	}
}

function encode(){
	this.qwq=estr(this.qaq,0);
}

function decode(){
	var x;
	try{
		x=eval(this.qwq);
	}catch(e){
	}finally{
		this.qaq=x;
	}
}

var app=new Vue({
	el:'#app',
	data:{
		qaq:'',
		qwq:'',
	},
	methods:{
		encode,
		decode,
	}
});