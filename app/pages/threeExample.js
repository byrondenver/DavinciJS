// import THREE from 'three';

var THREE = window.THREE;
var dat = window.dat;

// var $ = window.$;

var app = {

  init: function(){
    app.render();
  },
  render: function() {
	var container = document.getElementById( 'container' );
			var renderer, scene, camera, fov = 45;
			// var mesh, decal;
			var mesh;
			var raycaster;
			var line;
			var x;
			var y;
			var dummy;
			var intersection = {
				intersects: false,
				point: new THREE.Vector3(),
				normal: new THREE.Vector3()
			};
			var controls;
			var mouse = new THREE.Vector2();
			var textureLoader = new THREE.TextureLoader();
			var decalDiffuse = textureLoader.load( 'textures/decal/decal-diffuse.png' );
			var decalNormal = textureLoader.load( 'textures/decal/decal-normal.jpg' );
			var decalMaterial = new THREE.MeshPhongMaterial( {
				specular: 0x444444,
				map: decalDiffuse,
				normalMap: decalNormal,
				normalScale: new THREE.Vector2( 1, 1 ),
				shininess: 30,
				transparent: true,
				depthTest: true,
				depthWrite: false,
				polygonOffset: true,
				polygonOffsetFactor: - 4,
				wireframe: false
			});
			var decals = [];
			// var decalHelper, mouseHelper;
			var mouseHelper;
			var p = new THREE.Vector3( 0, 0, 0 );
			var r = new THREE.Vector3( 0, 0, 0 );
			var s = new THREE.Vector3( 10, 10, 10 );
			var up = new THREE.Vector3( 0, 1, 0 );
			var check = new THREE.Vector3( 1, 1, 1 );
			var params = {
				projection: 'normal',
				minScale: 10,
				maxScale: 20,
				rotate: true,
				clear: function() {
					removeDecals();
				}
			};
			window.addEventListener( 'load', init );
			function init() {
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 100;
				camera.target = new THREE.Vector3();
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.minDistance = 50;
				controls.maxDistance = 200;
				scene.add( new THREE.AmbientLight( 0x443333 ) );
				var light = new THREE.DirectionalLight( 0xffddcc, 1 );
				light.position.set( 1, 0.75, 0.5 );
				scene.add( light );
				var light1 = new THREE.DirectionalLight( 0xccccff, 1 );
				light1.position.set( -1, 0.75, -0.5 );
				scene.add( light1 );
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );
				line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
				scene.add( line );
				loadLeePerrySmith();
				raycaster = new THREE.Raycaster();
				mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
				mouseHelper.visible = false;
				scene.add( mouseHelper );
				window.addEventListener( 'resize', onWindowResize, false );
				var moved = false;
				controls.addEventListener( 'change', function() {
					moved = true;
				} );
				window.addEventListener( 'mousedown', function () {
					moved = false;
				}, false );
				window.addEventListener( 'mouseup', function() {
					checkIntersection();
					if ( ! moved ) shoot();
				} );
				window.addEventListener( 'mousemove', onTouchMove );
				window.addEventListener( 'touchmove', onTouchMove );
				function onTouchMove( event ) {
					if ( event.changedTouches ) {
						x = event.changedTouches[ 0 ].pageX;
						y = event.changedTouches[ 0 ].pageY;
					} else {
						x = event.clientX;
						y = event.clientY;
					}
					mouse.x = ( x / window.innerWidth ) * 2 - 1;
					mouse.y = - ( y / window.innerHeight ) * 2 + 1;
					checkIntersection();
				}
				function checkIntersection() {
					if ( ! mesh ) return;
					raycaster.setFromCamera( mouse, camera );
					var intersects = raycaster.intersectObjects( [ mesh ] );
					if ( intersects.length > 0 ) {
						var p = intersects[ 0 ].point;
						mouseHelper.position.copy( p );
						intersection.point.copy( p );
						var n = intersects[ 0 ].face.normal.clone();
						n.multiplyScalar( 10 );
						n.add( intersects[ 0 ].point );
						intersection.normal.copy( intersects[ 0 ].face.normal );
						mouseHelper.lookAt( n );
						line.geometry.vertices[ 0 ].copy( intersection.point );
						line.geometry.vertices[ 1 ].copy( n );
						line.geometry.verticesNeedUpdate = true;
						intersection.intersects = true;
					} else {
						intersection.intersects = false;
					}
				}
				var gui = new dat.GUI();
				gui.add( params, 'projection', { 'From cam to mesh': 'camera', 'Normal to mesh': 'normal' } );
				gui.add( params, 'minScale', 1, 30 );
				gui.add( params, 'maxScale', 1, 30 );
				gui.add( params, 'rotate' );
				gui.add( params, 'clear' );
				gui.open();
				onWindowResize();
				animate();
			}
			function loadLeePerrySmith() {
				var loader = new THREE.JSONLoader();
				loader.load( 'obj/leeperrysmith/LeePerrySmith.js', function( geometry ) {
					var material = new THREE.MeshPhongMaterial( {
						specular: 0x111111,
						map: textureLoader.load( 'obj/leeperrysmith/Map-COL.jpg' ),
						specularMap: textureLoader.load( 'obj/leeperrysmith/Map-SPEC.jpg' ),
						normalMap: textureLoader.load( 'obj/leeperrysmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
						normalScale: new THREE.Vector2( 0.75, 0.75 ),
						shininess: 25
					} );
					mesh = new THREE.Mesh( geometry, material );
					scene.add( mesh );
					mesh.scale.set( 10, 10, 10 );
					//scene.add( new THREE.FaceNormalsHelper( mesh, 1 ) );
					//scene.add( new THREE.VertexNormalsHelper( mesh, 1 ) );
				} );
			}
			function shoot() {
				if ( params.projection == 'camera' ) {
					var dir = camera.target.clone();
					dir.sub( camera.position );
					p = intersection.point;
					var m = new THREE.Matrix4();
					var c = dir.clone();
					c.negate();
					c.multiplyScalar( 10 );
					c.add( p );
					m.lookAt( p, c, up );
					m = m.extractRotation( m );
					dummy = new THREE.Object3D();
					dummy.rotation.setFromRotationMatrix( m );
					r.set( dummy.rotation.x, dummy.rotation.y, dummy.rotation.z );
				} else {
					p = intersection.point;
					r.copy( mouseHelper.rotation );
				}
				var scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
				s.set( scale, scale, scale );
				if ( params.rotate ) r.z = Math.random() * 2 * Math.PI;
				var material = decalMaterial.clone();
				material.color.setHex( Math.random() * 0xffffff );
				m = new THREE.Mesh( new THREE.DecalGeometry( mesh, p, r, s, check ), material );
				decals.push( m );
				scene.add( m );
			}
			function removeDecals() {
				decals.forEach( function( d ) {
					scene.remove( d );
					d = null;
				} );
				decals = [];
			}
			// function mergeDecals() {
			// 	var merge = {};
			// 	decals.forEach( function ( decal ) {
			// 		var uuid = decal.material.uuid;
			// 		var d = merge[ uuid ] = merge[ uuid ] || {};
			// 		d.material = d.material || decal.material;
			// 		d.geometry = d.geometry || new THREE.Geometry();
			// 		d.geometry.merge( decal.geometry, decal.matrix );
			// 	} );
			// 	removeDecals();
			// 	for ( var key in merge ) {
			// 		var d = merge[ key ];
			// 		var mesh = new THREE.Mesh( d.geometry, d.material );
			// 		scene.add( mesh );
			// 		decals.push( mesh );
			// 	}
			// }
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
			}
		}
	};
		module.exports = app;