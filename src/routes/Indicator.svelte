<script lang="ts">
	interface Props {
		model: string;
		options: {
			label: string;
			active: boolean;
		}[];
	}
	let { model, options }: Props = $props();
</script>

<section>
	<div>
		<div>
			<pre class="screen">{model}</pre>
			<span class="label">Model</span>
		</div>
	</div>

	<div class="indicator">
		{#each options as { label, active } (JSON.stringify(label + active))}
			<div>
				<span class="pip" class:active></span>
				<span class="label">{label}</span>
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	section {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		width: 100%;

		div {
			display: flex;
			align-items: center;
			justify-content: right;
			gap: 2rem;

			div {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}
		}
	}

	.screen {
		background-color: #1a1a1a;
		border: 1px solid;
		border-color: var(--border-primary) var(--border-secondary);
		border-radius: var(--border-radius-sm);
		box-shadow: var(--nm-shadow-sm-primary), var(--nm-shadow-sm-secondary);
		color: #b9a5b9;
		padding: 0.15rem 0.5rem;
		font-size: 0.6rem;
		font-weight: bold;
		width: 120px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-transform: uppercase;
	}

	.pip {
		background: radial-gradient(var(--border-primary), var(--border-secondary));
		box-shadow: var(--nm-shadow-sm-secondary) inset;
		border-radius: 100%;
		display: block;
		width: 10px;
		height: 10px;

		&.active {
			background: #99b529;
			box-shadow: 0 0 5px #99b529;
		}
	}

	.label {
		color: var(--text-accent);
		font-size: 0.7rem;
		font-weight: 400;
		text-transform: uppercase;
	}
</style>
