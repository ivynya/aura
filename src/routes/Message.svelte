<script lang="ts">
	import { marked } from 'marked';
	import { fade } from 'svelte/transition';
	import { isLight } from '@ivynya/leaf';
	import type { ChatMessage } from '$lib/schema';

	interface Props {
		message: ChatMessage;
		count: number;
	}

	let { message, count }: Props = $props();

	let duration = $derived(message.duration?.toFixed(1));
</script>

<div
	id="msg-{count}"
	class="msg"
	class:user={message.user === 'user'}
	transition:fade={{ duration: 200 }}
>
	<h4>
		<span>{count}</span>
		{message.user}
		<span class="spacer"></span>
		{#if !message.done}
			<span class="loading">...</span>
		{/if}
		{#if message.done}
			<span>complete</span>
			{#if message.duration}
				<span>{duration}s</span>
			{/if}
			{#if message.tokens}
				<span>{message.tokens}tk</span>
			{/if}
		{/if}
	</h4>
	{#if message.text.length === 0}
		<div class="loading">parsing context...</div>
	{:else}
		<div class:isLight={$isLight}>{@html marked.parse(message.text)}</div>
	{/if}
</div>

<style lang="scss">
	.msg {
		background: var(--background);
		border-radius: var(--border-radius-sm);
		box-shadow: var(--nm-shadow-sm-primary), var(--nm-shadow-sm-secondary);
		transition-duration: 0.5s;
		box-shadow: var(--nm-shadow-sm-secondary);
		font-size: 0.8rem;
		padding: 1rem;
	}

	.msg.user {
		color: var(--text-muted);
		filter: grayscale(0.5);
	}

	h4 {
		display: flex;
		align-items: center;
		margin: 0;
		margin-bottom: 0.75rem;
		gap: 0.5rem;
		font-family: cartograph-cf, monospace;
		font-size: 0.7rem;

		span {
			color: var(--text-muted);
			padding: 0 0.25rem;
		}

		span:first-of-type {
			background-color: var(--background-darker);
			border-radius: var(--border-radius-sm);
			display: grid;
			place-items: center;
			min-width: 0.5rem;
		}

		span.spacer {
			flex-grow: 1;
		}
	}

	.loading {
		animation: flash 1s infinite;
		color: var(--text-muted);

		@keyframes flash {
			0% {
				opacity: 0.5;
			}
			50% {
				opacity: 1;
			}
			100% {
				opacity: 0.5;
			}
		}
	}

	.msg div {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		line-height: 1.5;
	}

	.msg :global(a) {
		color: var(--text-muted);
		text-decoration: underline;
	}

	.msg :global(p) {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-primary);
		white-space: pre-wrap;
	}

	.msg :global(code) {
		margin: 0;
		font-size: 0.7rem;
		color: var(--text-primary);
		white-space: pre-wrap;
		background-color: var(--background-darker);
		border-radius: var(--border-radius-sm);
		padding: 0 0.25rem;
		overflow-x: auto;
		font-family: cartograph-cf, monospace;
	}

	.msg .isLight :global(pre),
	.msg .isLight :global(code) {
		background-color: #2e3440;
		color: #d8dee9;
	}

	.msg :global(pre) {
		font-size: 0.7rem;
		line-height: 1.5;
		color: var(--text-primary);
		white-space: pre-wrap;
		background-color: var(--background-darker);
		border-radius: var(--border-radius-sm);
		margin: 0 -1rem;
		padding: 0.5rem 0.75rem;
		overflow-x: auto;
		font-family: cartograph-cf, monospace;
	}

	.msg :global(ul),
	.msg :global(ol) {
		margin: 0;
	}

	.msg :global(td) {
		border-bottom: 1px dotted var(--background-darker);
	}
</style>
