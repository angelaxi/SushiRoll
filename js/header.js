var scene;
var camera;
var camera_piv;
var camera_y;
var container;
var header;
var renderer;
var pickingTexture;
var mainmenu_sprite;
var geometry;
var cube;
var pivot;
var block;

init();
animate();

function init() {
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
	pickingTexture.texture.minFilter = THREE.LinearFilter;
  container = document.getElementById("TitleHeader");
  canvas = document.createElement("canvas");
  var WIDTH = container.offsetWidth;
  var HEIGHT = container.offsetHeight;

  renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas, alpha:true});
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);

  // camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
  // camera.position.set(0, 0, 10);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.set(4, 5, 10);
  camera.lookAt(0, 0, 0)

  scene = new THREE.Scene();

  var currPos = [new THREE.Vector3(-2, 0, 0)];
  var board = new Board("vertical", currPos, scene);
  board.createBoard(0)

  block = new Block(scene, currPos);

  // geometry = new THREE.BoxGeometry(1, 1, 2);
  // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // cube = new THREE.Mesh( geometry, material );
  // cube.rotation.set(2, 0, 0.4)
  // geometry.translate(-2, 0, -0.4);

  // var bbox = new THREE.Box3().setFromObject(cube);
  // cube.position.set(bbox.min.x, bbox.max.y, 0);
  // pivot = new THREE.Group();
  // pivot.add(cube);
  // pivot.position.set(-bbox.min.x, 0.5-bbox.max.y, 0.5);
  // scene.add(pivot);

  function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }
   
  render();
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

document.addEventListener('keydown', function(event) {
  if (event.key == " ") {
    // console.log(tile.rotation.z)
  }

  if (event.key == 'ArrowRight') {
    console.log("right arrow pressed")
    block.rotate("right")
  }
});
