import GameScene from "scenes/GameScene";
import {Depths} from "enums/Depths";
import {PlantPhase} from "enums/PlantPhase";
import {Plants} from "enums/Plants";
import delay from "delay";
import ProgressBarUI from "libs/ProgressBarUI";

export default class Field extends Phaser.GameObjects.Image {


    private static readonly GROWED_WAITING_FOR_WATER = 25000;
    private static readonly GROWED_WAITING_FOR_GATHER = 30000;
    // private static readonly WAIT_BEFORE_NEXT_GROW = 5000;
    private static readonly WAIT_BEFORE_NEXT_GROW = 500;


    private phase: PlantPhase = PlantPhase.EMPTY;

    private crop: Plants|null = null;
    private healthbar: ProgressBarUI;
    private waterDropletImage: Phaser.GameObjects.Image;
    private timeEventWaitForWater1!: Phaser.Time.TimerEvent;
    private waterBeforeDieInterval!: NodeJS.Timer;
    private scytheImage: Phaser.GameObjects.Image;

    constructor(
        public scene: GameScene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, 'assets', 'crops/tomato1');
        this.scene.add.existing(this);

        this.setOrigin(1, 1)

        this.setDepth(Depths.FIELD);

        this.healthbar = new ProgressBarUI(this.scene, {
            x: this.x - 35,
            y: this.y - 50,
            // angle: 90,
            atlas: 'assets',
            atlasBg: 'ui/healthbar',
            atlasBar: 'ui/healthbar_blue',
            depth: Depths.UI,
            // offsetX: 0,
            // offsetY: -10,
            // barAlpha: 0.75,
            barY: 3,
            barX: 3,
            bgAlpha: 0.75,
        });
        this.healthbar.hide();

        this.waterDropletImage = this.scene.add.image(this.x, this.y - 90, 'assets', 'ui/water_droplet');
        this.waterDropletImage.setAlpha(0);

        this.scytheImage = this.scene.add.image(this.x, this.y - 90, 'assets', 'ui/scythe');
        this.scytheImage
            .setAlpha(0)
            .setScale(0.5);
    }

    canPlant(): boolean {
        return this.phase === PlantPhase.EMPTY;
    }

    async seed (crop: Plants) {
        this.crop = crop;
        this.setPhase(PlantPhase.SEED);

        this.setTexture('assets', `crops/${crop}2`);

        this.processPhase();
    }

    private async processPhase (): Promise<void> {
        if (this.phase === PlantPhase.EMPTY) {
            return;
        }

        this.waterDropletImage.setVisible(false);
        this.healthbar.hide();

        if (this.phase === PlantPhase.SEED) {
            clearInterval(this.waterBeforeDieInterval);
            this.setPhase(PlantPhase.GROW1);
            // this.setTexture('assets', `crops/${this.crop}3`);

            await delay(Field.WAIT_BEFORE_NEXT_GROW);

            this.setPhase(PlantPhase.GROW_WAIT_TO_WATERING_1);

            this.timeEventWaitForWater1 = this.scene.time.addEvent({
                delay: Field.GROWED_WAITING_FOR_WATER,
                callbackScope: this,
                callback: this.die
            });

            this.scene.tweens.add({
                targets: this.waterDropletImage,
                duration: 500,
                alpha: 1,
                yoyo: true,
                repeat: Infinity
            });

            this.healthbar.show();
            this.waterDropletImage.setVisible(true);
            let percent = 100;
            let tick = 10;
            this.waterBeforeDieInterval = setInterval(() => {
                let value = 100 / (Field.GROWED_WAITING_FOR_WATER / tick);
                percent -= value;
                this.healthbar.setPercent(percent);
                if (percent <= 0) {
                    clearInterval(this.waterBeforeDieInterval);
                }
            }, tick);
            return;
        }

        if (this.phase === PlantPhase.GROW_WAIT_TO_WATERING_1) {
            clearInterval(this.waterBeforeDieInterval);
            this.setPhase(PlantPhase.GROW2);
            await delay(Field.WAIT_BEFORE_NEXT_GROW);
            this.setTexture('assets', `crops/${this.crop}3`);

            await delay(Field.WAIT_BEFORE_NEXT_GROW);

            this.setPhase(PlantPhase.GROW_WAIT_TO_WATERING_2);

            this.scene.tweens.add({
                targets: this.waterDropletImage,
                duration: 500,
                alpha: 1,
                yoyo: true,
                repeat: Infinity
            });

            this.healthbar.show();
            this.waterDropletImage.setVisible(true);
            let percent = 100;
            let tick = 10;
            this.waterBeforeDieInterval = setInterval(() => {
                let value = 100 / (Field.GROWED_WAITING_FOR_WATER / tick);
                percent -= value;
                this.healthbar.setPercent(percent);
                if (percent <= 0) {
                    clearInterval(this.waterBeforeDieInterval);
                }
            }, tick);
            return;
        }


        if (this.phase === PlantPhase.GROW_WAIT_TO_WATERING_2) {
            clearInterval(this.waterBeforeDieInterval);
            this.setPhase(PlantPhase.READY_TO_HARVEST);
            await delay(Field.WAIT_BEFORE_NEXT_GROW);
            this.setTexture('assets', `crops/${this.crop}4`);

            await delay(Field.WAIT_BEFORE_NEXT_GROW);

            this.scene.tweens.add({
                targets: this.scytheImage,
                duration: 500,
                alpha: 1,
                yoyo: true,
                repeat: Infinity
            });

            this.setTexture('assets', `crops/${this.crop}5`);

            this.healthbar.show();
            this.scytheImage.setVisible(true);
            let percent = 100;
            let tick = 10;
            this.waterBeforeDieInterval = setInterval(() => {
                let value = 100 / (Field.GROWED_WAITING_FOR_GATHER / tick);
                percent -= value;
                this.healthbar.setPercent(percent);
                if (percent <= 0) {
                    clearInterval(this.waterBeforeDieInterval);
                }
            }, tick);
            return;
        }

        if (this.phase === PlantPhase.READY_TO_HARVEST) {
            this.harvest();
            this.reset();

            return;
        }
    }


    die(): void {
        this.reset();
    }

    private harvest(): void {
        this.scene.itemsManager.plantsManager.harvest(this);

        this.reset();
    }


    reset() : void {
        this.healthbar.hide();
        this.waterDropletImage.setVisible(false);
        this.scytheImage.setVisible(false);
        this.crop = null;
        this.phase = PlantPhase.EMPTY;

        this.setFrame('crops/tomato1');
        clearInterval(this.waterBeforeDieInterval);
    }

    public getPlantType(): Plants|null {
        return this.crop;
    }

    private setPhase(phase: PlantPhase): void {
        this.phase = phase;
        console.log(phase);
    }

}
