window.loadScript=(src,...backUps)=>{
	let element=document.createElement('script');
	element.setAttribute('src',src);
	element.addEventListener('error',()=>{
		loadScript(...backUps);
	});
	document.body.appendChild(element);
}