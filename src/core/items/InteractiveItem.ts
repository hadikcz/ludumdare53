import { AbstractItem } from 'core/items/AbstractItem';
import { Depths } from 'enums/Depths';
import { Items } from 'enums/Items';
import GameScene from 'scenes/GameScene';

export default class InteractiveItem extends AbstractItem {

    constructor (
            public scene: GameScene,
            x: number,
            y: number,
            item: Items
    ) {
        let texture = getItemTexture(item);
        super(scene, x, y, texture, item);

        this.setDepth(Depths.INTERACTIVE_ITEM);
    }

    pickup (): void {
        super.pickup();

        this.setDepth(Depths.PICKED_ITEM);
    }

    putDown (x: number, y: number, velocity: Phaser.Math.Vector2) {
        super.putDown(x, y, velocity);

        this.setDepth(Depths.INTERACTIVE_ITEM);
    }
}

function getItemTexture (item: Items): string {
    switch (item) {
        case Items.SCYTHE:
            return 'scythe';
        case Items.BUCKET:
            return 'bucket';
        case Items.SHOVEL:
            return 'shovel';
        case Items.PLANT:
            throw new Error('Plant item has no texture');
        default:
            throw new Error('Unknown plant type');
    }
}
