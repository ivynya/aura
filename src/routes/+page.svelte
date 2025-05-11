<script lang="ts">
	import hljs from 'highlight.js';
	import { send } from '$lib/chat';
	import Message from './Message.svelte';
	import ModelSelect from './ModelSelect.svelte';
	import { onMount } from 'svelte';
	import { getModels } from '$lib/model';
	import MessageInput from './MessageInput.svelte';
	import type { ChatMessage } from '$lib/schema';
	import { cfg } from '$lib/state';

	let context: any[] | undefined = undefined;
	let models = ['mistral'];
	let messages: ChatMessage[] = [];
	let prompt: string = '';
	let activeModel: string;

	$: reversed = messages.length > 0 ? messages.toReversed() : [];

	onMount(async () => {
		models = (await getModels()).models.map((m) => m.name);
		activeModel = models[0];
	});

	async function submit() {
		if (prompt.startsWith('/config')) return getConfig(prompt.split(' ').slice(1));

		messages = [...messages, { text: prompt, user: 'user', count: messages.length }];
		messages = [...messages, { text: '', user: activeModel, count: messages.length }];
		const prompt_copy = prompt;
		prompt = '';
		const body = await send(activeModel, prompt_copy, context);

		async function readAllChunks(readableStream: ReadableStream | null) {
			if (!readableStream) return;
			const reader = readableStream.getReader();
			let done, value;
			while (!done) {
				({ value, done } = await reader.read());
				if (done) break;
				const text = new TextDecoder('utf-8').decode(value);
				const json = JSON.parse(text);
				messages[messages.length - 1].text += json.response;
				if (json.done) {
					context = json.context;
					messages[messages.length - 2].done = true;
					messages[messages.length - 2].duration_total = json.prompt_eval_duration / 1000000;
					messages[messages.length - 2].tokens = json.prompt_eval_count;
					messages[messages.length - 1].done = true;
					messages[messages.length - 1].duration_total = json.eval_duration / 1000000;
					messages[messages.length - 1].tokens = json.eval_count;
					hljs.highlightAll();
				}
			}
		}

		await readAllChunks(body);
	}

	function reset() {
		messages = [];
		context = undefined;
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
		messages = [...messages, { text: msg + text, user: 'aura', count: messages.length }];
	}
</script>

<ModelSelect options={models} bind:selected={activeModel} />
<div>
	{#each reversed as message (message.count)}
		<Message {message} count={message.count} />
	{/each}
</div>
<MessageInput bind:input={prompt} on:submit={submit} on:click={reset} />

<style lang="scss">
	div {
		display: flex;
		flex-direction: column-reverse;
		gap: 1rem;
		flex: 1 1;
		margin: 2rem 0;
		margin-left: -0.45rem;
		padding: 0.5rem;
		padding-right: 1rem;
		max-height: calc(100vh - 140px - 5rem);
		overflow-y: auto;
	}
</style>
