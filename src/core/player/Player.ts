import PlayerCharacterControls, { MovementDirection } from 'core/player/PlayerCharacterControls';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Player extends Phaser.GameObjects.Container {

    private static readonly MOVEMENT_SPEED = 250;
    private static readonly JUMP_SPEED = 170;

    // @ts-ignore
    public body: Phaser.Physics.Arcade.Body;
    private controls: PlayerCharacterControls;
    private characterImage: Phaser.GameObjects.Image;

    constructor (
        public scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // @ts-ignore
        this.body = this.body as Phaser.Physics.Arcade.Body;
        // body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);

        this.body.setDragX(600);
        let widthSize = 40;
        let heightSize = 134;
        this.body.setSize(widthSize, heightSize);
        this.body.setOffset(-widthSize / 2, 0);

        this.controls = new PlayerCharacterControls(this.scene, this);

        this.setDepth(Depths.PLAYER);
        this.scene.cameras.main.startFollow(this, false, 0.85, 0.85, 0, 0); //210

        this.characterImage = this.scene.add.image(0, 0, 'game', 'player').setOrigin(0.5, 0);
        this.add(this.characterImage);

    }

    preUpdate (): void {
        this.controls.update();
    }

    moveToDir (direction: MovementDirection) {
        if (direction === MovementDirection.LEFT) {
            this.characterImage.setScale(-1, 1);
            // this._overHeadText.setScale(-0.25, 0.25);
            this.body.setVelocityX(-Player.MOVEMENT_SPEED);
        } else if (direction === MovementDirection.RIGHT) {
            this.body.setVelocityX(Player.MOVEMENT_SPEED);

            // this._overHeadText.setScale(0.25, 0.25);
            this.characterImage.setScale(1, 1);
        }

        if (direction === MovementDirection.JUMP && this.body.touching.down) {
            this.body.setVelocityY(-Player.JUMP_SPEED);
        }

        if (direction === MovementDirection.STOPX) {
            this.body.setVelocityX(0);
        }
    }
}
