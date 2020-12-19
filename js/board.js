class Board {
    constructor(sushiOrientation, currPos, scene) {
        this.sushiOrientation = sushiOrientation
        this.scene = scene
        this.currPos = currPos
        this.offset = 0.01
        this.rotationX = 1.5708
        const loader = new THREE.TextureLoader();
        this.material = new THREE.MeshLambertMaterial({
            map: loader.load('textures/seaweed.jpg'), side: THREE.DoubleSide
        });
        // comment out before committing
        // this.material = new THREE.MeshLambertMaterial({color: 0x003b00, side: THREE.DoubleSide})
        this.directions = ["forward", "backward", "right", "left"]
        this.vectors = new Map()
        this.vectors["forward"] = new THREE.Vector3(1 + this.offset, 0, 0)
        this.vectors["backward"] =  new THREE.Vector3(-1 - this.offset, 0, 0)
        this.vectors["right"] =  new THREE.Vector3(0, 1 + this.offset, 0)
        this.vectors["left"] =  new THREE.Vector3(0, -1 - this.offset, 0)
        this.tiles = []
        this.originalTiles = []
        this.end = false
        this.finalTiles = []
        this.numTiles = 0
    }

    createBoard(numTiles) {
        // generate starting tile
        const loader = new THREE.TextureLoader();
        var startMaterial = new THREE.MeshLambertMaterial({
            map: loader.load('textures/bamboo_mat.jpg'), side: THREE.DoubleSide
        });
        // comment out before committing
        // startMaterial = new THREE.MeshLambertMaterial({color: 0xe0ccb1, side: THREE.DoubleSide})
        this.numTiles++
        var tile = new Tile(this.scene, this.currPos[0], startMaterial, "tile" + this.numTiles)
        this.tiles.push(tile)

        // generate other tiles
        for (var i = 0; i < numTiles; i++) {

            // var numOfMeshes = 0;
            // this.scene.traverse( function( child ) {
            //     if( child instanceof THREE.Mesh ) {
            //         numOfMeshes++;
            //     }
            // } );
            // console.log("number of tiles:" + numOfMeshes)

            // choose direction
            var direction = this.directions[Math.floor(Math.random() * this.directions.length)]

            if (i == numTiles - 1) {
                this.material = startMaterial
                this.end = true
            }

            var tileCreated = false;

            switch(this.sushiOrientation) {
                case "vertical":
                    tileCreated = this.generateTile12(direction)
                    if (direction == "forward" || direction == "backward") {
                        if (tileCreated) {
                            this.sushiOrientation = "horizontalX"
                        }
                    } else if (tileCreated) {
                        this.sushiOrientation = "horizontalZ"
                    }
                    break
                case "horizontalX":
                    if (direction == "forward" || direction == "backward") {
                        if (tileCreated = this.generateTile21(direction)) {
                            this.sushiOrientation = "vertical"
                        }
                    } else if (tileCreated = this.generateTile22(direction)) {
                        this.sushiOrientation = "horizontalX"
                    } 
                    break
                case "horizontalZ":
                    if (direction == "forward" || direction == "backward") {
                        if (tileCreated = this.generateTile22(direction)) {
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

        this.originalTiles = [... this.tiles]
      }

      /**
       * 1 space is currently occupied
       * 2 spaces will be generated
       * @param {*} direction 
       */
      generateTile12(direction) {
        var p1 = this.newPosition(direction, this.currPos[0])
        var p2 = this.newPosition(direction, p1)

        // console.log("positions")
        // console.log(p1)
        // console.log(p2)

        if (!this.containsPosition(p1) && !this.containsPosition(p2)) {
            this.numTiles++
            var tile1 = new Tile(this.scene, p1, this.material, "tile" + this.numTiles)
            this.numTiles++
            var tile2 = new Tile(this.scene, p2, this.material, "tile" + this.numTiles)
            this.tiles.push(tile1)
            this.tiles.push(tile2)
            this.currPos = [p1, p2]
            if (this.end) {
                this.finalTiles.push(tile1)
                this.finalTiles.push(tile2)
            }
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
        var p1 = this.newPosition(direction, this.currPos[1])

        // console.log("positions")
        // console.log(p1)

        if (!this.containsPosition(p1)) {
            this.numTiles++
            var tile1 = new Tile(this.scene, p1, this.material, "tile" + this.numTiles)
            this.tiles.push(tile1)
            this.currPos = [p1]
            if (this.end) {
                this.finalTiles.push(tile1)
            }
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
        var p1 = this.newPosition(direction, this.currPos[0])
        var p2 = this.newPosition(direction, this.currPos[1])

        // console.log("positions")
        // console.log(p1)
        // console.log(p2)

        if (!this.containsPosition(p1) && !this.containsPosition(p2)) {
            this.numTiles++
            var tile1 = new Tile(this.scene, p1, this.material, "tile" + this.numTiles)
            this.numTiles++
            var tile2 = new Tile(this.scene, p2, this.material, "tile" + this.numTiles)
            this.tiles.push(tile1)
            this.tiles.push(tile2)
            this.currPos = [p1, p2]
            if (this.end) {
                this.finalTiles.push(tile1)
                this.finalTiles.push(tile2)
            }
            return true
        }
        return false
      }

      containsPosition(pos) {
          for (var i = 0; i < this.tiles.length; i++) {
              var tile = this.tiles[i]
              if (tile.positionEquals(pos)) {
                  return true
              }
          }
          return false
      }

      containsTile(pos) {
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i]
            if (tile.blockPositionEquals(pos)) {
                return true
            }
        }
        return false
      }

      newPosition(direction, currPos) {
          currPos = currPos.clone()
          return currPos.add(this.vectors[direction])
      }
      
      removeTiles(tiles) {
        for (var i = 0; i < this.tiles.length; i++) {
          var t = this.tiles[i]
          if (t.blockPositionEquals(tiles[0])) {
            t.remove()
            this.tiles.splice(i, 1)
            i--
            // console.log("1 tile removed")
            // console.log(t)
          }
          if (tiles.length > 1 && t.blockPositionEquals(tiles[1])) {
            t.remove()
            this.tiles.splice(i, 1)
            i--
            // console.log("2 tiles removed")
            // console.log(t)
          }
        }
      }

      didWin() {
          var allRemoved = this.tiles.length < 3
          if (this.currPos.length != this.finalTiles.length) {
              return false
          }

          if (this.currPos.length == 1) {
              return this.finalTiles[0].positionEquals(this.currPos[0]) && allRemoved
          } else if (this.finalTiles[0].positionEquals(this.currPos[0])) {
              return this.finalTiles[1].positionEquals(this.currPos[1]) && allRemoved
          } else if (this.finalTiles[1].positionEquals(this.currPos[0])) {
              return this.finalTiles[0].positionEquals(this.currPos[1]) && allRemoved
          }

          return false
      }

      reset() {
          console.log("reset")
          this.tiles = [... this.originalTiles]

          for (var i = 0; i < this.tiles.length; i++) {
              this.tiles[i].add()
          }
      }
}