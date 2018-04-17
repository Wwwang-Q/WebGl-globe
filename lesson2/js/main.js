
			var container;

			var camera, scene, renderer, mesh;

			var un
			init();
			animate();

			function init() {

				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );

				camera.position.z = 200;
				camera.position.x = 10;

				scene = new THREE.Scene();

				var geometry = new THREE.SphereGeometry( 100, 10, 10 );

				var material = new THREE.MeshBasicMaterial({
					color:0xffff00,
					wireframe:true
				});
				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				var paricleGeometry = new THREE.Geometry();

        //将经纬度转换为x,y,z坐标
        function latlngToXYZ ( coord,radius ){
					var sphereArray = [];
					var radius = radius||10;
					for(var i = 0; i < coord.length; i++) {
					    var lat = coord[i].lat;
					    var lon = coord[i].lng;
					    var subRadius = Math.cos(lat * Math.PI / 180) * radius;
					    var posX = (subRadius * Math.cos(lon * Math.PI / 180) );
					    var posY = (subRadius * Math.sin(lon * Math.PI / 180) );
					    var posZ = (Math.sin(lat * Math.PI / 180) * radius);
					    sphereArray.push({x:posX,y:posY,z:posZ})
					}
					return sphereArray;
				}

				var particleXYZ = latlngToXYZ( chinaData,100 );
				var geometryPar = new THREE.Geometry(); //声明几何体
				var materialPar = new THREE.PointsMaterial( { size: 1 ,color:0xffff00} );  //声明材质
				for (var i = 0; i < particleXYZ.length; i++) {
					var vertex = new THREE.Vector3(particleXYZ[i].x,particleXYZ[i].y,particleXYZ[i].z)
					geometryPar.vertices.push( vertex )
					// console.log(vertex)
				}
 
				var particle = new THREE.Points( geometryPar,materialPar ); //声明粒子
				scene.add(particle)  //将粒子加入场景中

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
				scene.rotation.z+=0.01
				scene.rotation.x+=0.01
			}

		