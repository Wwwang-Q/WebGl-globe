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

	/****************/

	var start = latlngToXYZ( [ {
		"lat": 22.33,
		"lng": 114.18
	} ] ,100);
	var end = latlngToXYZ( [ {
		"lat": 0.33,
		"lng": 0.18
	} ] ,100);

	var mid = latlngToXYZ( [ {
		"lat": 10,
		"lng": 55
	} ],150 )
	
	var threeStart = new THREE.Vector3( start[0].x, start[0].y, start[0].z );
	var threeMid = new THREE.Vector3( mid[0].x, mid[0].y, mid[0].z );
	var threeEnd = new THREE.Vector3( end[0].x, end[0].y, end[0].z );


	var curve3 = new THREE.SplineCurve3( [ threeStart,
		threeMid,
		threeEnd
	] );
	console.log(curve3)

	var geometry = new THREE.TubeGeometry( curve3, 100, 4, 4, false );
	var material = new THREE.MeshBasicMaterial( {
		color: 0xff0000,
		wireframe: true
	} );
	uniforms = {
		time: {
			type: "f",
			value: 1.0
		}
	};
	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		transparent: true,
		alphaTest: 0.5

	} )

	line3D = new THREE.Mesh( geometry, shaderMaterial );
	scene.add( line3D );
	/*****************/

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
			sphereArray.push( {
				x: posX,
				y: posY,
				z: posZ
			} )
		}
		return sphereArray;
	}

	var particleXYZ = latlngToXYZ( chinaData, 100 );
	var geometryPar = new THREE.Geometry();
	var materialPar = new THREE.PointsMaterial( {
		size: 1,
		color: 0xffff00
	} );
	for ( var i = 0; i < particleXYZ.length; i++ ) {
		var vertex = new THREE.Vector3( particleXYZ[ i ].x, particleXYZ[ i ].y, particleXYZ[ i ].z )
		geometryPar.vertices.push( vertex )
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
	// 	/**********/
	 uniforms.time.value += 0.01
}