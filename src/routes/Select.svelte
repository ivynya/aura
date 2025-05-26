<script lang="ts">
	export let options: string[];
	export let selected: string;
	$: active = Math.abs(options.findIndex((o) => o === selected));
</script>

<div class="select">
	{#each options as o, i}
		<button class:active={i === active} on:click={() => (selected = o)}>
			<span>{o}</span>
		</button>
	{/each}
</div>

<style lang="scss">
	.select {
		display: flex;
		align-items: center;
		height: 40px;

		button:first-child {
			border-top-left-radius: var(--border-radius-sm);
			border-bottom-left-radius: var(--border-radius-sm);
			span {
				border-top-left-radius: var(--border-radius-sm);
				border-bottom-left-radius: var(--border-radius-sm);
				border-left: 1px solid var(--border-primary);
			}
		}
		button:last-child {
			border-top-right-radius: var(--border-radius-sm);
			border-bottom-right-radius: var(--border-radius-sm);
			span {
				border-top-right-radius: var(--border-radius-sm);
				border-bottom-right-radius: var(--border-radius-sm);
				border-right: 1px solid var(--border-secondary);
			}
		}

		button {
			background: transparent;
			border: none;
			box-shadow: var(--nm-shadow-sm-primary), var(--nm-shadow-sm-secondary);
			color: inherit;
			cursor: pointer;
			flex: 1 1;
			overflow: hidden;

			height: 100%;
			min-width: 80px;

			line-height: 1;
			font-family: inherit;
			font-size: 0.6rem;
			letter-spacing: 1px;
			text-align: center;
			text-transform: uppercase;
			transition-duration: 0.2s;
			position: relative;

			span {
				background: var(--background);
				border: 1px solid var(--border-secondary);
				border-top: 1px solid var(--border-primary);
				border-bottom: 1px solid var(--border-secondary);
				display: grid;
				place-items: center;
				padding: 0 5px;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 10;
			}

			&.active {
				box-shadow: none;
				transform: translateY(1px);
			}
			&.active span {
				background: var(--background);
				border-right: none;
				border-left: none;
				box-shadow:
					var(--nm-shadow-sm-primary) inset,
					var(--nm-shadow-sm-secondary) inset;
			}

			&:not(.active) {
				color: var(--text-accent);
			}
		}
	}
</style>
