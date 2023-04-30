import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class WorldEnv {

    public static readonly GROUND_OFFSET = 50;
    public static readonly GROUND_Y = 720 - 300;
    public readonly groundGroup: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene
    ) {
        this.groundGroup = this.scene.add.group();
        for (let i = 0; i < 10; i++) {
            let ground = this.scene.add.image(i * 900, WorldEnv.GROUND_Y, 'ground')
                .setOrigin(0, 0)
                .setDepth(Depths.BG_TEXTURE);
            this.scene.physics.world.enable(ground);
            ground.body.setImmovable(true);
            ground.body.allowGravity = false;
            ground.body.setSize(ground.width, ground.height - WorldEnv.GROUND_OFFSET);

            this.groundGroup.add(ground);
        }
    }

    getGroundY (): number {
        // @ts-ignore
        return this.groundGroup.getChildren()[0].y + WorldEnv.GROUND_OFFSET / 2;
    }
}
