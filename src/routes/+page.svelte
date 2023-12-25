<script lang="ts">
  import hljs from "highlight.js";
	import Message from "./Message.svelte";
	import ModelSelect from "./ModelSelect.svelte";
	import { onMount } from "svelte";
	import MessageInput from "./MessageInput.svelte";
	import type { ChatMessage } from "$lib/schema";
	import { state } from "$lib/state";
	import { send } from "$lib/remote";

  let context: any[] | undefined = undefined;
  let models = ["mistral:latest", "codellama:instruct"];
  let messages: ChatMessage[] = [];
  let prompt: string = "";
  let activeModel: string;

  $: reversed = messages.length > 0 ? messages.toReversed() : [];

  let socket: WebSocket;

  onMount(async () => {
    activeModel = models[0];
    
    socket = new WebSocket('wss://io.ivy.direct/aura');
    socket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "response") {
        messages[messages.length - 1].text += data.data;
      }
      if (data.action === "response-end") {
        hljs.highlightAll();
      }
    });
  });

  async function submit() {
    if (prompt.startsWith("/config")) return getConfig(prompt.split(" ").slice(1));

    messages = [...messages, { text: prompt, user: "user", count: messages.length }];
    messages = [...messages, { text: "", user: activeModel, count: messages.length }];
    const prompt_copy = prompt;
    prompt = "";
    const body = await send(socket, activeModel, prompt_copy, context);
  }

  function reset() {
    messages = [];
    context = undefined;
  }

  function getConfig(args: string[]) {
    if (args.length > 0) {
      state.update((s: any) => {
        if (args.length < 2) return s;
        const [key, value] = args;
        s[key] = value;
        return s;
      });
    }
    const msg = "AURA Configuration:\n";
    const text = "```\n" + JSON.stringify($state, null, 2) + "\n```";
    messages = [...messages, { text: msg+text, user: "aura", count: messages.length }];
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
