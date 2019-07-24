const RANGE=11;
const SIZE=30;
function XY2RoomName(x,y){
	return (x>=0?`E${x}`:`W${-x-1}`)+(y>=0?`N${y}`:`S${-y-1}`);
}
var app=new Vue({
	el:'#app',
	computed:{
		range(){
			var s=[];
			for(let i=-RANGE;i<RANGE;i++)s.push(i);
			return s;
		},
	}
});