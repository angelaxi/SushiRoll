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
var board
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
  board = new Board(startOrient, currPos, scene, renderer)
  board.createBoard(10)
  // console.log("tiles on board")
  // console.log(board.tiles)

  block = new Block(scene, currPos, startOrient, board)
   
  animate()
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
    // console.log("right arrow pressed")
    block.rotate("right")
  } else if (event.key == 'ArrowLeft') {
    // console.log("left arrow pressed")
    block.rotate("left")
  } else if (event.key == 'ArrowDown') {
    // console.log("down arrow pressed")
    block.rotate("forward")
  } else if (event.key == 'ArrowUp') {
    // console.log("up arrow pressed")
    block.rotate("backward")
  }
})
