function init(){
	var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    camera.position.set(5, 5, 10); //đi sang phải, độ đi lên , lùi lại
    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer({
    antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement); //orbit


    scene.add(new THREE.GridHelper(1000, 1000));

    var geom = new THREE.CylinderGeometry(5, 5, 10, 160, 160); // độ rộng mặt trên, độ rộng mặt dưới, độ cao, độ mịn của vòng tròn, độ mịn của thành
    

    // var cylinder = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
    //     color: "aqua",
    //     wireframe: true,
    //     wireframeLinewidth: 0.0
    // })); 
    // line mode

    //var cylinder = new THREE.Mesh(geom, new THREE.MeshBasicMaterial()); // solid

    let material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 })
    cylinder = new THREE.Points(geom, material) 
    // point

    // var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
    //     map:THREE.ImageUtils.loadTexture('image/Sanh S.jpg')
    // });
    // img.map.needsUpdate = true; //ADDED
    // var cylinder = new THREE.Mesh(geom, img); // image

    scene.add(cylinder);

    render();

    function render() {
        //geom.rotateZ(-Math.PI * 0.5); // rotate 90 degrees clockwise around z-axis
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    }

}

init()