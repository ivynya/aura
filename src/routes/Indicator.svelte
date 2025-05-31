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
	<span class="label">{model}</span>

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
		margin-top: 0.5rem;
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
