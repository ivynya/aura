<script lang="ts">
	import '$lib/app.scss';
	import { onMount } from 'svelte';
	import { stylesheet, initialize, isLight, currentDayPercentage } from '@ivynya/leaf';

	interface Props {
		children?: import('svelte').Snippet;
	}
	let { children }: Props = $props();

	onMount(() => {
		initialize();
		stylesheet.subscribe((sheet) => {
			document.body.setAttribute('style', sheet);
			document.body.setAttribute('data-dark', $isLight ? 'false' : 'true');
		});
	});
</script>

<main>
	{@render children?.()}
</main>

<style lang="scss">
	main {
		background-color: var(--background);
		background-size: 264px;
		display: flex;
		flex-direction: column;
		flex: 1 1;
		height: 100vh;
		width: 100%;
		max-width: 700px;
		margin: auto;
	}
</style>
