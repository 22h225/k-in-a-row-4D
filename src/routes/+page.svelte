<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import 'normalize.css';
	import './styles.scss';

	import { Game } from './main';
	import type { Config } from './main';
	import { x, y, z, w, DIMENSIONS } from './store';

	let innerWidth: number, innerHeight: number;

	let config: Config = {
		kCount: 4,
		boardShape: [4, 4, 4, 4]
	};
	let game = new Game(config);

	function onClick() {
		let [judgement, player, stones] = game.playTurn([$x, $y, $z, $w]);

        if (judgement && player && stones) {
            
        }

		game.board = game.board;
	}
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	on:keydown={(e) => {
		if (e.key == 'Control') onClick();
	}}
/>

<Canvas size={{ width: innerWidth, height: innerHeight }}>
	<Scene {game} />
</Canvas>

<div class="overlay">
	<div>
		<p>Control</p>
		<ul>
			<li>A: 左</li>
			<li>D: 右</li>
			<li>W: 奥</li>
			<li>S: 手前</li>
			<li>E: 四次元方向の奥</li>
			<li>Q: 四次元方向の手前</li>
			<li>Space: 上</li>
			<li>Shift: 下</li>
			<li>Control: コマを置く</li>
			<li>左クリック＆ドラッグ: 回転移動</li>
			<li>右クリック＆ドラッグ: 平行移動</li>
		</ul>
	</div>
</div>

<style>
	.overlay {
		display: flex;
		position: absolute;
		top: 0;
		margin: 1rem;
		z-index: 1;
	}
</style>
