
let container;
let camera, scene, renderer;
let controls, group;
let enableSelection = false;
let allowOrbitcontrol = false;
let allowDragControll = true;

const objects = [];

var MODE = { ORBIT: 0, DRAG: 1 };

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

let light = null;
let light1 = null;
let lightControls1 = null;
let helper1 = null;
let axesHelper = null;
let object = null;
let transformControls = null;
let geometry = null;
let material = null;
let dragControls = null;
let orbitControls = null;
let objectGui = null;
let composer, effectFocus;
const objectName = "mainObject"



init();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // SCENE
    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xf0f0f0 );
    // scene.add( new THREE.AmbientLight( 0x505050 ) );
    
    // CAMERA
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(1.5351177744621156, 3.2337744840634506, 11.712647694042118); //đi sang phải, độ đi lên , lùi lại
    
    camera.lookAt(scene.position);

    // RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild( renderer.domElement );

    // LIGHT
        
    light = new THREE.SpotLight();
    
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 100
    light.position.x = 3
    light.position.y = 6
    light.position.z = -1
    scene.add(light);

    const helper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(helper);

    //2
    light1 = new THREE.SpotLight();
    
    light1.castShadow = true;
    light1.shadow.mapSize.width = 512;
    light1.shadow.mapSize.height = 512;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 100
    light1.position.x = -3
    light1.position.y = 6
    light1.position.z = -1
    scene.add(light1);

    helper1 = new THREE.CameraHelper(light1.shadow.camera);
    scene.add(helper1);

    // PLANE 
    const planeGeometry = new THREE.PlaneGeometry(100, 20)
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
    plane.rotateX(-Math.PI / 2)
    plane.position.y = -1.75
    plane.receiveShadow = true;
    scene.add(plane)

    // post preprocessing
    const renderModel = new THREE.RenderPass( scene, camera );
    const effectBloom = new THREE.BloomPass( 0.75 );
    const effectFilm = new THREE.FilmPass( 0.5, 0.5, 1448, false );

    effectFocus = new THREE.ShaderPass( THREE.FocusShader );

    effectFocus.uniforms[ "screenWidth" ].value = window.innerWidth * window.devicePixelRatio;
    effectFocus.uniforms[ "screenHeight" ].value = window.innerHeight * window.devicePixelRatio;

    composer = new THREE.EffectComposer( renderer );

    composer.addPass( renderModel );
    composer.addPass( effectBloom );
    composer.addPass( effectFilm );
    composer.addPass( effectFocus );

    // scene.add(new THREE.GridHelper(1000, 1000));
    // axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)


    // const geometry = new THREE.BufferGeometry();

    // const vertices = new Float32Array( [
    //     // 2 mặt bên
    //     0.0, 0.0, 0.0,
    //     0.0, 0.0, 2,
    //     0.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 0.0, 0.1, 0.1 / Math.tan(Math.PI / 6),
    //     // 0.0, 0.1, 2 - 0.1 / Math.tan(Math.PI / 6),
    //     // 0.0, 2 * Math.sin(Math.PI / 3) - 0.1 / Math.cos(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 0.0, 0.1, 1,
    //     // 0.0, 0.1, 2 - 0.1 / Math.tan(Math.PI / 6),
    //     // 0.0, 2 * Math.sin(Math.PI / 3) - 0.1 / Math.cos(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 0.0, Math.sin(Math.PI / 3) - 0.05 / Math.cos(Math.PI / 3) + 0.05, Math.cos(Math.PI / 3) +  0.05 / Math.tan(Math.PI / 6),
    //     // 0.0, 0.1, 1,
    //     // 0.0, 2 * Math.sin(Math.PI / 3) - 0.1 / Math.cos(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 1.0, 0.0, 0.0,
    //     // 1.0, 0.0, 2,
    //     // 1.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 1.0, 0.1, 1,
        //     // 1.0, 0.1, 2 - 0.1 / Math.tan(Math.PI / 6),
    //     // 1.0, 2 * Math.sin(Math.PI / 3) - 0.1 / Math.cos(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 1.0, Math.sin(Math.PI / 3) - 0.05 / Math.cos(Math.PI / 3) + 0.05, Math.cos(Math.PI / 3) +  0.05 / Math.tan(Math.PI / 6),
    //     // 1.0, 0.1, 1,
    //     // 1.0, 2 * Math.sin(Math.PI / 3) - 0.1 / Math.cos(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 2 mặt trước sau
    //     // 0.0, 0.0, 0.0,
    //     // 0.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)
    //     // 1.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 0.0, 0.0, 0.0,
    //     // 1.0, 0.0, 0.0,
    //     // 1.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 0.0, 0.0, 2,
    //     // 1.0, 0.0, 2,
    //     // 0.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)

    //     // 1.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)
    //     // 1.0, 0.0, 2,
    //     // 0.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3), // (z,y,x)
    // ] );

    // for (i = 0; i < vertices.length; i++){
    //     vertices[i] *= 2
    // }

    // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    
    // const points = [
    //     new THREE.Vector3(0.0, 0.0, 0.0),
    //     new THREE.Vector3(0.0, 0.0, 2),
    //     new THREE.Vector3(0.0, 0.0, 2),
    //     new THREE.Vector3(0.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3)), // (z,y,x)
    // ]

    // geometry = new THREE.ConvexGeometry(points);

    // material = new THREE.MeshBasicMaterial( {
    //     // color: "aqua",
    //     // wireframe: true,
    //     // wireframeLinewidth: 0.0,
        
    // } );
    // object = new THREE.Mesh( geometry, material );


    geometry = new THREE.TorusGeometry( 2, 1, 16, 100 );

    material = new THREE.MeshPhongMaterial  ( {
        // color: "aqua",
        // wireframe: true,
        // wireframeLinewidth: 0.0,
        
    } );
    object = new THREE.Mesh( geometry, material );
    object.name = objectName
    object.castShadow = true;
    object.receiveShadow = true;
    object.updateMatrixWorld( true );

    scene.add(object)

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

    dragControls = new THREE.DragControls([object, light, light1], camera, renderer.domElement)
    dragControls.addEventListener("hoveron", function () {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener("hoveroff", function () {
        orbitControls.enabled = true;
    });
    dragControls.addEventListener('dragstart', function (event) {
        event.object.material.opacity = 0.33
    })
    dragControls.addEventListener('dragend', function (event) {
        event.object.material.opacity = 1
    })

    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.attach(object);    
    transformControls.setMode("translate")
    scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value
        dragControls.enabled = !event.value
    })

    lightControls = new THREE.TransformControls(camera, renderer.domElement);
    lightControls.attach(light);    
    lightControls.setMode("translate")
    scene.add(lightControls);

    lightControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value
        dragControls.enabled = !event.value
    })

    if (light1 != null){
        lightControls1 = new THREE.TransformControls(camera, renderer.domElement);
        lightControls1.attach(light1);    
        lightControls1.setMode("translate")
        scene.add(lightControls1);
    
        lightControls.addEventListener('dragging-changed', function (event) {
            orbitControls.enabled = !event.value
            dragControls.enabled = !event.value
        })
    }
   

    //Menu Control
    var drag = document.getElementById("dragBtn")
    drag.addEventListener('click',function(event){
        transformControls.setMode("translate")
        lightControls.setMode("translate")
    })

    var rotate = document.getElementById("rotateBtn")
    rotate.addEventListener('click',function(event){
        transformControls.setMode("rotate")
    })

    var scale = document.getElementById("scaleBtn")
    scale.addEventListener('click',function(event){
        transformControls.setMode("scale")
    })                       
    
    // Globe GUI
    
    const gui = new dat.GUI()   
    const cameraFolder = gui.addFolder("Camera")
    const positionCameraFolder = cameraFolder.addFolder("Position")
    positionCameraFolder.add(camera.position, "x", 0, 10, 0.01)
    positionCameraFolder.add(camera.position, "y", 0, 10, 0.01)
    positionCameraFolder.add(camera.position, "z", 0, 10, 0.01)

    const rotationCameraFolder = cameraFolder.addFolder("Rotation")
    rotationCameraFolder.add(scene.rotation, "x", -10, 10, 0.01)
    rotationCameraFolder.add(scene.rotation, "y", -10, 10, 0.01)
    rotationCameraFolder.add(scene.rotation, "z", -10, 10, 0.01)



   
    var lightData = {
        color: light.color.getHex(),
        mapsEnabled: true
    };

    const lightFolder = gui.addFolder('Light')
    lightFolder.addColor(lightData, 'color').onChange(() => { light.color.setHex(Number(lightData.color.toString().replace('#', '0x'))) });
    lightFolder.add(light, 'intensity', 0, 1, 0.01);

    if (light1 != null){
        const lightFolder1 = gui.addFolder('Light1')
        lightFolder1.addColor(lightData, 'color').onChange(() => { light1.color.setHex(Number(lightData.color.toString().replace('#', '0x'))) });
        lightFolder1.add(light1, 'intensity', 0, 1, 0.01);
    }
    
        
    const spotLightFolder = gui.addFolder('SpotLight')
    spotLightFolder.add(light, "distance", 0, 100, 0.01)
    spotLightFolder.add(light, "decay", 0, 4, 0.1)
    spotLightFolder.add(light, "angle", 0, 1, 0.1)
    spotLightFolder.add(light, "penumbra", 0, 1, 0.1)
    spotLightFolder.add(light.shadow.camera, "near", 0.1, 100).onChange(() => light.shadow.camera.updateProjectionMatrix())
    spotLightFolder.add(light.shadow.camera, "far", 0.1, 100).onChange(() => light.shadow.camera.updateProjectionMatrix())
    // spotLightFolder.add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096]).onChange(() => updateShadowMapSize())
    // spotLightFolder.add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096]).onChange(() => updateShadowMapSize())
    spotLightFolder.add(light.position, "x", -50, 50, 0.01)
    spotLightFolder.add(light.position, "y", -50, 50, 0.01)
    spotLightFolder.add(light.position, "z", -50, 50, 0.01)
    spotLightFolder.open()

    function updateShadowMapSize() {    
        light.shadow.mapSize.width = data.shadowMapSizeWidth
        light.shadow.mapSize.height = data.shadowMapSizeHeight;
        light.shadow.map = null
    }

    // Object gui
    objectGui = new dat.GUI()   

    var objectData = {
        color: material.color.getHex(),
    };
    var meshBasicFolder = objectGui.addFolder('Object');
    var moveFolder = meshBasicFolder.addFolder('Move');
    moveFolder.add(object.position, 'x', 0, 10, 0.01)
    moveFolder.add(object.position, 'y', 0, 10, 0.01)
    moveFolder.add(object.position, 'z', 0, 10, 0.01)
    var rotationFolder = meshBasicFolder.addFolder('Rotate');
    rotationFolder.add(object.rotation, 'x', 0, 10, 0.01)
    rotationFolder.add(object.rotation, 'y', 0, 10, 0.01)
    rotationFolder.add(object.rotation, 'z', 0, 10, 0.01)
    var scaleFolder = meshBasicFolder.addFolder('Scale');
    scaleFolder.add(object.scale, 'x', 0, 10, 0.01)
    scaleFolder.add(object.scale, 'y', 0, 10, 0.01)
    scaleFolder.add(object.scale, 'z', 0, 10, 0.01)
    meshBasicFolder.open()

    var meshBasicMaterialFolder = objectGui.addFolder('Object Materials');    
    meshBasicMaterialFolder.addColor(objectData, 'color').onChange(() => { material.color.setHex(Number(objectData.color.toString().replace('#', '0x'))) });
    meshBasicMaterialFolder.open()
    

}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

