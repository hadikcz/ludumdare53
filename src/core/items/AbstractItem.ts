import { Items } from 'enums/Items';
import { Plants } from 'enums/Plants';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;

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

    pickup (): void {
        this.isPickedUp = true;
        this.body.setAllowGravity(false);
        this.body.setVelocity(0, 0);
        this.body.angularVelocity = 0;

        this.afterTouchGround();
    }

    putDown (x: number, y: number, velocity: Vector2): void {
        this.isPickedUp = false;
        this.body.allowGravity = true;
        this.setPosition(x, y);
        if (velocity !== undefined) {
            this.body.setVelocity(velocity.x * 1.25, velocity.y);
        }

        this.afterTouchGround();
    }

    getItemType (): Items {
        return this.item;
    }

    getPickupText (): string {
        if (this.plant) {
            switch (this.plant) {
                case Plants.CARROT:
                    return 'Pick up carrot';
                case Plants.POTATO:
                    return 'Pick up potato';
                case Plants.TOMATO:
                    return 'Pick up tomato';
                case Plants.CORN:
                    return 'Pick up corn';
                case Plants.WHEAT:
                    return 'Pick up wheat';
                case Plants.SUNFLOWER:
                    return 'Pick up sunflower';
                case Plants.WATERMELON:
                    return 'Pick up watermelon';
            }
        } else {
            switch (this.item) {
                case Items.PLANT:
                    return 'Pick up plant';
                case Items.SHOVEL:
                    return 'Pick up shovel';
                case Items.BUCKET:
                    return 'Pick up bucket';
                case Items.SCYTHE:
                    return 'Pick up scythe';
            }
        }
    }

    canBePickedUp (): boolean {
        return !this.isPickedUp;
    }

}
