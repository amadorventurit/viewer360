// Scenes Array 
const scenes = [
    {
        slug : 'first',
        meshPath : 'images/v1.jpg',
        objects : [
            {
                id : 0,
                objectData : {target:"second", isClicklable:true},
                position : {x:30,y:0,z:0}
            },
            {
                id : 1,
                objectData : {target:"third", isClicklable:true},
                position : {x:10,y:0,z:25}
            }
        ]           
        
    },{
        slug : 'second',
        meshPath : 'images/v2.jpg',
        objects : [
            {
                id : 0,
                objectData : {target:"third", isClicklable:true},
                position : {x:30,y:0,z:0}
            },
            {
                id : 1,
                objectData : {target:"first", isClicklable:true},
                position : {x:10,y:0,z:25}
            }
        ]           
        
    },{
        slug : 'third',
        meshPath : 'images/v3.jpg',
        objects : [
            {
                id : 0,
                objectData : {target:"second", isClicklable:true},
                position : {x:30,y:0,z:0}
            },
            {
                id : 1,
                objectData : {target:"first", isClicklable:true},
                position : {x:10,y:0,z:25}
            }
        ]           
        
    }
]

// Init scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



// Init camera settings
camera.position.set(0,0,0);
camera.lookAt(10,0,0);

// Init controls
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(camera.position.x + .1, camera.position.y, camera.position.z);

controls.rotateSpeed = -0.2;
controls.enableDamping = true;
controls.dampingFactor = .3;

/* Create 3D Sphere Container */ 
var geometry = new THREE.SphereBufferGeometry(50,32,32);
var material = new THREE.MeshLambertMaterial({color:0x00ff00});


function loadScene(sceneSlug){
    if(!sceneSlug){
        sceneSelected = scenes[0];        
    }else{
        scenes.forEach(function(el, i){
            if(el.slug === sceneSlug){
                sceneSelected = el;
            }
        })
    }

    /*Load Mesh from selected scene*/

    loadNewMesh(sceneSelected.meshPath);

    /* Load scene indicators */

    sceneSelected.objects.forEach(function(el){
        var geometryIndicator = new THREE.SphereBufferGeometry(3, 32, 32);
        geometryIndicator.scale(0.3, 0.3, 0.3);
        var materialIndicator = new THREE.MeshLambertMaterial({color:0x00ff00});
        var indicator = new THREE.Mesh(geometryIndicator, materialIndicator); 
        /* Dinamyc data */
        indicator.objectData = el.objectData;
        indicator.position.set(el.position.x,el.position.y,el.position.z);

        scene.add(indicator);       
    });

}

loadScene();



function loadNewMesh(photoPath){
    var loader = new THREE.TextureLoader();
    loader.load(
        photoPath,

        function (texture) {

            if(mesh != null){
                scene.remove(mesh);
            }

            var material = new THREE.MeshBasicMaterial({
                map: texture
            });

            var geometry = new THREE.SphereBufferGeometry(3, 32, 32);
            geometry.scale(-10, 10, 10);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            mesh.position = camera.position;
            scene.add(mesh);


            renderer.render(scene, camera);

        }

    );
}



/* Light */

var light = new THREE.PointLight(0xffffff, 2,100);
light.position.set(0,0,0);
scene.add(light);

renderer.render( scene, camera );


animate();

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}



/* Fix on resize */
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onDocumentMouseDown( event ) {

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

		var datos = intersects[ 0 ].object.objectData;

        if(datos.isClicklable){

            loadScene(datos.target);           
        }

	}

	renderer.render( scene, camera );
    

}
window.addEventListener('click', onDocumentMouseDown, false);




function onDocumentMouseOver( event ) {

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

		var datos = intersects[ 0 ].object.objectData;

        if(typeof datos !== 'undefined'){
            if(datos.isClicklable){
                document.getElementsByTagName("body")[0].style.cursor = 'pointer';            
            }else{
                document.getElementsByTagName("body")[0].style.cursor = 'default';        
            }
        }else{
            document.getElementsByTagName("body")[0].style.cursor = 'default';  
        }
        
	}

	renderer.render( scene, camera );
    

}
window.addEventListener('pointermove', onDocumentMouseOver, false);
