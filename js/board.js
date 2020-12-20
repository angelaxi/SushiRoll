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
        this.specialMaterial = new THREE.MeshLambertMaterial({
            map: loader.load('textures/rice.jpg'), side: THREE.DoubleSide
        });
        // comment out before committing
        // this.material = new THREE.MeshLambertMaterial({color: 0x003b00, side: THREE.DoubleSide})
        // this.specialMaterial = new THREE.MeshLambertMaterial({color: 0xfefec8, side: THREE.DoubleSide})

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
        this.duplicates = false
        this.duplicateTiles = []
        this.originalDuplicates = []
    }

    createBoard(numTiles, duplicates) {
        this.duplicates = duplicates
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
            } else {
                console.log(direction)
            }
        }

        this.originalTiles = [... this.tiles]
        this.originalDuplicates = [... this.duplicateTiles]
        console.log(this.numTiles)
        console.log(this.tiles)
      }

      /**
       * 1 space is currently occupied
       * 2 spaces will be generated
       * @param {*} direction 
       */
      generateTile12(direction) {
        var p1 = this.newPosition(direction, this.currPos[0])
        var p2 = this.newPosition(direction, p1)

        // console.log("tile12")
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
        } else if (this.duplicates && !this.end 
                    && this.containsPosition(p1) && this.containsPosition(p2)
                    && !this.containsDuplicate(p1) && !this.containsDuplicate(p2)
                    && !this.tiles[0].positionEquals(p1) && !this.tiles[0].positionEquals(p2)) {

            console.log("duplicate 1")

            this.numTiles++
            var tile1 = new Tile(this.scene, p1, this.specialMaterial, "tile" + this.numTiles)
            this.numTiles++
            var tile2 = new Tile(this.scene, p2, this.specialMaterial, "tile" + this.numTiles)
            this.duplicateTiles.push(tile1)
            this.duplicateTiles.push(tile2)
            this.currPos = [p1, p2]
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
        var p1 = this.newPosition(direction, this.currPos[0])
        if ((direction == 'left' && this.currPos[0].y > this.currPos[1].y)
            || (direction == 'backward' && this.currPos[0].x > this.currPos[1].x)
            || (direction == 'right' && this.currPos[0].y < this.currPos[1].y
            || (direction == 'forward' && this.currPos[0].x < this.currPos[1].x))) {
            p1 = this.newPosition(direction, this.currPos[1])
        }

        // console.log("tile21")
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
        } else if (this.duplicates && !this.end && this.containsPosition(p1) 
                    && !this.containsDuplicate(p1) && !this.tiles[0].positionEquals(p1)) {

            console.log("duplicate 2")

            this.numTiles++
            var tile1 = new Tile(this.scene, p1, this.specialMaterial, "tile" + this.numTiles)
            this.duplicateTiles.push(tile1)
            this.currPos = [p1]
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

        // console.log("tile22")
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
        }  else if (this.duplicates && !this.end 
            && this.containsPosition(p1) && this.containsPosition(p2)
            && !this.containsDuplicate(p1) && !this.containsDuplicate(p2)
            && !this.tiles[0].positionEquals(p1) && !this.tiles[0].positionEquals(p2)) {

            console.log("duplicate 3")

            this.numTiles++
            var tile1 = new Tile(this.scene, p1, this.specialMaterial, "tile" + this.numTiles)
            this.numTiles++
            var tile2 = new Tile(this.scene, p2, this.specialMaterial, "tile" + this.numTiles)
            this.duplicateTiles.push(tile1)
            this.duplicateTiles.push(tile2)
            this.currPos = [p1, p2]
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

      containsDuplicate(pos) {
        for (var i = 0; i < this.duplicateTiles.length; i++) {
            var tile = this.duplicateTiles[i]
            if (tile.positionEquals(pos)) {
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
        var tilesRemoved = 0
        // remove duplicates first
        for (var i = 0; i < this.duplicateTiles.length; i++) {
            var t = this.duplicateTiles[i]
            if (t.blockPositionEquals(tiles[0])) {
              tilesRemoved++
              t.remove()
              this.duplicateTiles.splice(i, 1)
              i--
              console.log("1 duplicate tile removed")
              console.log(t)
  
              if (tilesRemoved == tiles.length) {
                return
              }
            }
            if (tiles.length > 1 && t.blockPositionEquals(tiles[1])) {
              tilesRemoved++
              t.remove()
              this.duplicateTiles.splice(i, 1)
              i--
              console.log("2 duplicate tiles removed")
              console.log(t)
              if (tilesRemoved == tiles.length) {
                  return
              }
            }
        }

        if (tiles.length != tilesRemoved) {
            for (var i = 0; i < this.tiles.length; i++) {
                var t = this.tiles[i]
                if (t.blockPositionEquals(tiles[0])) {
                  tilesRemoved++
                  t.remove()
                  this.tiles.splice(i, 1)
                  i--
                  console.log("1 tile removed")
                  console.log(t)
      
                  if (tilesRemoved == tiles.length) {
                      return
                  }
                }
                if (tiles.length > 1 && t.blockPositionEquals(tiles[1])) {
                  tilesRemoved++
                  t.remove()
                  this.tiles.splice(i, 1)
                  i--
                  console.log("2 tiles removed")
                  console.log(t)
                  if (tilesRemoved == tiles.length) {
                      return
                  }
                }
            }
        }
      }

      didWin() {
          var allRemoved = this.tiles.length == this.finalTiles.length
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
          this.duplicateTiles = [... this.originalDuplicates]

          for (var i = 0; i < this.tiles.length; i++) {
              this.tiles[i].add()
          }

          for (var i = 0; i < this.duplicateTiles.length; i++) {
            this.duplicateTiles[i].add()
        }
      }
}