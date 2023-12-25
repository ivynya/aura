<script lang="ts">
  import hljs from "highlight.js";
	import Message from "./Message.svelte";
	import MessageInput from "./MessageInput.svelte";
	import ModelSelect from "./ModelSelect.svelte";
	import { onMount } from "svelte";
	import { connected, state } from "$lib/state";
	import { mapModelShort, send } from "$lib/remote";
	import type { ChatMessage } from "$lib/schema";
	import Authenticate from "./Authenticate.svelte";
  
  let context: any[] | undefined = undefined;
  let models = ["mist", "mist:q4_k", "mist:q4_0", "code"];
  let messages: ChatMessage[] = [];
  let prompt: string = "";
  let activeModel: string;

  $: reversed = messages.length > 0 ? messages.toReversed() : [];

  let socket: WebSocket;

  onMount(async () => {
    activeModel = models[0];
    $state = JSON.parse(window.localStorage.getItem("state") || "{}");
    state.subscribe((value) => {
      if (window.localStorage) {
        window.localStorage.setItem('state', JSON.stringify(value));
      }
    });

    if ($state.username && $state.password) {
      connect();
    }
  });

  function connect() {
    const auth = `${$state.username}:${$state.password}`;
    socket = new WebSocket(`wss://${auth}@io.ivy.direct/aura`);
    socket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "join") {
        $connected = data.data;
      }
      if (data.action === "response") {
        messages[messages.length - 1].text += data.data;
      }
      if (data.action === "response-end") {
        messages[messages.length - 1].done = true;
        messages[messages.length - 2].done = true;
        hljs.highlightAll();
      }
    });
    socket.addEventListener("close", async () => {
      connect();
    });
  }

  async function submit() {
    const prompt_copy = prompt;
    prompt = "";

    if (prompt.startsWith("/config")) return config(prompt.split(" ").slice(1));

    messages = [...messages, { text: prompt_copy, user: "user", count: messages.length }];
    messages = [...messages, { text: "", user: activeModel, count: messages.length }];
    await send(socket, mapModelShort(activeModel), prompt_copy, context);
  }

  function reset() {
    messages = [];
    context = undefined;
  }

  function config(args: string[]) {
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
  {#if !$state.username || !$state.password}
    <Authenticate />
  {/if}
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
    max-height: calc(100vh - 140px - 5rem);
    overflow-y: auto;

    @media (min-width: 768px) {
      padding-right: 1rem;
    }
  }
</style>