dat.GUI.prototype.removeFolder = function(name) {
    var folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
  }

function createCylinder(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    object.geometry = new THREE.CylinderGeometry( 1, 1, 8, 32 );
    object.scale.set(0.5, 0.5, 0.5)
    object.position.set(0, 1, 0)
}



function createCube(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    object.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    object.scale.set(1.5, 1.5, 1.5)
    object.position.set(0, 1, 0)
}


function createCone(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    object.geometry = new THREE.ConeGeometry( 5, 20, 32 );
    object.scale.set(0.2, 0.2, 0.2)
    object.position.set(0, 2, 0)
}



function createGlobular(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    object.geometry = new THREE.SphereGeometry( 5, 32, 32 );
    object.scale.set(0.3, 0.3, 0.3)

}


function createWheel(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    object.geometry = new THREE.TorusGeometry( 2, 1, 16, 100 );
    object.scale.set(0.5, 0.5, 0.5)
    object.position.set(0, 1, 0)
}



function createTeapot(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    object.geometry = new THREE.TeapotGeometry( 2 );

}


// Material

function pointMaterial(){
    console.log("conver to point material")
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    material =  new THREE.PointsMaterial({ color: object.material.color, size: 0.1 });
    object2 = new THREE.Points( object.geometry,  material); 

    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    object.matrixWorld.decompose( position, quaternion, scale );

    object2.position.set(position.x, position.y, position.z);
    object2.scale.set(scale.x, scale.y, scale.z)
    object2.rotation.set(quaternion.x, quaternion.y, quaternion.z)
    object2.name = objectName
    object2.castShadow = true;
    object2.receiveShadow = true;

    object.geometry.dispose();
    object.material.dispose();
    transformControls.detach(object)
    scene.remove( object )
    
    scene.add(object2)
    // object = object2
    console.log(object.name)    

    // gui
   
    objectGui.removeFolder('Object Materials')

    var objectData = {
        color: material.color.getHex(),
    };
    
    var meshBasicMaterialFolder = objectGui.addFolder('Object Materials');
    
    meshBasicMaterialFolder.addColor(objectData, 'color').onChange(() => { material.color.setHex(Number(objectData.color.toString().replace('#', '0x'))) });
    
    meshBasicMaterialFolder.open()
    
    // controle
    dragControls.dispose()
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
    dragControls = new THREE.DragControls([object2], camera, renderer.domElement)
    dragControls.addEventListener("hoveron", function () {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener("hoveroff", function () {
        orbitControls.enabled = true;
    });
    dragControls.addEventListener('dragstart', function (event) {
        event.object.material.opacity = 0.33
    })
    dragControls.addEventListener('dragend', function (event) {
        event.object.material.opacity = 1
    })

    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.attach(object2);
    transformControls.setMode("translate")
    scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value
        dragControls.enabled = !event.value
    })
}


