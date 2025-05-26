<script lang="ts">
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';
	import { send } from '$lib/chat';
	import { getModels } from '$lib/model';
	import { cfg } from '$lib/state';
	import Header from './Header.svelte';
	import Message from './Message.svelte';
	import MessageInput from './MessageInput.svelte';
	import type { ChatMessage } from '$lib/schema';

	let sysprompt = '';
	let context: any[] | undefined = undefined;
	let models = ['mistral'];
	let messages: ChatMessage[] = [];
	let prompt: string = '';
	let activeModel: string;

	$: reversed = messages.length > 0 ? messages.toReversed() : [];

	onMount(async () => {
		models = (await getModels()).models.map((m: any) => m.name);
	});

	async function submit() {
		if (prompt.startsWith('/config')) return getConfig(prompt.split(' ').slice(1));

		messages = [...messages, { text: prompt, user: 'user', count: messages.length }];
		messages = [...messages, { text: '', user: activeModel, count: messages.length }];
		const prompt_copy = prompt;
		prompt = '';
		const body = await send(activeModel, sysprompt + prompt_copy, context);

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

<Header models={models.slice(0, 16)} bind:selected={activeModel} bind:sysprompt />
<section>
	<div>
		{#each reversed as message (message.count)}
			<Message {message} count={message.count} />
		{/each}
	</div>
	<MessageInput bind:input={prompt} {submit} click={reset} />
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
		max-height: calc(100vh - 16rem);
		overflow-y: auto;
	}
</style>
