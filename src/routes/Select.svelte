<script lang="ts">
	interface Props {
		options: string[];
		selected: string;
	}
	let { options, selected = $bindable() }: Props = $props();
	let active = $derived(Math.abs(options.findIndex((o) => o === selected)));

	let isOpen = $state(false);

	function toggleDropdown() {
		isOpen = !isOpen;
	}
	function selectOption(option: string) {
		selected = option;
		isOpen = false;
	}
	function handleClickOutside(event: MouseEvent) {
		if (event.target instanceof HTMLElement) {
			const target = event.target as HTMLElement;
			if (isOpen && !target.closest('.select')) {
				isOpen = false;
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="select">
	{#each options.slice(0, 3) as o, i}
		<button class:active={i === active} onclick={() => (selected = o)}>
			<span>{o}</span>
		</button>
	{/each}

	<button
		onclick={toggleDropdown}
		class:active={active >= 3}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span>{active >= 3 ? selected : '[...]'}</span>
	</button>
	{#if isOpen}
		<ul class="dropdown-menu" role="listbox">
			{#each options.slice(3) as option (option)}
				<li
					role="option"
					aria-selected={option === selected}
					onclick={() => selectOption(option)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') selectOption(option);
					}}
					tabindex="0"
					class:selected={option === selected}
				>
					{option}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.select {
		display: flex;
		align-items: center;
		height: 40px;
		position: relative;

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

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 6px); // Position below the button with a small gap
		left: 0;
		width: 100%;
		background: var(--background);
		border-radius: var(--border-radius-sm);
		box-shadow: var(--nm-shadow-sm-primary), var(--nm-shadow-sm-secondary);
		list-style: none;
		padding: 0.5rem 0;
		margin: 0;
		z-index: 1000; // Ensure it's above other content
		max-height: 220px;
		overflow-y: auto;
		border: 1px solid var(--background-darker); // Subtle border for definition

		// Neumorphic scrollbar (Webkit-based browsers)
		&::-webkit-scrollbar {
			width: 8px;
		}
		&::-webkit-scrollbar-track {
			background: var(--background);
			border-radius: var(--border-radius-sm);
		}
		&::-webkit-scrollbar-thumb {
			background: var(--background-darker);
			border-radius: var(--border-radius-sm);
			&:hover {
				background: var(--text-muted, #999); // Use a muted text color or similar for hover
			}
		}
	}

	.dropdown-menu li {
		padding: 0.75rem 1rem;
		color: var(--text-color);
		cursor: pointer;
		font-size: 0.85rem;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		&:hover {
			background-color: var(--background-darker);
		}

		&.selected {
			font-weight: 600; // Slightly bolder for selected
			color: var(--text-accent);
			background-color: var(--background-slight-emphasis);
		}

		&:focus,
		&:focus-visible {
			// Combined for simplicity, focus-visible is preferred
			outline: none; // Remove default outline
			background-color: var(--background-darker);
			// Add a subtle inset ring or border for focus if desired, e.g.:
			// box-shadow: inset 0 0 0 2px var(--focus-ring-color);
		}
	}
</style>
