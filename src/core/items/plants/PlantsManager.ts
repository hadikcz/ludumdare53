import PlantItem from 'core/items/plants/PlantItem';
import { Plants } from 'enums/Plants';
import GameScene from 'scenes/GameScene';

export default class PlantsManager {

    public plantItems: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene
    ) {
        this.plantItems = this.scene.add.group();

        for (let i = 0; i < 10; i++) {
            let plant = new PlantItem(this.scene, GameScene.START_X + i * 100, 100, Plants.CARROT);
            this.plantItems.add(plant);

            plant.explode();
        }
    }
}
