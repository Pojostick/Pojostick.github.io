var scene;
var camera;
var renderer;

function init_scene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

init_scene();

THREE.ImageUtils.crossOrigin = '';
var texture = THREE.ImageUtils.loadTexture("http://3.bp.blogspot.com/-glz98d_0Irk/UIkSrLOwoxI/AAAAAAAAB2w/_6_H6QOUwlY/s1600/TRU_Cobble_Maple+Leaves.jpg");
var normal = THREE.ImageUtils.loadTexture("http://4.bp.blogspot.com/-UO0SHnpUphU/UIkT0Xi71kI/AAAAAAAAB24/zI0nb76d6pc/s1600/Bitmap2Material_Normal.jpg");

var uniforms = {
	tex : {type:'t',value:texture},
	norm: {type:'t',value:normal},
	minres : {type: 'f',value:Math.min(window.innerWidth,window.innerHeight)},
	maxres : {type: 'f',value:Math.max(window.innerWidth,window.innerHeight)},
	gamma : {type: 'f',value:2.5},
	natural : {type: 'f',value:2.0},
	light: {type: 'v4',value:new THREE.Vector4(0.0, 0.0, 0.1, 0.0)},
	lamp: {type: 'v4',value:new THREE.Vector4(0.0, 0.0, 1.0, 0.0)}
}
var shaderCode = document.getElementById("fragmentShader").textContent;
var material = new THREE.ShaderMaterial({uniforms:uniforms,fragmentShader:shaderCode})
var geometry = new THREE.PlaneGeometry(10, 10);

var lastMouse = 1;
var lastGamma = 2.5;

scene.add(new THREE.Mesh(geometry,material));

camera.position.z = 2;

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();

document.onmousemove = function(event){
	uniforms.light.value.x = event.pageX; 
	uniforms.light.value.y = event.pageY; 
}

document.getElementById("render").onmousedown = function(event){
	lastMouse = event.which;
    switch (lastMouse) {
        case 1:
			if(uniforms.gamma.value) {
				lastGamma = uniforms.gamma.value;
				uniforms.gamma.value = 0.0;
			}
			else uniforms.gamma.value = lastGamma;
            break;
        case 3:
			uniforms.lamp.value.x = event.pageX; 
			uniforms.lamp.value.y = event.pageY; 
            break;
	}
}

document.getElementById("render").oncontextmenu = function(event){
	event.preventDefault();
}

document.getElementById("render").addEventListener('mousewheel',function(event){
    mouseController.wheel(event);
    return false; 
}, false);

if (document.getElementById("render").addEventListener) {
	document.getElementById("render").addEventListener("mousewheel", mousewheel, false);
	document.getElementById("render").addEventListener("DOMMouseScroll", mousewheel, false);
}
else document.getElementById("render").attachEvent("onmousewheel", mousewheel);

function mousewheel(event) {
	var e = window.event || event;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	switch (lastMouse) {
        case 1:
			uniforms.gamma.value += delta / 10.0;
			break;
        case 3:
			uniforms.natural.value += delta / 10.0;
            break;
	}
}