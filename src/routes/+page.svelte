<script lang="ts">
	import { send } from "$lib/chat";
	import Message from "./Message.svelte";
	import ModelSelect from "./ModelSelect.svelte";
	import type { ChatMessage } from "$lib/schema";
	import { onMount } from "svelte";
	import { getModels } from "$lib/model";
	import MessageInput from "./MessageInput.svelte";

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
    messages.push({ text: prompt, user: "user" });
    messages.push({ text: "", user: activeModel });
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
          messages[messages.length - 1].done = true;
          messages[messages.length - 1].duration_total = json.total_duration / 1000000;
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
    padding: 1rem 0;
  }
</style>
