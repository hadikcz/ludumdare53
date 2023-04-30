import { AbstractItem } from 'core/items/AbstractItem';
import { Items } from 'enums/Items';
import { Plants } from 'enums/Plants';
import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class PlantItem extends AbstractItem {

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        plant: Plants
    ) {
        let texture = getPlantTexture(plant);

        console.log(texture);

        super(scene, x, y, 'crops/' + texture, Items.PLANT, plant);

        this.setAngle(NumberHelpers.randomIntInRange(-180, 180));
    }
}


function getPlantTexture (plant: Plants): string {
    switch (plant) {
        case Plants.CARROT:
            return 'carrot_item';
        case Plants.CORN:
            return 'corn_item';
        case Plants.POTATO:
            return 'potato_item';
        case Plants.SUNFLOWER:
            return 'sunflower_item';
        case Plants.TOMATO:
            return 'tomato_item';
        case Plants.WATERMELON:
            return 'watermelon_item';
        case Plants.WHEAT:
            return 'wheat_item';
        default:
            throw new Error('Unknown plant type');
    }
}
