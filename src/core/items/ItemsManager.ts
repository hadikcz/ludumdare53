import { AbstractItem } from 'core/items/AbstractItem';
import InteractiveItem from 'core/items/InteractiveItem';
import PlantsManager from 'core/items/plants/PlantsManager';
import { Items } from 'enums/Items';
import ArrayHelpers from 'helpers/ArrayHelpers';
import GameScene from 'scenes/GameScene';

export default class ItemsManager {

    public static readonly PICKUP_RANGE = 25;

    public plantsManager: PlantsManager;

    public interactiveItems: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene
    ) {
        this.plantsManager = new PlantsManager(this.scene);

        this.interactiveItems = this.scene.add.group();

        this.startupSpawn();
    }

    findNearestItem (x: number, y: number): AbstractItem|null {
        let items = this.getAllItems();
        items = items.filter((item: AbstractItem) => {
            return item.canBePickedUp() ? item : null;
        });
        return ArrayHelpers.findLowest<AbstractItem|null>(items, (item: AbstractItem) => {
            let distance = Phaser.Math.Distance.Between(x, y, item.x, y);
            if (distance <= ItemsManager.PICKUP_RANGE) {
                return distance;
            }

            return Infinity;
        });
    }

    getAllItems (): AbstractItem[] {
        return [
            ...this.plantsManager.plantItems.getChildren() as unknown as AbstractItem[],
            ...this.interactiveItems.getChildren() as unknown as AbstractItem[]
        ];
    }

    private startupSpawn (): void {
        for (let i = 0; i < 10; i++) {
            let itemType = Items.SHOVEL;
            let item = new InteractiveItem(this.scene, GameScene.START_X + i * 100, 100, itemType);
            this.interactiveItems.add(item);

            item.explode();
        }
    }
}
