import { AbstractItem } from 'core/items/AbstractItem';
import PlantsManager from 'core/items/plants/PlantsManager';
import ArrayHelpers from 'helpers/ArrayHelpers';
import GameScene from 'scenes/GameScene';

export default class ItemsManager {

    public plantsManager: PlantsManager;

    constructor (
        private scene: GameScene
    ) {
        this.plantsManager = new PlantsManager(this.scene);
    }

    findNearestItem (x: number, y: number): AbstractItem|null {
        let items = this.getAllItems();
        return ArrayHelpers.findLowest<AbstractItem|null>(items, (item: AbstractItem) => {
            return Phaser.Math.Distance.Between(x, y, item.x, item.y);
        });
    }

    getAllItems (): AbstractItem[] {
        return [
            ...this.plantsManager.plantItems.getChildren() as unknown as AbstractItem[]
        ];
    }
}

