let container;
let camera, scene, renderer;
let controls, group;
let enableSelection = false;
let allowOrbitcontrol = false;
let allowDragControll = true;

const objects = [];

var MODE = { ORBIT: 0, DRAG: 1 };

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

init();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    scene.add( new THREE.AmbientLight( 0x505050 ) );
    
    // CAMERA
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set(5, 5, 10); //đi sang phải, độ đi lên , lùi lại
    camera.lookAt(scene.position);

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild( renderer.domElement );

    // LIGHT
    const light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.angle = Math.PI / 9;

    light.castShadow = true;
    light.shadow.camera.near = 1000;
    light.shadow.camera.far = 4000;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add( light );

    // PLANE 
    scene.add(new THREE.GridHelper(1000, 1000));
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)


    // OBJECT
    var object = null
    var transformControls = null


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
    
    const points = [
        new THREE.Vector3(0.0, 0.0, 0.0),
        new THREE.Vector3(0.0, 0.0, 2),
        new THREE.Vector3(0.0, 0.0, 2),
        new THREE.Vector3(0.0, 2 * Math.sin(Math.PI / 3), 2 * Math.cos(Math.PI / 3)), // (z,y,x)
    ]

    const geometry = new THREE.ConvexGeometry(points);

    const material = new THREE.MeshBasicMaterial( {
        // color: "aqua",
        // wireframe: true,
        // wireframeLinewidth: 0.0,
        
    } );
    object = new THREE.Mesh( geometry, material );
    scene.add(object)

    const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

    const dragControls = new THREE.DragControls([object], camera, renderer.domElement)
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

    //Menu Control
    var drag = document.getElementById("dragBtn")
    drag.addEventListener('click',function(event){
        transformControls.setMode("translate")
    })

    var rotate = document.getElementById("rotateBtn")
    rotate.addEventListener('click',function(event){
        transformControls.setMode("rotate")
    })

    var scale = document.getElementById("scaleBtn")
    scale.addEventListener('click',function(event){
        transformControls.setMode("scale")
    })

    // create object menu

    var cylinder = document.getElementById("cylynderBtn")
    cylinder.addEventListener("click", function(e){
        if (object != null){
            scene.remove(transformControls)
            scene.remove(object)
        }
        object = createCylinder(scene)
        scene.add( object ); 

        // Controls
        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

        const dragControls = new THREE.DragControls([object], camera, renderer.domElement)
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

        //Menu Control
        var drag = document.getElementById("dragBtn")
        drag.addEventListener('click',function(event){
            transformControls.setMode("translate")
        })

        var rotate = document.getElementById("rotateBtn")
        rotate.addEventListener('click',function(event){
            transformControls.setMode("rotate")
        })

        var scale = document.getElementById("scaleBtn")
        scale.addEventListener('click',function(event){
            transformControls.setMode("scale")
        })

        window.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "g":
                    transformControls.setMode("translate")
                    break
                case "r":
                    transformControls.setMode("rotate")
                    break
                case "s":
                    transformControls.setMode("scale")
                    break
            }
        })
    })

    var cube = document.getElementById("cubeBtn")
    cube.addEventListener("click", function(e){
        if (object != null){
            scene.remove(transformControls)
            scene.remove(object)
        }
        object = createCube(scene)
        scene.add( object ); 

        // Controls
        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

        const dragControls = new THREE.DragControls([object], camera, renderer.domElement)
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

        //Menu Control
        var drag = document.getElementById("dragBtn")
        drag.addEventListener('click',function(event){
            transformControls.setMode("translate")
        })

        var rotate = document.getElementById("rotateBtn")
        rotate.addEventListener('click',function(event){
            transformControls.setMode("rotate")
        })

        var scale = document.getElementById("scaleBtn")
        scale.addEventListener('click',function(event){
            transformControls.setMode("scale")
        })

        window.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "g":
                    transformControls.setMode("translate")
                    break
                case "r":
                    transformControls.setMode("rotate")
                    break
                case "s":
                    transformControls.setMode("scale")
                    break
            }
        })
    })
    
                   
    
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function cylinderHanler(object, scene, camera, renderer){

}

function createCylinder(scene){
    var geom = new THREE.CylinderGeometry(1, 1, 5, 16, 16);
    var cylinder = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
        color: "aqua",
        // wireframe: true,
        // wireframeLinewidth: 0.0
    })); 
    return cylinder
}


function createCube(scene){
    var object = new THREE.Group()
    const geometry = new THREE.TorusGeometry( 2, 1, 16, 100 );
    const material = new THREE.MeshBasicMaterial( {
        color: "aqua",
        wireframe: true,
        wireframeLinewidth: 0.0,
        
    } );
    const torus = new THREE.Mesh( geometry, material );


    object.add(torus)
    
    return object
}

// const stats = Stats()
// document.body.appendChild(stats.dom)

var animate = function () {
    requestAnimationFrame(animate)

    render()

    //stats.update()
};

function render() {
    renderer.render(scene, camera)
}

animate(); 