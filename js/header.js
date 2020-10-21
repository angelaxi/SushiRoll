var scene;
var camera;
var camera_piv;
var camera_y;
var container;
var header;
var renderer;
var pickingTexture;
var mainmenu_sprite;

init();
// animate();

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

  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
  camera.position.set(0, 0, 10);
  // camera_y = new THREE.Object3D();
  // camera_y.position.set(0, 0, 0);
  // camera_piv = new THREE.Object3D();
  // camera_piv.position.set(1, 0, 0);
  // camera_y.rotateY(0.7);
  // camera_y.add(camera_piv);
  // camera_piv.add( camera );
  // camera_piv.rotateX(-0.2);
  // camera_y.position.set(0, 0, 0);
  // camera.lookAt(camera_y.position);

  // var mainMenuMap = new THREE.TextureLoader().load( "textures/ui_mainmenu.png" );
  // var mainMenuMat = new THREE.SpriteMaterial( { map: mainMenuMap, color: 0xffffff } );
  // mainMenuMat.depthTest = false;
  // mainmenu_sprite = new THREE.Sprite( mainMenuMat );
  // mainmenu_sprite.position.set(0, 0, -1);
  // mainmenu_sprite.scale.set(1, 1, 1);
  // camera.add(mainmenu_sprite);

  scene = new THREE.Scene();

  var currPos = [new THREE.Vector3(-2, -2, 0)];
  var board = new Board("vertical", currPos, scene);
  board.createBoard(10)

  function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }
   
  render();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

document.addEventListener('keydown', function(event) {
  if (event.key == " ") {
    header = document.getElementById("header");
    header.style.visibility = "hidden";
  }
});
