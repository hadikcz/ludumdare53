import FieldManager from 'core/field/FieldManager';
import ItemsManager from 'core/items/ItemsManager';
import PlantsManager from 'core/items/plants/PlantsManager';
import Player from 'core/player/Player';
import WorldEnv from 'core/WorldEnv';
import dat, { GUI } from 'dat.gui';
import EffectManager from 'effects/EffectManager';
import $ from 'jquery';
import Phaser from 'phaser';
import { Subject } from 'rxjs';
import UI from 'ui/UI';

declare let window: any;
declare let __DEV__: any;

export default class GameScene extends Phaser.Scene {

    public static readonly START_X = 4500;
    public effectManager!: EffectManager;
    public ui!: UI;
    private debugGui!: GUI;
    public worldEnv!: WorldEnv;
    private testObject!: Phaser.GameObjects.Image;
    private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
    public xPos$!: Subject<number>;
    public itemsManager!: ItemsManager;
    public player!: Player;
    private plantsManager!: PlantsManager;
    public fieldManager!: FieldManager;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;

        this.physics.world.setBounds(0, 0, 10000, 1000);

        this.xPos$ = new Subject<number>();

        this.initDebugUI();
        this.input.setTopOnly(true);

        this.worldEnv = new WorldEnv(this);

        this.cameras.main.setZoom(1);
        this.cameras.main.setBackgroundColor('#8bd0ba');
        // this.cameras.main.centerOn(GameConfig.PhaserBasicSettings.gameSize.width / 4, GameConfig.PhaserBasicSettings.gameSize.height / 4);

        this.player = new Player(this, GameScene.START_X, 100);

        this.fieldManager = new FieldManager(this);
        this.itemsManager = new ItemsManager(this);

        this.physics.add.collider(this.player, this.worldEnv.groundGroup);
        this.physics.add.collider(this.itemsManager.plantsManager.plantItems, this.worldEnv.groundGroup);
        this.physics.add.collider(this.itemsManager.interactiveItems, this.worldEnv.groundGroup);
        this.effectManager = new EffectManager(this);

        this.ui = new UI(this);
    }

    update (time, delta): void {
        // this.xPos$.next(this.testObject.x);
    }

    private initDebugUI (): void {
        this.debugGui = new dat.GUI({ autoPlace: false });
        $('#datGui').append(this.debugGui.domElement);
        // $('#datGui').hide();

        let camera = this.debugGui.addFolder('Camera');
        camera.add(this.cameras.main, 'zoom').step(1).listen();
        camera.add(this.input.activePointer, 'worldX').step(1).listen();
        camera.add(this.input.activePointer, 'worldY').step(1).listen();
        camera.open();

        this.debugGui.close();
    }

    private startCameraControls (): void {
        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }
}
