<script lang="ts">
	import { onMount } from 'svelte';
	import Select from './Select.svelte';
	import Slider from './Slider.svelte';
	import RotaryKnob from './RotaryKnob.svelte'; // Import the new component

	interface Props {
		selected: string;
		models: string[];
		sysprompt: string;
	}
	let { selected = $bindable(), models, sysprompt = $bindable() }: Props = $props();

	let activeModel: string = $state('gemma3');
	let opts = $derived([...new Set(models.map((m) => m.split(':')[0]))]);
	let subopts = $derived(
		models
			.filter((m) => m.includes(activeModel))
			.map((m) => m.split(':')[1])
			.sort((a, b) => {
				const numeralA = parseInt(/^([0-9]+)./.exec(a)?.[1] || '0');
				const numeralB = parseInt(/^([0-9]+)./.exec(b)?.[1] || '0');
				return numeralA > numeralB ? 1 : -1;
			})
	);
	let knobValue = $state(0);
	let activeSubopt = $derived(subopts[knobValue]);
	let activeModifier = $state('');

	$effect(() => {
		selected = `${activeModel}:${activeSubopt}`;
	});
	$effect(() => {
		sysprompt = systemPrompts[activeModifier];
	});

	const systemPrompts: { [key: string]: string } = {
		Default: '',
		Concise:
			'Be extremely concise in your answer. Do not skimp on detail and make sure to fully answer or perform the user query, but make sure to minimize extraneous words and keep information short. The request is as follows: ',
		Detailed:
			'Be extremely detailed in your answer, providing as much information as possible or explaining in as much detail as possible. Do not repeat information. The request is as follows: '
	};

	let hostname = $state('');
	onMount(() => (hostname = window.location.hostname));
</script>

<header>
	<div class="vertical">
		<div class="block">
			<h1>
				<span>AURA</span>
				{#if hostname === 'localhost'}
					<span class="tag">DEV</span>
				{/if}
			</h1>
			<span></span>
			<Slider options={['Default', 'Concise', 'Detailed']} bind:selected={activeModifier} />
		</div>
		<Select options={opts} bind:selected={activeModel} />
		<pre>{activeModel}:{activeSubopt}</pre>
	</div>

	<div class="knob-container">
		<RotaryKnob
			bind:value={knobValue}
			min={0}
			max={Math.max(subopts.length - 1, 5)}
			size={95}
			arcWidth={6}
			step={1}
		/>
	</div>
</header>

<style lang="scss">
	header {
		display: flex;
		align-items: start;
		padding: 0.5rem 1.25rem;
		padding-top: 0.35rem;
		gap: 1.25rem; // Add some gap for the new component

		.vertical {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			flex: 1 1;
		}

		.block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex: 1 1;
		}

		h1 {
			display: flex;
			align-items: center;
			font-size: 1.5rem;
			flex: 10 0; // Adjust flex if needed
			margin: 0;
			white-space: nowrap;

			.tag {
				background-color: var(--background-darker);
				border-radius: 5px;
				color: var(--a1);
				font-size: 0.7rem;
				align-self: flex-start;
				margin-left: 0.25rem;
				margin-top: 0.5rem;
				padding: 0 0.25rem;
			}
		}
	}

	.knob-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	// Optional: Style for displaying the knob value if you uncomment it
	/*
	.knob-value-display {
		font-size: 0.8rem;
		color: var(--text-muted);
		min-width: 2em; // Ensure some space for the number
		text-align: right;
	}
	*/
</style>
