import Field from 'core/field/Field';
import ItemsManager from 'core/items/ItemsManager';
import { Events } from 'enums/Events';
import { Plants } from 'enums/Plants';
import ArrayHelpers from 'helpers/ArrayHelpers';
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

        this.scene.events.on(Events.PLANT_SEED, this.plantSeed.bind(this));
    }

    findNearestFieldInRange (x: number, y: number): Field|null {
        return ArrayHelpers.findLowest<Field|null>(this.fieldItems.getChildren() as unknown as Field[], (item: Field) => {
            let distance = Phaser.Math.Distance.Between(x, y, item.x, y);
            if (distance <= ItemsManager.PICKUP_RANGE) {
                return distance;
            }

            return Infinity;
        });
    }

    plantSeed (plant: Plants): void {
        if (!this.scene.player.nearestField) return;
        let field = this.scene.player.nearestField;
        // check coins
        if (!field.canPlant()) {
            return;
        }
        this.scene.player.nearestField.seed(plant);
        // take coins
        this.scene.events.emit(Events.CLOSE_ALL_MODAL);

        this.scene.player.lockedMovementWhileOpenModal = false;
    }

    private getGroundY (): number {
        return this.scene.worldEnv.getGroundY() + 10;
    }
}
