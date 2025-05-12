<script lang="ts">
	import ModelSelectSlider from './ModelSelectSlider.svelte';

	interface Props {
		options: string[];
		selected: string;
	}
	let { options, selected = $bindable() }: Props = $props();

	let activeModel = $state(options[0].split(':')[0]);
	let activeSubopt = $state('');
	let models = $derived([...new Set(options.map((o) => o.split(':')[0]))]);
	let subopts = $derived(
		options.filter((o) => o.includes(activeModel)).map((o) => o.split(':')[1])
	);
</script>

<section class="model-select">
	<ModelSelectSlider options={models} bind:selected={activeModel} />
	<ModelSelectSlider options={subopts} bind:selected={activeSubopt} />
</section>

<style lang="scss">
	.model-select {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: cartograph-cf, monospace;

		:global(:first-child) {
			flex: 2 1;
		}
	}
</style>
