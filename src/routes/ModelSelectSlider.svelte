<script lang="ts">
	interface Props {
		options: string[];
		selected: string;
	}
	let { options, selected = $bindable() }: Props = $props();
	let active = $state(0);

	let btnWidth = $state(0);
	let leftness = $derived(active * 100);
	let ratchet = $derived(100 / options.length);
</script>

<div class="slider">
	<span style="transform:translateX({leftness}%);width:{ratchet}%;"></span>
	<div class="options">
		{#each options as o, i}
			<button
				class:active={i === active}
				onclick={() => {
					selected = o;
					active = i;
				}}
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
		border-color: var(--border-primary) var(--border-secondary) var(--border-secondary)
			var(--border-primary);
		border-radius: var(--border-radius-sm);
		box-shadow:
			var(--nm-shadow-sm-primary) inset,
			var(--nm-shadow-sm-secondary) inset;
		flex: 1 1;
		transition-duration: 0.5s;
		height: 20px;
		padding: 5px 0;
		position: relative;
		z-index: 5;

		span {
			background: var(--background);
			background-color: var(--background-darker);
			border: 1px solid;
			border-color: var(--border-primary) var(--border-secondary) var(--border-secondary)
				var(--border-primary);
			border-radius: var(--border-radius-sm);
			box-shadow: var(--nm-shadow-sm-primary), var(--nm-shadow-sm-secondary);
			box-sizing: border-box;
			transition-duration: 0.5s;
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
			font-size: 0.6rem;
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
