const https=require('https');
const qs=

function apiGet(x){
	return new Promise((resolve,reject)=>{
		https.get(`https://screeps.com/api/${x}`, (res) => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);

			var data='';
			res.on('data', (d) => {
				data+=d;
			});
			res.on('end',()=>{
				resolve(data);
			});
		}).on('error', (e) => {
			reject(e);
		});
	});
}

function apiPost(x,d){
	return new Promise((resolve,reject)=>{

	});
}

apiGet('user/stats')
.then(r=>{
	console.log(r);
})
.catch(e=>{
	console.error(e);
});