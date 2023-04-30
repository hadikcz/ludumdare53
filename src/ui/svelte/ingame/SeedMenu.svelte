<script lang="ts">
    import GameScene from "scenes/GameScene";
    import {Events, ModalMovement} from "enums/Events";
    import Crops from "core/items/plants/Crops";

    let visible = false;
    let position = 0;
    let maxPosition = Crops.length - 1;

    export let scene: GameScene;

    console.log([
        scene,
        scene.events
    ])

    scene.events.on(Events.CLOSE_ALL_MODAL, () => {
        visible = false;
    })

    scene.events.on(Events.OPEN_SEED_MENU, () => {
        visible = true;
    })

    scene.events.on(Events.MODAL_MOVEMENT, (direction: ModalMovement) => {
        if (!visible) return;

        if (direction === ModalMovement.UP) {
            if (position === 0) {
                position = maxPosition;
                return;
            }
            position--;
            console.log('up');
        } else {
            if (position === maxPosition) {
                position = 0;
                return;
            }
            position++;
            console.log('down');
        }
    })

    scene.events.on(Events.MODAL_ACTION, () => {
        if (!visible) return;

        scene.events.emit(Events.PLANT_SEED, Crops[position].type);

        console.log('action');
    });

</script>

<style lang="scss">

  .seed-menu {
    color: white;
    background: #6f4a2b;
    width: 130px;
    height: 210px;
    padding: 5px;
    bottom: 127px;
    left: 50%;
    transform: translate(-50%);
    position: absolute;


    .title {
      font-size: 19px;
      color: #ffe33e;
      text-align: center;
    }

    .row {
      width: 90%;
      padding: 4px;
      background: #2a1700;
      font-size: 14px;
      display: inline-block;
    }

    .row:nth-child(even) {
      background: #3c2a00;
    }

    .row .price {
      float: right;
      display: inline-block;
    }

    .row.active {
      background: #a7a7a7;
    }

    .coin {
      background: url('../ui/coin.png') no-repeat;
      width: 11px;
      height: 11px;
      display: inline-block;
    }


    .note {
      font-size: 17px;
      color: #ffe33e;
      border: 0;
      text-align: center;
    }

    .not-enough-coins {
      color: red;
      margin-top: 10px;
      width: 192px;
      transform: translateX(-21%);
      font-size: 22px;
    }
  }
</style>

{#if visible}
<div class="seed-menu">
    <div class="title">Seed</div>
    <div class="row-wrapper">
        {#each Crops as crop, i}
            <div class="row {position === i ? 'active': ''}"  data-id="">
                {crop.name} <div class="price">{crop.seedPrice}<div class="coin"></div></div>
            </div>
        {/each}
    </div>
    <div class="note">Press Q for close</div>
    <div class="info not-enough-coins" style="display: none;">Not enough coins</div>
</div>
{/if}
