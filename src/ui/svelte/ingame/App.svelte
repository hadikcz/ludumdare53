<script lang="ts">
    import GameScene from "scenes/GameScene";
	import {onDestroy} from "svelte";
	import './global.css';
	import SeedMenu from "ui/svelte/ingame/SeedMenu.svelte";

    export let scene: GameScene;

	let posX = 0;
	scene.xPos$.subscribe((value) => {
		posX = value;
	});

	onDestroy(() => {
		console.log('main app svelte DESTYROYD');
	});


</script>

<style lang="scss">
	.top-bar {
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		font-size: 25px;
		position: absolute;
	}
</style>

<main style="pointer-events: all">
	<div class="top-bar">
		<div style="width: 100px; height: 50px; background: red; color: white">
			{posX}
		</div>
	</div>

	<SeedMenu scene="{scene}"></SeedMenu>
</main>
