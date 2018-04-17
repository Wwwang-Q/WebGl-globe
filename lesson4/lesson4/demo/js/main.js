var container;

var camera, scene, renderer, mesh;

var uniforms;

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );

    camera.position.z = 200;
    camera.position.x = 10;

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry( 100, 10, 10 );

    var material = new THREE.MeshBasicMaterial( {
        color: 0xffff00,
        wireframe: true
    } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var paricleGeometry = new THREE.Geometry();

    function latlngToXYZ( coord, radius ) {
        var sphereArray = [];
        var radius = radius || 10;
        for ( var i = 0; i < coord.length; i++ ) {
            var lat = coord[ i ].lat;
            var lon = coord[ i ].lng;
            var subRadius = Math.cos( lat * Math.PI / 180 ) * radius;
            var posX = ( subRadius * Math.cos( lon * Math.PI / 180 ) );
            var posY = ( subRadius * Math.sin( lon * Math.PI / 180 ) );
            var posZ = ( Math.sin( lat * Math.PI / 180 ) * radius );
            sphereArray.push( { x: posX, y: posY, z: posZ } )
        }
        return sphereArray;
    }

    var particleXYZ = latlngToXYZ( chinaData, 100 );
    var geometryPar = new THREE.Geometry();
    var materialPar = new THREE.PointsMaterial( { size: 1, color: 0xffff00 } );

   
    for ( var i = 0; i < particleXYZ.length; i++ ) {
        var vertex = new THREE.Vector3( particleXYZ[ i ].x, particleXYZ[ i ].y, particleXYZ[ i ].z )
        geometryPar.vertices.push( vertex )
        var geometryCube = new THREE.BoxGeometry( 1, 1,50 );
        var materialCube = new THREE.MeshBasicMaterial( {
            color: 0xffff00,
            wireframe: true    //以网格形式显示
        } );
        var meshCube = new THREE.Mesh(geometryCube,materialCube)

        meshCube.position.set(vertex.x,vertex.y,vertex.z)
        // meshCube.scale.z = 50;
        meshCube.lookAt(scene.position);  //使柱子垂直于球心
        meshCube.updateMatrix();
        meshCube.position.set(vertex.x*1.25,vertex.y*1.25,vertex.z*1.25)

        
        scene.add( meshCube )
    }

    var particle = new THREE.Points( geometryPar, materialPar );

    scene.add( particle )

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}


function animate() {

    requestAnimationFrame( animate );
    render();
}

function render() {

    renderer.render( scene, camera );
    scene.rotation.z += 0.01
    scene.rotation.x += 0.01
}