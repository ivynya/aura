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

<div>
	<main>
		{@render children?.()}
	</main>
</div>

<style lang="scss">
	div {
		background-color: #213147;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	main {
		background-color: var(--background);
		display: flex;
		flex-direction: column;
		padding: 30px;
		flex: 1 1;

		@media (max-width: 768px) {
			padding: 15px;
			padding-bottom: 30px;
		}
	}
</style>