// const stats = Stats()
// document.body.appendChild(stats.dom)
function lineMaterial(){
    console.log("conver to point material")
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    material =  new THREE.MeshPhongMaterial({ color: object.material.color, size: 0.1 , wireframe: true});
    object2 = new THREE.Mesh( object.geometry, material ); 

    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    object.matrixWorld.decompose( position, quaternion, scale );

    object2.position.set(position.x, position.y, position.z);
    object2.scale.set(scale.x, scale.y, scale.z)
    object2.rotation.set(quaternion.x, quaternion.y, quaternion.z)
    object2.name = objectName
    object2.castShadow = true;
    object2.receiveShadow = true;

    object.geometry.dispose();
    object.material.dispose();
    transformControls.detach(object)
    scene.remove( object )
    
    scene.add(object2)
    // object = object2
    console.log(object.name)    
    // gui
    
    objectGui.removeFolder('Object Materials')

    var objectData = {
        color: material.color.getHex(),
    };
    
    var meshBasicMaterialFolder = objectGui.addFolder('Object Materials');
        
    meshBasicMaterialFolder.addColor(objectData, 'color').onChange(() => { material.color.setHex(Number(objectData.color.toString().replace('#', '0x'))) });
    
    meshBasicMaterialFolder.open()
    
    // controle
    dragControls.dispose()
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
    dragControls = new THREE.DragControls([object2], camera, renderer.domElement)
    dragControls.addEventListener("hoveron", function () {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener("hoveroff", function () {
        orbitControls.enabled = true;
    });
    dragControls.addEventListener('dragstart', function (event) {
        event.object.material.opacity = 0.33
    })
    dragControls.addEventListener('dragend', function (event) {
        event.object.material.opacity = 1
    })

    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.attach(object2);
    transformControls.setMode("translate")
    scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value
        dragControls.enabled = !event.value
    })
}

