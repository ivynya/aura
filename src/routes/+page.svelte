<script lang="ts">
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';
	import { getModels, send } from '$lib/api';
	import { cfg } from '$lib/state';
	import Header from './Header.svelte';
	import Message from './Message.svelte';
	import MessageInput from './MessageInput.svelte';
	import type { ChatMessage, Model } from '$lib/schema';

	let models: Model[] = $state([]);
	let active: Model = $state({
		name: 'no model',
		model: 'no model',
		size: 0,
		details: {
			parameter_size: '0'
		},
		capabilities: []
	});
	let sysprompt = $state('');
	let prompt: string = $state('');
	let images: string[] = $state([]);
	let thumbs: string[] = $state([]);

	let messages: ChatMessage[] = $state([]);
	let reversed = $derived(messages.length > 0 ? messages.toReversed() : []);

	onMount(async () => {
		models = await getModels();
	});

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (prompt.startsWith('/config')) return getConfig(prompt.split(' ').slice(1));

		const prompt_copy = prompt;
		prompt = '';
		messages = [
			...messages,
			{
				model: active.name,
				role: 'user',
				content: prompt_copy,
				images: images,
				thumbs: thumbs,
				count: messages.length
			}
		];
		await infer(active.name);
	}

	async function infer(model: string) {
		const body = await send(model, messages);
		if (!body) return;
		const reader = body.getReader();
		let done, value;
		let resend_later = false;
		while (!done) {
			({ value, done } = await reader.read());
			if (done) break;
			const text = new TextDecoder('utf-8').decode(value);
			const json = JSON.parse(text);
			const rmsg = json.message;
			if (rmsg.content.length > 0 && messages[messages.length - 1].role !== 'assistant') {
				messages = [
					...messages,
					{
						model: model,
						role: 'assistant',
						content: '',
						count: messages.length
					}
				];
			}
			messages[messages.length - 1].content += rmsg.content;
			if (rmsg.tool_calls && rmsg.tool_calls.length > 0) {
				messages = [
					...messages,
					{
						done: true,
						model: model,
						role: 'tool',
						content: `${Math.random() * 100} degrees`,
						tool_calls: rmsg.tool_calls,
						count: messages.length
					}
				];
				resend_later = true;
			}
			if (json.done) {
				messages[messages.length - 2].done = true;
				messages[messages.length - 2].duration_total = json.prompt_eval_duration / 1000000000;
				messages[messages.length - 2].tokens = json.prompt_eval_count;
				messages[messages.length - 1].done = true;
				messages[messages.length - 1].duration_total = json.eval_duration / 1000000000;
				messages[messages.length - 1].tokens = json.eval_count;
				hljs.highlightAll();
				if (resend_later) {
					await infer(model);
				}
			}
		}
	}

	function reset() {
		messages = [];
	}

	function getConfig(args: string[]) {
		if (args.length > 0) {
			cfg.update((s: any) => {
				if (args.length < 2) return s;
				const [key, value] = args;
				s[key] = value;
				return s;
			});
		}
		const msg = 'AURA Configuration:\n';
		const text = '```\n' + JSON.stringify($cfg, null, 2) + '\n```';
		messages = [
			...messages,
			{ model: 'aura', content: msg + text, role: 'assistant', count: messages.length }
		];
	}
</script>

<Header {models} bind:active bind:sysprompt />
<section>
	<div>
		{#each reversed as message (message.count)}
			<Message {message} count={message.count} />
		{/each}
	</div>
	<MessageInput bind:input={prompt} bind:images bind:thumbs {submit} click={reset} />
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		flex: 1 1;
		height: 100%;
		padding: 0.5rem 1.25rem;
		padding-top: 0.35rem;
	}

	div {
		display: flex;
		flex-direction: column-reverse;
		gap: 1rem;
		flex: 1 1;
		margin: 1rem 0;
		margin-left: -0.45rem;
		padding: 0.5rem;
		padding-right: 1rem;
		max-height: calc(100vh - 17rem);
		overflow-y: auto;
	}
</style>
