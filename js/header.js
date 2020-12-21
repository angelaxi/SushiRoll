var scene
var camera
var container
var header
var renderer
var geometry
var board
var block
var numMoves
var duplicates
var difficulty

init()

function init() {
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight )
	pickingTexture.texture.minFilter = THREE.LinearFilter
  container = document.getElementById("TitleHeader")
  difficulty = 1
}

function startGame() {
  this.setDifficulty(difficulty)

  container.innerHTML = ""
  canvas = document.createElement("canvas")
  var div = document.createElement("div")
  div.className = "overlay"
  var h4_1 = document.createElement("H4")
  var h4_2 = document.createElement("H4")
  var h4_3 = document.createElement("H4")
  var h4_4 = document.createElement("H4")
  var restart = document.createTextNode("R: Restart")
  var newGame = document.createTextNode("Space: New Game")
  var diff = document.createTextNode("D: Set Difficulty")
  var instructions = document.createTextNode("I: Instructions")
  h4_1.appendChild(restart)
  h4_2.appendChild(newGame)
  h4_3.appendChild(diff)
  h4_4.appendChild(instructions)

  var WIDTH = container.offsetWidth
  var HEIGHT = container.offsetHeight

  renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas, alpha:true})
  renderer.setSize(WIDTH, HEIGHT)
  div.appendChild(renderer.domElement)
  div.appendChild(h4_1)
  div.appendChild(h4_3)
  div.appendChild(h4_4)
  div.appendChild(h4_2)
  container.appendChild(div)

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
  board.createBoard(numMoves, duplicates)

  block = new Block(scene, currPos, startOrient, board)
   
  animate()
}

function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()

  renderer.render(scene, camera)
}

function instructions() {
  container.innerHTML = ""
  var div = document.createElement("div")
  div.className = "blur"
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

  div.appendChild(h3_1)
  div.appendChild(h5_1)
  div.appendChild(h5_2)
  div.appendChild(h3_2)
  div.appendChild(h5_3)
  div.appendChild(h5_4)
  div.appendChild(h5_5)
  div.appendChild(h3_3)

  container.appendChild(div)
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
  var text3 = document.createTextNode("Press D to change the difficulty")
  h3_1.appendChild(text1)
  h3_2.appendChild(text2)
  h3_3.appendChild(text3)
  container.appendChild(h3_1)
  container.appendChild(h3_2)
  container.appendChild(h3_3)
  container.appendChild(img)
}

function difficultyScreen(option) {
  container.innerHTML = ""
  var div = document.createElement("div")
  div.className = "blur"
  var h2_1 = document.createElement("H2")
  var h3_1 = document.createElement("H2")
  var h3_2 = document.createElement("H3")
  var h5 = document.createElement("H5")
  var span = document.createElement("SPAN")

  switch (option) {
    case 1:
      var text1 = document.createTextNode("1: Easy")
      var text2 = document.createTextNode(" \u00A0\u00A0 2: Medium \u00A0\u00A0 3: Hard")
      span.appendChild(text1)
      h3_2.appendChild(span)
      h3_2.appendChild(text2)
      break
    case 2:
      var text1 = document.createTextNode("1: Easy \u00A0\u00A0 ")
      var text2 = document.createTextNode("2: Medium")
      var text3 = document.createTextNode(" \u00A0\u00A0 3: Hard")
      span.appendChild(text2)
      h3_2.appendChild(text1)
      h3_2.appendChild(span)
      h3_2.appendChild(text3)
      break
    case 3:
      var text1 = document.createTextNode("1: Easy \u00A0\u00A0 2: Medium \u00A0\u00A0 ")
      var text2 = document.createTextNode("3: Hard")
      span.appendChild(text2)
      h3_2.appendChild(text1)
      h3_2.appendChild(span)
      break
  }

  var select = document.createTextNode("Please Select a Difficulty")
  var start = document.createTextNode("Press Space to Start")
  var description = document.createTextNode("(In hard mode, there are rice tiles that you need to land on reveal the seaweed underneath)")
  h2_1.appendChild(select)
  h3_1.appendChild(start)
  h5.appendChild(description)
  div.appendChild(h2_1)
  div.appendChild(h5)
  div.appendChild(h3_2)
  div.appendChild(h3_1)
  container.appendChild(div)
}

function setDifficulty(level) {
  console.log("level")
  console.log(level)
  switch (level) {
    case 1:
      numMoves = 7
      duplicates = false
      break
    case 2:
      numMoves = 15
      duplicates = false
      break
    case 3:
      numMoves = 15
      duplicates = true
      break
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key == " ") {
    if (!numMoves) {
      difficulty = 1
    }
    startGame()
  } else if (event.key == "i") {
    instructions()
  } else if (event.key == "r") {
    board.reset()
    block.reset()
  } else if (event.key == "d") {
    difficultyScreen(difficulty)
  } else if (event.key == "1") {
    difficulty = 1
    difficultyScreen(1)
  } else if (event.key == "2") {
    difficulty = 2
    difficultyScreen(2)
  } else if (event.key == "3") {
    difficulty = 3
    difficultyScreen(3)
  } else if (event.key == 'ArrowRight' || event.key == 'ArrowLeft' 
              || event.key == 'ArrowDown' || event.key == 'ArrowUp') {
    if (event.key == 'ArrowRight') {
      block.rotate("right")
    } else if (event.key == 'ArrowLeft') {
      block.rotate("left")
    } else if (event.key == 'ArrowDown') {
      block.rotate("forward")
    } else if (event.key == 'ArrowUp') {
      block.rotate("backward")
    }

    if (board.didWin()) {
      setTimeout(() => { block.wrap() }, 300)
      setTimeout(() => { winScreen() }, 700)
    }
  }
})