function solidMaterial(){
    console.log("conver to point material")
    object = scene.getObjectByName(objectName)
    console.log(object.name)

    material =  new THREE.MeshPhongMaterial({ color: object.material.color, size: 0.1 , wireframe: false}) 
    object2 = new THREE.Mesh( object.geometry, material); 

    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    object.matrixWorld.decompose( position, quaternion, scale );

    object2.position.set(position.x, position.y, position.z);
    object2.scale.set(scale.x, scale.y, scale.z)
    object2.rotation.set(quaternion.x, quaternion.y, quaternion.z)
    object2.name = objectName
    object2.castShadow = true;
    object2.receiveShadow = true;

    object.geometry.dispose();
    object.material.dispose();
    transformControls.detach(object)
    scene.remove( object )
    
    scene.add(object2)
    // object = object2
    console.log(object.name)    
    // gui
    
    objectGui.removeFolder('Object Materials')

    var objectData = {
        color: material.color.getHex(),
    };
    
    var meshBasicMaterialFolder = objectGui.addFolder('Object Materials');
    
    meshBasicMaterialFolder.add(material, 'wireframe')
    meshBasicMaterialFolder.addColor(objectData, 'color').onChange(() => { material.color.setHex(Number(objectData.color.toString().replace('#', '0x'))) });
    
    meshBasicMaterialFolder.open()
    
    // controle
    dragControls.dispose()
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
    dragControls = new THREE.DragControls([object2], camera, renderer.domElement)
    dragControls.addEventListener("hoveron", function () {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener("hoveroff", function () {
        orbitControls.enabled = true;
    });
    dragControls.addEventListener('dragstart', function (event) {
        event.object.material.opacity = 0.33
    })
    dragControls.addEventListener('dragend', function (event) {
        event.object.material.opacity = 1
    })

    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.attach(object2);
    transformControls.setMode("translate")
    scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value
        dragControls.enabled = !event.value
    })
}


