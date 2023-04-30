import Field from 'core/field/Field';
import GameScene from 'scenes/GameScene';

export default class FieldManager {

    public fieldItems: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene
    ) {
        this.fieldItems = this.scene.add.group();

        for (let i = 0; i < 3; i++) {
            let field = new Field(this.scene, GameScene.START_X - 400 + i * 100, this.getGroundY());

            this.fieldItems.add(field);
        }
    }

    private getGroundY (): number {
        return this.scene.worldEnv.getGroundY() + 10;
    }
}
