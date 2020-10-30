var sushi

class Block {
    constructor(scene, currPos, orientation) {
        this.orientation = orientation
        this.scene = scene
        this.currPos = currPos
        // this.geometry = new THREE.BoxGeometry(1, 2, 1)
        this.geometry = createBoxWithRoundedEdges(1, 2, 1, .25, 3)
        this.geometry.computeVertexNormals()

        var loader = new THREE.CubeTextureLoader();
        loader.setCrossOrigin( "" );
        loader.setPath( 'https://threejs.org/examples/textures/cube/pisa/' );

        var cubeTexture = loader.load( [
        'px.png', 'nx.png',
        'py.png', 'ny.png',
        'pz.png', 'nz.png'
        ] );
        
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeTexture } );

        // var textureMap = new THREE.CubeTextureLoader().load("textures/rice.jpg")
        // this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: textureMap } );

        // this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        this.block = new THREE.Mesh( this.geometry, this.material )
        // this.geometry.translate(currPos[0].x, currPos[0].y + 1, currPos[0].z)
        sushi = this.block
        // this.block.rotation.set(2, 0, 0.4)
        // this.geometry.translate(-2, 0, -0.4)
        // this.geometry.translate(this.currPos[0].x, this.currPos[0].y, this.currPos[0].z)
        // this.bbox = new THREE.Box3().setFromObject(this.block)
        // this.block.position.set(this.bbox.min.x, this.bbox.max.y, 0)
        // this.pivot = new THREE.Object3D()
        // this.pivot.add(this.block)
        // this.pivot.position.set(-this.bbox.min.x, 0.5 - this.bbox.max.y, 0.5)
        // this.scene.add(this.pivot)
        this.scene.add(this.block)
        console.log("block position")
        console.log(this.block.position)
    }

    // animate() {
    //     requestAnimationFrame(animate)
    //     this.block.rotation.z -= 0.1
    //     renderer.render(scene, camera)
    // }

    rotate(direction) {
        var position = {x : this.block.position.x, y: this.block.position.y, z: this.block.position.z}
        var rotation = {x : this.block.rotation.x, y: this.block.rotation.y, z: this.block.rotation.z}
        var positionEnd = {x : this.block.position.x, y: this.block.position.y, z: this.block.position.z}
        var rotationEnd = {x : this.block.rotation.x, y: this.block.rotation.y, z: this.block.rotation.z}
        var scale = {x: 1, y: 1, z: 1}
        var rot = 1.5708

        console.log(this.orientation)

        if (direction == "right") {
            rotationEnd.z -= rot
            switch (this.orientation) {
                case "vertical":
                    positionEnd.x += 1.5
                    positionEnd.y -= 0.5
                    scale.x = 2
                    scale.y = 0.5
                    this.orientation = "horizontalX"
                    break
                case "horizontalX":
                    positionEnd.x += 1.5
                    positionEnd.y += 0.5
                    this.orientation = "vertical"
                    break
                case "horizontalZ":
                    positionEnd.x += 1.0
                    scale.y = 0.5
                    scale.z = 2
                    this.orientation = "horizontalZ"
                    break
            }
        } else if (direction == "left") {
            rotationEnd.z += rot
            switch (this.orientation) {
                case "vertical":
                    positionEnd.x -= 1.5
                    positionEnd.y -= 0.5
                    scale.x = 2
                    scale.y = 0.5
                    this.orientation = "horizontalX"
                    break
                case "horizontalX":
                    positionEnd.x -= 1.5
                    positionEnd.y += 0.5
                    this.orientation = "vertical"
                    break
                case "horizontalZ":
                    positionEnd.x -= 1.0
                    scale.y = 0.5
                    scale.z = 2
                    this.orientation = "horizontalZ"
                    break
            }
        } else if (direction == "forward") {
            rotationEnd.x += rot
            switch (this.orientation) {
                case "vertical":
                    positionEnd.z += 1.5
                    positionEnd.y -= 0.5
                    scale.z = 2
                    scale.y = 0.5
                    this.orientation = "horizontalZ"
                    break
                case "horizontalX":
                    positionEnd.z += 1.0
                    scale.x = 2
                    scale.y = 0.5
                    this.orientation = "horizontalX"
                    break
                case "horizontalZ":
                    positionEnd.z += 1.5
                    positionEnd.y += 0.5
                    this.orientation = "vertical"
                    break
            }
        } else if (direction == "backward") {
            rotationEnd.x -= rot
            switch (this.orientation) {
                case "vertical":
                    positionEnd.z -= 1.5
                    positionEnd.y -= 0.5
                    scale.z = 2
                    scale.y = 0.5
                    this.orientation = "horizontalZ"
                    break
                case "horizontalX":
                    positionEnd.z -= 1.0
                    scale.x = 2
                    scale.y = 0.5
                    this.orientation = "horizontalX"
                    break
                case "horizontalZ":
                    positionEnd.z -= 1.5
                    positionEnd.y += 0.5
                    this.orientation = "vertical"
                    break
            }
        }

        console.log("target rotation")
        console.log(rotationEnd)
        console.log("scale")
        console.log(scale)

        var tweenPos = new TWEEN.Tween(position).to(positionEnd, 300);
        tweenPos.easing(TWEEN.Easing.Quadratic.Out);
        tweenPos.start();
        tweenPos.onUpdate(function(){
            sushi.position.set(position.x, position.y, position.z);
        });

        var tweenRot = new TWEEN.Tween(rotation).to(rotationEnd, 300);
        tweenRot.easing(TWEEN.Easing.Quadratic.Out);
        tweenRot.start();
        tweenRot.onUpdate(function(){
            sushi.rotation.set(rotation.x, rotation.y, rotation.z);
        });
        tweenRot.onComplete(function(){ 
            // reset rotation
            sushi.scale.set(scale.x, scale.y, scale.z)
            sushi.rotation.set(0, 0, 0)
        });
    }

    createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
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
}