function textureMaterial(){
    document.getElementById('upload').click()
    document.getElementById('upload').addEventListener('change', function(e) {

        var userImage = e.target.files[0];     
        var userImageURL = URL.createObjectURL( userImage );
        
        console.log("conver to point material")
        object = scene.getObjectByName(objectName)
        console.log(object.name)

        // const texture = new THREE.TextureLoader().load("image/okii.jpg")
        const loader = new THREE.TextureLoader();
        material =  new THREE.MeshPhongMaterial({ color: object.material.color, size: 0.1 , wireframe: false, map: loader.load(userImageURL)}) 
        object2 = new THREE.Mesh( object.geometry, material); 

        var position = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        var scale = new THREE.Vector3();

        object.matrixWorld.decompose( position, quaternion, scale );

        object2.position.set(position.x, position.y, position.z);
        object2.scale.set(scale.x, scale.y, scale.z)
        object2.rotation.set(quaternion.x, quaternion.y, quaternion.z)
        object2.name = objectName
        object2.castShadow = true;
        object2.receiveShadow = true;

        object.geometry.dispose();
        object.material.dispose();
        transformControls.detach(object)
        scene.remove( object )
        
        scene.add(object2)
        // object = object2
        console.log(object.name)    
        // gui
        objectGui.removeFolder('Object Materials')

        var objectData = {
            color: material.color.getHex(),
        };
        
        var meshBasicMaterialFolder = objectGui.addFolder('Object Materials');
                
        meshBasicMaterialFolder.addColor(objectData, 'color').onChange(() => { material.color.setHex(Number(objectData.color.toString().replace('#', '0x'))) });
        
        meshBasicMaterialFolder.open()
        
        // controle
        dragControls.dispose()
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
        dragControls = new THREE.DragControls([object2], camera, renderer.domElement)
        dragControls.addEventListener("hoveron", function () {
            orbitControls.enabled = false;
        });
        dragControls.addEventListener("hoveroff", function () {
            orbitControls.enabled = true;
        });
        dragControls.addEventListener('dragstart', function (event) {
            event.object.material.opacity = 0.33
        })
        dragControls.addEventListener('dragend', function (event) {
            event.object.material.opacity = 1
        })

        transformControls = new THREE.TransformControls(camera, renderer.domElement);
        transformControls.attach(object2);
        transformControls.setMode("translate")
        scene.add(transformControls);

        transformControls.addEventListener('dragging-changed', function (event) {
            orbitControls.enabled = !event.value
            dragControls.enabled = !event.value
        })
    })
    
}

// light
function singleLight(){
    light.visible = true
    light1.visible = false
    lightControls1.visible = false
    helper1.visible = false
}

function multipleLight(){
    light.visible = true
    light1.visible = true
    lightControls1.visible = true
    helper1.visible = true
}
// animate
var loop = 0;
var animateFrameId;
var clock = new THREE.Clock();
var speed = 2; //units a second
var delta = 0;
var objectAnimated = false;
function turnAround(){
    if (!objectAnimated ){
        objectAnimated = true;
        rotateAroundZ()
    }
    
}

function rotateAroundZ(){
    object = scene.getObjectByName(objectName)
    console.log(object.name)
    delta = clock.getDelta();
    // light1.castShadow = false;
    animateFrameId = requestAnimationFrame( rotateAroundZ );
    object.rotation.z += speed * delta;

    renderer.render( scene, camera );
}

var animateFrameId1;
var lightPositionMax = 5
var lightPositionMin = 0
var step = -0.05
var lightAnimated = false;

function lightAround(){
    if (!lightAnimated){
        lightAnimated = true
        lightTrajectory()
    }
    
}

