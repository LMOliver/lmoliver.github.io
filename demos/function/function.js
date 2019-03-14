function prettyNumber(num){
	if(num===0)return '0';
	if(Math.abs(num)>=1e6||Math.abs(num)<1e-3){
		return num.toExponential(3)
			.replace(/([+-]?\d*(\.\d*)?)e\+?(-?\d*)/g,'{{$1}\\times 10^{$3}}');
	}
	if(Number.isSafeInteger(num))return num.toString();
	return num.toFixed(3).replace(/(\d)0+$/,'$1');
}

class Poly{
	constructor(){
		this.arr=[];
	}
	value(t){
		var sum=0;
		for(let i in arr){
			sum+=arr[i]*Math.pow(t,i);
		}
		return sum;
	}
	toString(){
		
	}
};

var app=new Vue({
	el:'#app',
	computed:{
		html(){
			return katex.renderToString(this.tex);
		},
		tex(){
			return `
x=${prettyNumber(this.x)}\\\\
t=${prettyNumber(this.t)}\\\\
\\begin{aligned}
F(t)&={${prettyNumber(this.x)}}^{${prettyNumber(this.t)}}\\\\
&= ${prettyNumber(Math.pow(this.x,this.t))}
\\end{aligned}`;
		},
		x(){
			return Number(this.ix);
		},
	},
	data:{
		ix:'1',
		t:0,
	},
});

setInterval(() => {
	app.t+=0.1;
}, 50);
