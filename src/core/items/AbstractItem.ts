import { Items } from 'enums/Items';
import { Plants } from 'enums/Plants';
import GameScene from 'scenes/GameScene';

export abstract class AbstractItem extends Phaser.GameObjects.Sprite {

    private isPickedUp = false;


    // @ts-ignore
    public body: Phaser.Physics.Arcade.Body;

    constructor (
        scene: GameScene,
        x: number,
        y: number,
        texture: string,
        private item: Items,
        private plant?: Plants

    ) {

        console.log(texture);
        super(scene, x, y, 'assets', texture);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

    }

    preUpdate () {
        if (this.body.touching.down) {
            this.afterTouchGround();
        }
    }

    afterTouchGround () {
        this.body.setAngularDrag(150);
        this.body.setDrag(250, 10);
    }

    explode (initY?: number) {
        if (!initY) {
            initY = Phaser.Math.RND.integerInRange(-250, -150);
        }
        this.body.setVelocity(
            Phaser.Math.RND.integerInRange(-80, 80),
            Phaser.Math.RND.integerInRange(initY - 50, initY + 50)
        );

        this.body.angularVelocity = Phaser.Math.RND.integerInRange(0, 100);
    }

}
