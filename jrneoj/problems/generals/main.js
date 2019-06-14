const fs=require('fs');
const exec=require('child_process').exec;
exec('g++ gen.cpp -Wall -Wextra -std=c++11 -o gen.exe',{},(error,stdout,stderr)=>{
	if(stderr!==''){
		console.log(stderr);
	}else{
		fs.unlink('./data.txt',()=>{
			fs.unlink('./io.log',()=>{
				exec('node io.js | ./gen.exe > data.txt');
			});
		});
	}
});