function lightTrajectory(){
    animateFrameId1 = requestAnimationFrame( lightTrajectory );
    light.position.x = light.position.x + step;
    light1.position.x = light1.position.x - step;
    if (light.position.x < lightPositionMin || light.position.x > lightPositionMax){
        step = 0 - step
    }
    // if (light1.position.x < lightPositionMin || light1.position.x > lightPositionMax){
    //     step = 0 - step
    // }
    renderer.render( scene, camera );
}


var animateFrameId2;
var decontructionAnimated = false;
var clock = new THREE.Clock();
var speed = 2; //units a second
var delta = 0;
var meshes = []
function initAndDecontruction(){
    pointMaterial()
    meshes = []
    mesh = scene.getObjectByName(objectName);
    mesh.material.color.setHex( 0xFF0000 );
    meshes.push( {
        mesh: mesh, verticesDown: 0, verticesUp: 0, direction: 0, speed: 15, delay: Math.floor( 200 + 200 * Math.random() ),
        start: Math.floor( 100 + 200 * Math.random() ),
    } );
    if (!decontructionAnimated){
        decontructionAnimated = true
        doInitAndDecontruct()
    }
}

function doInitAndDecontruct(){
    requestAnimationFrame( doInitAndDecontruct );
    objectInitAndDecontruct();

}
function objectInitAndDecontruct(){
    
    let delta = 10 * clock.getDelta();

    delta = delta < 2 ? delta : 2;
    
    const data = meshes[0];
    const positions = data.mesh.geometry.attributes.position;
    const initialPositions = data.mesh.geometry.attributes.initialPosition;

    const count = positions.count;

    if ( data.start > 0 ) {

        data.start -= 1;

    } else {

        if ( data.direction === 0 ) {

            data.direction = - 1;

        }

    }

    for ( let i = 0; i < count; i ++ ) {

        const px = positions.getX( i );
        const py = positions.getY( i );
        const pz = positions.getZ( i );

        // falling down
        if ( data.direction < 0 ) {

            if ( py > 0 ) {

                positions.setXYZ(
                    i,
                    px + 1.5 * ( 0.50 - Math.random() ) * data.speed * delta,
                    py + 3.0 * ( 0.25 - Math.random() ) * data.speed * delta,
                    pz + 1.5 * ( 0.50 - Math.random() ) * data.speed * delta
                );

            } else {

                data.verticesDown += 1;

            }

        }

        // rising up
        if ( data.direction > 0 ) {

            const ix = initialPositions.getX( i );
            const iy = initialPositions.getY( i );
            const iz = initialPositions.getZ( i );

            const dx = Math.abs( px - ix );
            const dy = Math.abs( py - iy );
            const dz = Math.abs( pz - iz );

            const d = dx + dy + dx;

            if ( d > 1 ) {

                positions.setXYZ(
                    i,
                    px - ( px - ix ) / dx * data.speed * delta * ( 0.85 - Math.random() ),
                    py - ( py - iy ) / dy * data.speed * delta * ( 1 + Math.random() ),
                    pz - ( pz - iz ) / dz * data.speed * delta * ( 0.85 - Math.random() )
                );

            } else {

                data.verticesUp += 1;

            }

        }

    }

    // all vertices down
    if ( data.verticesDown >= count ) {

        if ( data.delay <= 0 ) {

            data.direction = 1;
            data.speed = 5;
            data.verticesDown = 0;
            data.delay = 320;

        } else {

            data.delay -= 1;

        }

    }

    // all vertices up
    if ( data.verticesUp >= count ) {

        if ( data.delay <= 0 ) {

            data.direction = - 1;
            data.speed = 15;
            data.verticesUp = 0;
            data.delay = 120;

        } else {

            data.delay -= 1;

        }

    }

    positions.needsUpdate = true;
    // composer.render( 0.01 );
}

function cancelAnimate(){    
    if (objectAnimated){
        cancelAnimationFrame( animateFrameId );
        objectAnimated = false
    }
    if (lightAnimated){
        cancelAnimationFrame( animateFrameId1 );    
        lightAnimated = false
    }
}

var animate = function () {
    requestAnimationFrame(animate)

    render()

    //stats.update()
};

function setViewPoint(){
    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    camera.matrixWorld.decompose( position, quaternion, scale );
    console.log(position)
    console.log(scale)
    console.log(quaternion)
}
function render() {
    renderer.render(scene, camera)
}

animate(); 