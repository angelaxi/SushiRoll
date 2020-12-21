var sushi

class Block {
    constructor(scene, currPos, orientation, board) {
        this.orientation = orientation
        this.origOrient = orientation
        this.scene = scene
        this.origPos = currPos
        this.currPos = currPos
        this.board = board

        this.geometry = this.createBoxWithRoundedEdges(1, 2, 1, .25, 10)
        this.geometry.computeVertexNormals()

        var loader = new THREE.TextureLoader();
        var map = loader.load( 'textures/rice.jpg' );
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;

        this.material = new THREE.MeshPhongMaterial( {
            color: 0xfcfcfc,
            map: map
        } );

        this.block = new THREE.Mesh( this.geometry, this.material )
        sushi = this.block
        this.scene.add(this.block)
    }

    reset() {
        sushi.position.set(0, 0, 0)
        sushi.rotation.set(0, 0, 0)
        sushi.scale.set(1, 1, 1)
        this.currPos = this.origPos
        this.orientation = this.origOrient
    }

    wrap() {
        var loader = new THREE.TextureLoader()
        var map = loader.load('textures/seaweed.jpg')
        var material = new THREE.MeshBasicMaterial({
            map: map,
        });
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;

        var geometry = this.createBoxWithRoundedEdges(1.1, 1.8, 1.1, .25, 5)
        if (this.orientation == "horizontalX") {
            geometry = this.createBoxWithRoundedEdges(1.8, 1.1, 1.1, .25, 5)
        } else if (this.orientation == "horizontalZ") {
            geometry = this.createBoxWithRoundedEdges(1.1, 1.1, 1.8, .25, 5)
        }
        geometry.computeVertexNormals()
        var wrap = new THREE.Mesh( geometry, material )
        wrap.position.set(sushi.position.x, sushi.position.y, sushi.position.z)
        this.scene.add(wrap)
    }

    getTiles(pos, orientation) {
        var tiles = []
        if (orientation == "vertical") {
            tiles.push(pos)
        } else if (orientation == "horizontalX") {
            var tile1 = {x: pos.x + 0.5, y: pos.y, z: pos.z}
            var tile2 = {x: pos.x - 0.5, y: pos.y, z: pos.z}
            tiles.push(tile1)
            tiles.push(tile2)
        } else if (orientation == "horizontalZ") {
            var tile1 = {x: pos.x, y: pos.y, z: pos.z + 0.5}
            var tile2 = {x: pos.x, y: pos.y, z: pos.z - 0.5}
            tiles.push(tile1)
            tiles.push(tile2)
        }
        return tiles
    }

    rotate(direction) {
        var position = {x : this.block.position.x, y: this.block.position.y, z: this.block.position.z}
        var rotation = {x : this.block.rotation.x, y: this.block.rotation.y, z: this.block.rotation.z}
        var positionEnd = {x : this.block.position.x, y: this.block.position.y, z: this.block.position.z}
        var rotationEnd = {x : this.block.rotation.x, y: this.block.rotation.y, z: this.block.rotation.z}
        var scale = {x: 1, y: 1, z: 1}
        var rot = 1.5708
        var landingTiles = []
        var prevOrientation = this.orientation
        var prevPosition = this.block.position.clone()

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

        // check if move if valid
        landingTiles = this.getTiles(positionEnd, this.orientation)
        var validMove = this.board.containsTile(landingTiles[0])
        if (landingTiles.length > 1) {
            validMove = validMove && this.board.containsTile(landingTiles[1])
        }

        if (validMove) {
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
                sushi.position.set(positionEnd.x, positionEnd.y, positionEnd.z)
                sushi.scale.set(scale.x, scale.y, scale.z)
                sushi.rotation.set(0, 0, 0)
            });

            var object = new THREE.Object3D()
            var worldPosition = object.localToWorld(prevPosition)
            var tilesToRemove = this.getTiles(worldPosition, prevOrientation)
            console.log("tiles to remove:")
            console.log(tilesToRemove)
            this.board.removeTiles(tilesToRemove)
        } else {
            // bounce back if move is not valid
            var tweenPos = new TWEEN.Tween(position).to(positionEnd, 300);
            tweenPos.repeat(1)
            tweenPos.yoyo(true)
            tweenPos.start();
            tweenPos.onUpdate(function(){
                sushi.position.set(position.x, position.y, position.z);
            });

            var tweenRot = new TWEEN.Tween(rotation).to(rotationEnd, 300);
            tweenRot.repeat(1)
            tweenRot.yoyo(true)
            tweenRot.start();
            tweenRot.onUpdate(function(){
                sushi.rotation.set(rotation.x, rotation.y, rotation.z);
            });

            this.orientation = prevOrientation
        }
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
          amount: depth - radius0 * 2,
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