class Block {
    constructor(scene, currPos) {
        this.scene = scene;
        this.currPos = currPos;
        this.geometry = new THREE.BoxGeometry(1, 2, 1);
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.block = new THREE.Mesh( this.geometry, this.material );
        // this.block.rotation.set(2, 0, 0.4);
        // this.geometry.translate(-2, 0, -0.4);
        // this.geometry.translate(this.currPos[0].x, this.currPos[0].y, this.currPos[0].z);
        this.bbox = new THREE.Box3().setFromObject(this.block);
        this.block.position.set(this.bbox.min.x, this.bbox.max.y, 0);
        this.pivot = new THREE.Group();
        this.pivot.add(this.block);
        // this.pivot.position.set(-this.bbox.min.x, 0.5 - this.bbox.max.y, 0.5);
        this.scene.add(this.pivot);
        console.log(this.block.position)
        console.log(this.pivot.position)
        // console.log(this.bbox.min.x)
        // console.log(this.bbox.max.y)
        // console.log(-this.bbox.min.x)
        // console.log(0.5 - this.bbox.max.y)
    }

    rotate(direction) {
        // switch(direction) {
        //     case "right":

        // }
        // this.block.position.set(this.bbox.min.x, this.bbox.max.y, 0);
        // this.pivot.position.set(0, 0, 0.5);
        // this.pivot.rotation.z -= 1.5708;

        this.pivot.position.set(-this.bbox.min.x, 0.5 - this.bbox.max.y, 0.5);
        this.pivot.rotation.x += 1.5708;
        // console.log(this.block.position)
    }
}