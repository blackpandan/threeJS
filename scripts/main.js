// imports
import * as THREE from "https://cdn.skypack.dev/three@0.128.0";
import {OBJLoader} from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js";
import {MTLLoader} from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js";
import {STLLoader} from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/STLLoader.js";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import {TransformControls} from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/TransformControls.js";

const canvas = document.querySelector("#c");
const des = document.querySelector("#des");
const desText = document.querySelector("#desText");
const desImg = document.querySelector("#desImg");
const selector = document.querySelector("#collector");
const indicator = document.querySelector("#indicator");

canvas.style.visibility = "hidden";
selector.addEventListener("change", function(){
	indicator.textContent = this.files[0].name;
	if (this.files[0].type == "image/png"){
		
		console.log("yes image has been loaded");
		console.log(this.files[0]);
		canvas.style.zIndex = "1";
		canvas.style.visibility = "hidden";
		des.style.visibility = "visible";
		des.style.zIndex = "2";
		desText.style.display = "none";
		if (desImg.style.display == "none"){
			desImg.style.display = "block";
		}
		desImg.style.maxWidth = "60vmin";
		desImg.src = URL.createObjectURL(this.files[0]); 


	
	}else if(this.files[0].type == "application/sla"){
		
		canvas.style.zIndex = "2";
		canvas.style.visibility = "visible";
		des.style.visibility = "hidden";
		des.style.zIndex = "1";
		const selectedFile = URL.createObjectURL(document.querySelector("#collector").files[0]);
		console.log("changed ooo");
		console.log(selectedFile);
		console.log(typeof(selectedFile));
		loadee(selectedFile);
	
	}else {	
		if (desText.style.display == "none"){
			console.log("yeah its none");
			desText.style.display = "block";
		}
		desImg.style.display = "none";
		console.log("not valid");
		canvas.style.zIndex = "1";
		canvas.style.visibility = "hidden";
		des.style.visibility = "visible";
		des.style.zIndex = "2";
		desText.textContent = " please select a .stl file or a png file";	
	}
});

const scene = new THREE.Scene();
scene.background = null;

const fov = 70;
const near = 0.001;
const far = 10000;

const camera = new THREE.PerspectiveCamera(fov, canvas.clientWidth / canvas.clientHeight, near, far); 
scene.add( camera );

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.35 );
scene.add( ambientLight );
const light = new THREE.HemisphereLight(0xffffff, 1.0);
scene.add( light )

const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

window.addEventListener("resize", function(){
	console.log("yes i resized");
	var width = canvas.clientWidth;
	var height = canvas.clientHeight;
	//renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

const orbit = new OrbitControls(camera, canvas);
orbit.update();
				orbit.addEventListener( 'change', animate );

				const control = new TransformControls( camera, renderer.domElement );
				control.addEventListener( 'change', animate );

				control.addEventListener( 'dragging-changed', function ( event ) {

					orbit.enabled = ! event.value;

				} );



const mtlLoader = new MTLLoader();
const stlLoader = new STLLoader();

const material = new THREE.MeshPhongMaterial({
    color: 0xff5533,
		specular: 100,
		shininess: 100,
});


function loadee(source){
			console.log("source: " + source['blob']);
			stlLoader.load(
				source,
				function(geometry){

					let mesh = new THREE.Mesh(geometry, material);
					mesh.name = "bound";
					scene.remove(scene.getObjectByName("bound"));
					let middle = new THREE.Vector3();
					geometry.computeBoundingBox();
					geometry.boundingBox.getCenter(middle);
					scene.add(mesh);
					mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z ) );
					const largestDimension = Math.max(geometry.boundingBox.max.x,geometry.boundingBox.max.y,geometry.boundingBox.max.z)
					camera.position.z = largestDimension * 1.5;
				}
			)
		animate();
	};




//const geometry = new THREE.BoxGeometry(1, 1, 1);

//const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});

//const cube = new THREE.Mesh(geometry, material);

//scene.add(cube);

function animate(){

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	requestAnimationFrame(animate);
	renderer.render(scene, camera)

};
