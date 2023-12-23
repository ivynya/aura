<script lang="ts">
	import { send } from "$lib/chat";
	import Message from "./Message.svelte";
	import ModelSelect from "./ModelSelect.svelte";
	import { onMount } from "svelte";
	import { getModels } from "$lib/model";
	import MessageInput from "./MessageInput.svelte";
	import type { ChatMessage } from "$lib/schema";

  let context: any[] | undefined = undefined;
  let models = ["mistral"];
  let messages: ChatMessage[] = [];
  let prompt: string = "";
  let activeModel: string;

  onMount(async () => {
    models = (await getModels()).models.map((m) => m.name);
    activeModel = models[0];
  });

  async function submit() {
    messages = [...messages, { text: prompt, user: "user" }];
    messages = [...messages, { text: "", user: activeModel }];
    const body = await send(activeModel, prompt, context);
    prompt = "";

    async function readAllChunks(readableStream: ReadableStream|null) {
      if (!readableStream) return;
      const reader = readableStream.getReader();
      let done, value;
      while (!done) {
        ({ value, done } = await reader.read());
        const text = new TextDecoder("utf-8").decode(value);
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
        }
      }
    }

    await readAllChunks(body);
  }
</script>

<ModelSelect options={models} bind:selected={activeModel} />
<div>
  {#each messages as message, count}
    <Message {message} {count} />
  {/each}
</div>
<MessageInput bind:input={prompt} on:submit={submit} />

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
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
