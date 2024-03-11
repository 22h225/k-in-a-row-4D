<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import 'normalize.css';
	import './styles.scss';
	import { Game, type Config } from './main';

	let innerWidth: number, innerHeight: number;
	let config: Config = {
		kCount: 4,
		boardShape: [4, 4, 4, 4]
	};

	const game = new Game(config);
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
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
