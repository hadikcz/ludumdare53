import GameScene from 'scenes/GameScene';

export default class PlayerCharacterControls {

    private keys: { dropItem: Phaser.Input.Keyboard.Key; down2: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; up2: Phaser.Input.Keyboard.Key; right2: Phaser.Input.Keyboard.Key; action: Phaser.Input.Keyboard.Key; left2: Phaser.Input.Keyboard.Key; up: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key };

    constructor (
        private scene: GameScene,
        private playerCharacter
    ) {
        this.keys = {
            up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            up2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            down2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            left2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            right2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            action: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            dropItem: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        };
    }

    update () {
        let click = false;
        if (!this.playerCharacter.lockedMovementWhileOpenShop) {
            if (this.keys.left.isDown || this.keys.left2.isDown) {
                this.playerCharacter.moveToDir(MovementDirection.LEFT);
                click = true;
            } else if (this.keys.right.isDown || this.keys.right2.isDown) {
                this.playerCharacter.moveToDir(MovementDirection.RIGHT);
                click = true;
            }

            if (this.keys.up.isDown || this.keys.up2.isDown) {
                this.playerCharacter.moveToDir(MovementDirection.JUMP);
                click = true;
            }
            if (!click) {
                this.playerCharacter.moveToDir(MovementDirection.STOPX);
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.dropItem)) {
                this.playerCharacter.putDown();
            }
        } else {
            if (Phaser.Input.Keyboard.JustDown(this.keys.dropItem)) {
                // this.scene.ui.buildMenuUI.hide();
                this.playerCharacter.unLockMovementWhileOpenShop();
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.up2)) {
                // this.scene.ui.buildMenuUI.moveUp();
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.down2)) {
                // this.scene.ui.buildMenuUI.moveDown();
            }
        }
    }
}

export enum MovementDirection {
    LEFT,
    RIGHT,
    JUMP,
    STOPX
}