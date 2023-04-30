import Field from 'core/field/Field';
import { AbstractItem } from 'core/items/AbstractItem';
import PlayerCharacterControls, { MovementDirection } from 'core/player/PlayerCharacterControls';
import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import { Items } from 'enums/Items';
import GameScene from 'scenes/GameScene';

export default class Player extends Phaser.GameObjects.Container {

    private static readonly MOVEMENT_SPEED = 250;
    private static readonly JUMP_SPEED = 170;
    private static readonly PICKED_ITEM_OFFSET_Y = 50;

    // @ts-ignore
    public body: Phaser.Physics.Arcade.Body;
    private controls: PlayerCharacterControls;
    private characterImage: Phaser.GameObjects.Image;

    private equipedItemType: Items|null = null;
    private equipedItem: AbstractItem|null = null;
    private overHeadText: Phaser.GameObjects.Text;
    public lockedMovementWhileOpenModal: boolean = false;
    public nearestField: Field|null = null;

    constructor (
        public scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // @ts-ignore
        this.body = this.body as Phaser.Physics.Arcade.Body;
        // body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);

        this.body.setDragX(600);
        let widthSize = 40 / 2;
        let heightSize = 134 / 2;
        this.body.setSize(widthSize, heightSize);
        this.body.setOffset(-widthSize / 2, 0);

        this.controls = new PlayerCharacterControls(this.scene, this);

        this.setDepth(Depths.PLAYER);
        this.scene.cameras.main.startFollow(this, false, 0.85, 0.85, 0, 0); //210

        this.characterImage = this.scene.add.image(0, 0, 'assets', 'player').setOrigin(0.5, 0);
        this.add(this.characterImage);

        this.overHeadText = this.scene.add.text(0, 0, '', { fontFamily: 'ARCADECLASSIC, Arial', fontSize: '55px', color: '#FFFFFF' }); // '#FF0000'
        this.overHeadText.setOrigin(0.5, 2);
        // this.overHeadText.setDepth(Depths.PLAYER_OVERHEAD_TEXT);
        this.overHeadText.setScale(0.25, 0.25);
        this.add(this.overHeadText);

    }

    preUpdate (): void {
        this.controls.update();

        if (this.equipedItem) {
            this.equipedItem.setPosition(this.x, this.y + Player.PICKED_ITEM_OFFSET_Y);
        }

        if (!this.equipedItemType) {
            let nearestItem = this.scene.itemsManager.findNearestItem(this.x, this.y);

            if (nearestItem) {
                this.overHeadText.setText(nearestItem.getPickupText());
                return;
            } else {
                this.overHeadText.setText('');
            }

            if (!this.lockedMovementWhileOpenModal) {
                this.nearestField = this.scene.fieldManager.findNearestFieldInRange(this.x, this.y);
                if (this.nearestField) {
                    this.overHeadText.setText('Press E to seed');
                } else {
                    this.overHeadText.setText('');
                }
            }

        }

        this.overHeadTextProcess();

    }

    action (): void {
        if (!this.equipedItemType) {
            let nearestItem = this.scene.itemsManager.findNearestItem(this.x, this.y);

            if (nearestItem) {
                this.equipedItemType = nearestItem.getItemType();
                this.equipedItem = nearestItem;

                this.equipedItem.pickup();

                this.overHeadText.setText('');

                return;
            }

            if (this.nearestField && this.nearestField.canPlant()) {
                this.lockedMovementWhileOpenModal = true;
                this.scene.events.emit(Events.OPEN_SEED_MENU);

                return;
            }
        }
    }

    putDownItem (): void {
        if (!this.equipedItem) {
            return;
        }

        this.equipedItem.explode();
        this.equipedItem.putDown(this.x, this.y, this.body.velocity);

        this.equipedItemType = null;
        this.equipedItem = null;

        this.overHeadText.setText('');
    }


    moveToDir (direction: MovementDirection) {
        if (direction === MovementDirection.LEFT) {
            this.characterImage.setScale(-1, 1);
            // this._overHeadText.setScale(-0.25, 0.25);
            this.body.setVelocityX(-Player.MOVEMENT_SPEED);
        } else if (direction === MovementDirection.RIGHT) {
            this.body.setVelocityX(Player.MOVEMENT_SPEED);

            // this._overHeadText.setScale(0.25, 0.25);
            this.characterImage.setScale(1, 1);
        }

        if (direction === MovementDirection.JUMP && this.body.touching.down) {
            this.body.setVelocityY(-Player.JUMP_SPEED);
        }

        if (direction === MovementDirection.STOPX) {
            this.body.setVelocityX(0);
        }
    }

    private overHeadTextProcess (): void {
        if (!this.equipedItemType) {
            return;
        }

        if (this.equipedItemType === Items.SHOVEL) {
            // if can dig
            this.overHeadText.setText('Dig    new    field');
        }
    }
}
