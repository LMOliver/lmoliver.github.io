function go(incode){
	let code=[];

	let x=incode.split('\n').filter(s=>s.length>0);

	let mp=new Map();

	let tabLevel=0;
	function pushCode(c){
		code.push('\t'.repeat(tabLevel)+c);
	}

	function setV(name,type,value){
		let s=`${name}=${value};`;
		if(/^\w+$/.test(name)&&!mp.has(name)){
			s=type+' '+s;
		}
		mp.set(name,type);
		pushCode(s);
	}

	function output(value,type,br){
		if(value===''){
			if(br){
				pushCode(`printf("\\n");`);
			}else{
				pushCode(`printf(" ");`);
			}
		}else if(type===''){
			pushCode(`cout<<${value}${br?'<<endl':''};`);
		}else{
			if(type==='LL'){
				pushCode(`printf("%lld${br?'\\n':''}",${value});`);
			}else{
				pushCode(`cout<<${value}${br?'<<endl':''};`);
			}
		}
	}

	const ACTION={
		'='(name='n',value='readLL()',type='LL'){
			setV(name,type,value);
		},
		'<'(value='',type=''){
			output(value,type,false);
		},
		'<<'(value='',type=''){
			output(value,type,true);
		},
		'.'(name='i',start='1',end='n',step='1'){
			pushCode(`for(int ${name}=${start};${name}<=${end};${name}+=${step}){`);
			tabLevel++;
		},
		','(name='i',start='1',end='n',step='1'){
			pushCode(`for(int ${name}=${start};${name}>=${end};${name}-=${step}){`);
			tabLevel++;
		},
		'/'(){
			if(tabLevel>0){
				tabLevel--;
				pushCode('}');
			}else{
				pushCode('// }');
			}
		},
		'?'(cond='rand()&1'){
			pushCode(`if(${cond}){`);
			tabLevel++;
		},
		':'(cond='true'){
			tabLevel--;
			pushCode(`}else${cond!=='true'?` if(${cond})`:''}{`);
			tabLevel++;
		},
		'%'(...text){
			if(text.length===0){
				text=['Orz Siyuan!'];
			}
			pushCode(`printf("${text.join(' ').replace(/\\/g,'\\\\').replace(/\"/g,'\\"')}");`);
		},
		'%%'(...text){
			if(text.length===0){
				text=['Orz Siyuan!'];
			}
			pushCode(`puts("${text.join(' ').replace(/\\/g,'\\\\').replace(/\"/g,'\\"')}");`);
		},
		'#'(...text){
			pushCode(`/* ${text.join(' ')} */`);
		},
	};

	for(let s of x){
		let [op,...p]=s.split(/\s/).filter(x=>x!=='');
		let a=ACTION[op];
		if(typeof a!=='undefined'){
			a(...p);
		}else{
			let c=s+(s.substr(-1)===';'?'':';');
			pushCode(c.trim());
		}
	}

	while(tabLevel>0){
		ACTION['/']();
	}

	pushCode('return 0;');

	return [
		'#include<bits/stdc++.h>',
		'using namespace std;',
		'typedef long long LL;',
		'LL readLL(){',
		'\tLL x;',
		'\tscanf("%lld",&x);',
		'\treturn x;',
		'}',
		'int main(){',
		...(code.map(c=>'\t'+c)),
		'}',
	].join('\n');
}

var app=new Vue({
	el:'#app',
	watch:{
		i(v){
			localStorage.setItem('demo-solve-code',v);
			this.out=go(v);
		}
	},
	data:{
		i:null,
		out:'',
	},
	created(){
		let v=localStorage.getItem('demo-solve-code');
		if(v){
			this.i=v;
		}else{
			this.i=`# 自己探索

= a 1
= b 2 LL

% a+b=
<< a+b

< "a-b="
<< a-b LL

? a>b
	%% a>b
: a==b
	%% a=b
:
	%% a<b
/

=
static LL c[100]={0}
.
	= c[i]
/

.
	. j 1 n-i
		? c[j]>c[j+1]
			= t c[j]
			= c[j] c[j+1]
			c[j+1]=t;
		/
	/
/

.
	< c[i]
	? i==n
	<<
	:
	<
`;
		}
	}
});
