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

function init() {
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight )
	pickingTexture.texture.minFilter = THREE.LinearFilter
  container = document.getElementById("TitleHeader")
}

function startGame() {
  container.innerHTML = ""
  canvas = document.createElement("canvas")
  var div = document.createElement("div")
  div.className = "overlay"
  var h4_1 = document.createElement("H4")
  var h4_2 = document.createElement("H4")
  var restart = document.createTextNode("R: Restart")
  var newGame = document.createTextNode("Space: New Game")
  h4_1.appendChild(restart)
  h4_2.appendChild(newGame)
  div.appendChild(h4_1)
  div.appendChild(h4_2)
  container.appendChild(div)

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

  var light = new THREE.DirectionalLight(0xffffff, 0.7);
  light.position.setScalar(10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  var startOrient = "vertical"
  var currPos = [new THREE.Vector3(0, 0, 1)]
  board = new Board(startOrient, currPos, scene, renderer)
  board.createBoard(5)
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

  renderer.render(scene, camera)
}

function instructions() {
  container.innerHTML = ""
  var h3_1 = document.createElement("H3")
  var h5_1 = document.createElement("H5")
  var h5_2 = document.createElement("H5")
  howToPlay = "How to Play:" 
  howToPlay1 = "Use the arrow keys to flip the sushi rice on the squares of seaweed."
  howToPlay2 = "Flip until there's no more seaweed left."
  var text1 = document.createTextNode(howToPlay)
  var text2 = document.createTextNode(howToPlay1)
  var text3 = document.createTextNode(howToPlay2)
  h3_1.appendChild(text1)
  h5_1.appendChild(text2)
  h5_2.appendChild(text3)

  var h3_2 = document.createElement("H3")
  var h5_3 = document.createElement("H5")
  var h5_4 = document.createElement("H5")
  var h5_5 = document.createElement("H5")
  cameraControls = "Camera controls:"
  cameraControls1 = "Scroll to zoom"
  cameraControls2 = "Left click and drag to rotate"
  cameraControls3 = "Right click and drag to move the board"
  var text4 = document.createTextNode(cameraControls)
  var text5 = document.createTextNode(cameraControls1)
  var text6 = document.createTextNode(cameraControls2)
  var text7 = document.createTextNode(cameraControls3)
  h3_2.appendChild(text4)
  h5_3.appendChild(text5)
  h5_4.appendChild(text6)
  h5_5.appendChild(text7)

  var h3_3 = document.createElement("H3")
  var text8 = document.createTextNode("Press Space to Start")
  h3_3.appendChild(text8)

  container.appendChild(h3_1)
  container.appendChild(h5_1)
  container.appendChild(h5_2)
  container.appendChild(h3_2)
  container.appendChild(h5_3)
  container.appendChild(h5_4)
  container.appendChild(h5_5)
  container.appendChild(h3_3)
}

function winScreen() {
  container.innerHTML = ""
  var h3_1 = document.createElement("H3")
  var h3_2 = document.createElement("H3")
  var h3_3 = document.createElement("H3")
  var img = document.createElement("img")
  img.setAttribute("src", "textures/sushi.png")
  var text1 = document.createTextNode("Congrats! You made a sushi!")
  var text2 = document.createTextNode("Press Space for a New Game")
  h3_1.appendChild(text1)
  h3_2.appendChild(text2)
  container.appendChild(h3_1)
  container.appendChild(h3_2)
  container.appendChild(h3_3)
  container.appendChild(img)
}

document.addEventListener('keydown', function(event) {
  if (event.key == " ") {
    console.log("space pressed")
    startGame()
  } else if (event.key == "i") {
    console.log("i key pressed")
    instructions()
  } else if (event.key == "r") {
    board.reset()
    block.reset()
  } else {
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

    if (board.didWin()) {
      setTimeout(() => { winScreen() }, 700)
    }
  }
})
