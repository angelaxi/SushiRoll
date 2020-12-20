class Tile {
    constructor(scene, position, material, name) {
        this.scene = scene
        this.position = position
        this.rotationX = 1.5708
        this.geometry = new THREE.PlaneGeometry(1, 1)
        this.tile = new THREE.Mesh(this.geometry, material)
        this.tile.rotation.set(this.rotationX, 0, 0)
        this.tile.name = name
        this.name = name
        this.geometry.translate(position.x, position.y, position.z)
        this.scene.add(this.tile)
    }

    remove() {
        this.scene.remove(this.tile)
    }

    add() {
        this.scene.add(this.tile)
    }

    positionEquals(position) {
        if (Math.floor(this.position.x) == Math.floor(position.x) 
            && Math.floor(this.position.y) == Math.floor(position.y)
            && Math.floor(this.position.z) == Math.floor(position.z)) {
                return true
        }
        return false
    }

    blockPositionEquals(position) {
        // console.log("tile vs block position")
        // console.log(this.position)
        // console.log(position)
        var tx = (this.position.x > 0) ? Math.floor(this.position.x) : Math.ceil(this.position.x)
        var ty = (this.position.y > 0) ? Math.floor(this.position.y) : Math.ceil(this.position.y)
        var px = (position.x > 0) ? Math.floor(position.x) : Math.ceil(position.x)
        var pz = (position.z > 0) ? Math.floor(position.z) : Math.ceil(position.z)
        if (tx == px && ty == pz) {
            return true
        }
        return false
    }
}