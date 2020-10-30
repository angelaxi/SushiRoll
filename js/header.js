var scene
var camera
var camera_piv
var camera_y
var container
var header
var renderer
var pickingTexture
var mainmenu_sprite
var geometry
var cube
var pivot
var block

init()
animate()

function init() {
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight )
	pickingTexture.texture.minFilter = THREE.LinearFilter
  container = document.getElementById("TitleHeader")
  canvas = document.createElement("canvas")
  var WIDTH = container.offsetWidth
  var HEIGHT = container.offsetHeight

  renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas, alpha:true})
  renderer.setSize(WIDTH, HEIGHT)
  container.appendChild(renderer.domElement)

  // camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000)
  // camera.position.set(0, 0, 10)
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000)
  camera.position.set(4, 5, 12)
  camera.lookAt(0, 0, 0)

  scene = new THREE.Scene()

  var orbitControls = new THREE.OrbitControls(camera, canvas);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.setScalar(10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  var startOrient = "vertical"
  var currPos = [new THREE.Vector3(0, 0, 1)]
  var board = new Board(startOrient, currPos, scene, renderer)
  board.createBoard(5)

  block = new Block(scene, currPos, startOrient)

  // var roundedBoxGeometry = createBoxWithRoundedEdges(1, 1, 1, .25, 3);
  // roundedBoxGeometry.computeVertexNormals();
  // roundedBoxGeometry.translate(0, .5, 0);

  // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
  // cube = new THREE.Mesh( roundedBoxGeometry, material )
  // scene.add(cube)

  // var bbox = new THREE.Box3().setFromObject(cube)
  // cube.position.set(bbox.min.x, bbox.max.y, 0)
  // pivot = new THREE.Group()
  // pivot.add(cube)
  // pivot.position.set(-bbox.min.x, 0.5-bbox.max.y, 0.5)
  // scene.add(pivot)

  // var position = { x : cube.position.x, y: cube.position.y, z: cube.position.z};
  // var end = { x : cube.position.x + 2.0, y: cube.position.y, z: cube.position.z};
  // var tween = new TWEEN.Tween( position ).to( end, 200 );
  // tween.easing(TWEEN.Easing.Quadratic.Out);
  // tween.start();
  // tween.onUpdate(function(){ 
  //     console.log("position")
  //     cube.position.set(position.x,position.y, position.z);
  // });
  // var rotation = { x : cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z}
  // var end2 = { x : cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z - 1.5708}
  // var tween2 = new TWEEN.Tween(rotation).to(end2, 200);
  // tween2.easing(TWEEN.Easing.Quadratic.Out);
  // tween2.start();
  // tween2.onUpdate(function(){ 
  //     console.log("rotation")
  //     cube.rotation.set(rotation.x,rotation.y, rotation.z);
  // });
   
  // render()
}

function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  let geometry = new THREE.ExtrudeBufferGeometry( shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });
  
  geometry.center();
  
  return geometry;
}

function render() {
  // requestAnimationFrame( render )
  renderer.render( scene, camera )
}

function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()

  // pivot.rotation.z += 0.1
  renderer.render(scene, camera)
}

document.addEventListener('keydown', function(event) {
  if (event.key == " ") {
    // console.log(tile.rotation.z)
  }

  if (event.key == 'ArrowRight') {
    console.log("right arrow pressed")
    block.rotate("right")
  } else if (event.key == 'ArrowLeft') {
    console.log("left arrow pressed")
    block.rotate("left")
  } else if (event.key == 'ArrowDown') {
    console.log("down arrow pressed")
    block.rotate("forward")
  } else if (event.key == 'ArrowUp') {
    console.log("up arrow pressed")
    block.rotate("backward")
  }
})
