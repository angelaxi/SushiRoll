class Board {
    constructor(sushiOrientation, currPos, scene) {
        this.sushiOrientation = sushiOrientation
        this.scene = scene
        this.currPos = currPos
        this.offset = 0.01
        this.rotationX = 1.5708
        this.material = new THREE.MeshBasicMaterial({color: 0x003b00, side: THREE.DoubleSide})
        this.directions = ["forward", "right", "left"]
        this.vectors = new Map()
        this.vectors["forward"] = new THREE.Vector3(1 + this.offset, 0, 0)
        this.vectors["backward"] =  new THREE.Vector3(-1 - this.offset, 0, 0)
        this.vectors["right"] =  new THREE.Vector3(0, 1 + this.offset, 0)
        this.vectors["left"] =  new THREE.Vector3(0, -1 - this.offset, 0)
        this.tiles = []
        this.positions = []
    }

    createBoard(numTiles) {
        // generate starting tile
        var startMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
        var geometry = new THREE.PlaneGeometry(1, 1)
        var tile = new THREE.Mesh(geometry, startMaterial)
        tile.rotation.set(this.rotationX, 0, 0)
        geometry.translate(this.currPos[0].x, this.currPos[0].y, this.currPos[0].z)
        scene.add(tile)
        this.tiles.push(tile)
        this.positions.push(this.currPos[0])

        // generate other tiles
        for (var i = 0; i < numTiles; i++) {
            // choose direction
            var direction = this.directions[Math.floor(Math.random() * this.directions.length)]
            if (i == numTiles - 1) {
                this.material = startMaterial
            }
            console.log(direction)
            console.log(this.sushiOrientation)

            var tileCreated = false;

            switch(this.sushiOrientation) {
                case "vertical":
                    if (direction == "forward" && (tileCreated = this.generateTile12(direction))) {
                        this.sushiOrientation = "horizontalX"
                    } else if (tileCreated) {
                        this.sushiOrientation = "horizontalZ"
                    }
                    break
                case "horizontalX":
                    if (direction == "forward") {
                        if (tileCreated = this.generateTile21(direction)) {
                            this.sushiOrientation = "vertical"
                        }
                    } else if (tileCreated = this.generateTile22(direction)) {
                        this.sushiOrientation = "horizontalX"
                    } 
                    break
                case "horizontalZ":
                    if (direction == "forward") {
                        if (ttileCreated = his.generateTile22(direction)) {
                            this.sushiOrientation = "horizontalZ"
                        }
                    } else if (tileCreated = this.generateTile21(direction)) {
                        this.sushiOrientation = "vertical"
                    }
            }

            if (!tileCreated) {
                i--
            }
        }
      }

      /**
       * 1 space is currently occupied
       * 2 spaces will be generated
       * @param {*} direction 
       */
      generateTile12(direction) {
        console.log("generateTile12")
        var geometry1 = new THREE.PlaneGeometry(1, 1)
        var tile1 = new THREE.Mesh(geometry1, this.material)
        tile1.rotation.set(this.rotationX, 0, 0)
        var p1 = this.newPosition(direction, this.currPos[0])
        geometry1.translate(p1.x, p1.y, p1.z)

        var geometry2 = new THREE.PlaneGeometry(1, 1)
        var tile2 = new THREE.Mesh(geometry2, this.material)
        tile2.rotation.set(this.rotationX, 0, 0)
        var p2 = this.newPosition(direction, p1)
        geometry2.translate(p2.x, p2.y, p2.z)

        if (!this.containsPosition(p1) && !this.containsPosition(p2)) {
            this.scene.add(tile1)
            this.scene.add(tile2)
            this.tiles.push(tile1)
            this.tiles.push(tile2)
            this.positions.push(p1)
            this.positions.push(p2)
            this.currPos = [p1, p2]
            console.log(this.currPos)
            return true
        }
        return false
      }

      /**
       * 2 spaces are currently occupied
       * 1 space will be generated
       * @param {*} direction 
       */
      generateTile21(direction) {
        console.log("generateTile21")
        var geometry1 = new THREE.PlaneGeometry(1, 1)
        var tile1 = new THREE.Mesh(geometry1, this.material)
        tile1.rotation.set(this.rotationX, 0, 0)
        var p1 = this.newPosition(direction, this.currPos[1])
        geometry1.translate(p1.x, p1.y, p1.z)

        if (!this.containsPosition(p1)) {
            this.scene.add(tile1)
            this.tiles.push(tile1)
            this.positions.push(p1)
            this.currPos = [p1]
            console.log(this.currPos)
            return true
        }
        return false
      }

      /**
       * 2 spaces are currently occupied
       * 2 spaces will be generated
       * @param {*} direction 
       */
      generateTile22(direction) {
        console.log("generateTile22")
        var geometry1 = new THREE.PlaneGeometry(1, 1)
        var tile1 = new THREE.Mesh(geometry1, this.material)
        tile1.rotation.set(this.rotationX, 0, 0)
        var p1 = this.newPosition(direction, this.currPos[0])
        geometry1.translate(p1.x, p1.y, p1.z)

        var geometry2 = new THREE.PlaneGeometry(1, 1)
        var tile2 = new THREE.Mesh(geometry2, this.material)
        tile2.rotation.set(this.rotationX, 0, 0)
        var p2 = this.newPosition(direction, this.currPos[1])
        geometry2.translate(p2.x, p2.y, p2.z)

        if (!this.containsPosition(p1) && !this.containsPosition(p2)) {
            this.scene.add(tile1)
            this.scene.add(tile2)
            this.tiles.push(tile1)
            this.tiles.push(tile2)
            this.positions.push(p1)
            this.positions.push(p2)
            this.currPos = [p1, p2]
            console.log(this.currPos)
            return true
        }
        return false
      }

      containsPosition(pos) {
          for (var i = 0; i < this.positions.length; i++) {
              var p = this.positions[i]
              if (pos.x == p.x && pos.y == p.y && pos.z == p.z) {
                  return true
              }
          }
          return false
      }

      newPosition(direction, currPos) {
          currPos = currPos.clone()
          return currPos.add(this.vectors[direction])
      }
      
}