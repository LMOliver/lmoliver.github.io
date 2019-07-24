let camera={
	pos:{x:0,y:0.5,z:-2},
};
const R=2;
let points=[
	{pos:{x:R,y:0,z:2}},
	{pos:{x:-R,y:0,z:2}},
	{pos:{x:0,y:R,z:2}},
	{pos:{x:0,y:-R,z:2}},
	{pos:{x:0,y:0,z:2+R}},
	{pos:{x:0,y:0,z:2-R}},

	{pos:{x:R,y:2*R,z:2+R}},
	{pos:{x:-R,y:2*R,z:2+R}},
	{pos:{x:-R,y:2*R,z:2-R}},
	{pos:{x:R,y:2*R,z:2-R}},

	{pos:{x:R,y:0,z:2+R}},
	{pos:{x:-R,y:0,z:2+R}},
	{pos:{x:-R,y:0,z:2-R}},
	{pos:{x:R,y:0,z:2-R}},

	{pos:{x:R,y:-2*R,z:2+R}},
	{pos:{x:R,y:-2*R,z:2-R}},
	{pos:{x:-R,y:-2*R,z:2-R}},
	{pos:{x:-R,y:-2*R,z:2+R}},
];
let polys=[];
for(let i=0;i<8;i++){
	polys.push([points[(i>>0)&1],points[2+((i>>1)&1)],points[4+((i>>2)&1)]]);
}
let paths=[];
for(let c=0;c<3;c++){
	let p=[];
	for(let i=0;i<4;i++){
		p.push(points[6+c*4+i]);
	}
	paths.push(p);
}
function convertX(x){
	return 300+x*150;
}
function convertY(y){
	return 300-y*150;
}
function printPos(pos){
	let xpos=sub(pos,camera.pos);
	let fpos=mul(xpos,1.0/xpos.z);
	return {
		x:convertX(fpos.x),

		y:convertY(fpos.y),
	};
}
function printStr(pos,c){
	let pp=printPos(pos);
	return `${pp.x}${c}${pp.y}`;
}
function printPoly(poses){
	return poses.map(p=>printStr(p,',')).join(' ');
}
function printPath(poses){
	return poses.map((p,i)=>`${i==0?'M':'L'}${printStr(p,' ')} `).join('')+'Z';
}
function printX(pos){
	return printPos(pos).x;
	// return (pos.y-camera.pos.y)+(pos.z-camera.pos.z)*0.15;
}
function printY(pos){
	return printPos(pos).y;
	// return (pos.x-camera.pos.x)+(pos.z-camera.pos.z)*0.3;
}
function sub(pos1,pos2){
	return {
		x:pos1.x-pos2.x,
		y:pos1.y-pos2.y,
		z:pos1.z-pos2.z,
	};
}
function len(pos){
	return Math.sqrt(pos.x**2+pos.y**2+pos.z**2);
}
function dist(pos1,pos2){
	return len(sub(pos1,pos2));
}
function mul(pos,r){
	return {
		x:pos.x*r,
		y:pos.y*r,
		z:pos.z*r,
	};
}
let q=[];
let data={
	points,
	camera,
	q,
};
let app=new Vue({
	el:'#app',
	data,
});

function a(){
	// points.forEach(p=>{
	// 	let a=2*Math.PI*0.003;
	// 	[p.pos.x,p.pos.z]=[
	// 		p.pos.x*Math.cos(a)+(p.pos.z-2)*Math.sin(a),
	// 		(p.pos.z-2)*Math.cos(a)-p.pos.x*Math.sin(a)+2,
	// 	];
	// });
	function avgD(points){
		let result=0;
		for(let p of points){
			result+=len(sub(p.pos,camera.pos));
		}
		result/=points.length;
		return result;
	}
	polys.sort((p1,p2)=>{
		let z1=avgD(p1);
		let z2=avgD(p2);
		if(Math.abs(z1-z2)<1e-6)return 0;
		else if(z1<z2)return 1;
		else return -1;
	});
	while(q.length>0&&Date.now()-q[0]>=1000){
		q.shift();
	}
	q.push(Date.now());
	requestAnimationFrame(a);
}
a();