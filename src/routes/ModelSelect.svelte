<script lang="ts">
	export let options: string[];
	export let selected: string;
	let active = 0;

	let btnWidth = 0;
	$: leftness = 5 + (active * btnWidth);
</script>

<div class="slider">
	<span style="transform:translateX({leftness}px);width:{100 / options.length - 1}%;" />
	<div class="options">
		{#each options as o, i}
			<button
				class:active={i === active}
				on:click={() => {selected = o; active = i}}
				bind:clientWidth={btnWidth}
				>{o}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.slider {
		background: var(--background);
		border: 1px solid;
		border-color:
			var(--border-primary)
			var(--border-secondary)
			var(--border-secondary)
			var(--border-primary);
		border-radius: var(--border-radius-sm);
		box-shadow:
			var(--nm-shadow-sm-primary) inset,
			var(--nm-shadow-sm-secondary) inset;
		transition-duration: 0.5s;
		max-height: 25px;
		height: 100%;
		padding: 5px;
		position: relative;
		z-index: 5;

		span {
			background: var(--background);
			border: 1px solid;
			border-color:
				var(--border-primary)
				var(--border-secondary)
				var(--border-secondary)
				var(--border-primary);
			border-radius: var(--border-radius-sm);
			box-shadow:
				var(--nm-shadow-sm-primary),
				var(--nm-shadow-sm-secondary);
			transition-duration: 0.5s;
			background-color: var(--background-darker);
			box-shadow: var(--nm-shadow-sm-secondary);
			display: block;
			height: 35px;
			margin: auto 0;

			position: absolute;
			top: -30px;
			bottom: -30px;
			z-index: -1;
		}

		.options {
			display: flex;
			align-items: center;
			height: 100%;
		}
		.options button {
			background-color: transparent;
			border: none;
			color: var(--text-color);
			cursor: pointer;
			display: grid;
			place-items: center;
			flex: 1 1;

			padding: auto 0;
			margin: auto 0;
			min-height: 100%;

			line-height: 1;
			font-family: inherit;
			font-size: 0.65rem;
			letter-spacing: 1px;
			text-align: center;
			text-transform: uppercase;
			transition-duration: 0.2s;

			&:not(.active) {
				color: var(--text-muted);
			}
		}
	}
</style>
