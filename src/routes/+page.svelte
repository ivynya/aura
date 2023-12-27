<script lang="ts">
  import hljs from "highlight.js";
	import Authenticate from "./Authenticate.svelte";
	import Message from "./Message.svelte";
	import MessageInput from "./MessageInput.svelte";
	import ModelSelect from "./ModelSelect.svelte";
	import { onMount } from "svelte";
	import { connected_clients, connected_providers, state } from "$lib/state";
	import { mapModelShort, send, summarizeYoutube } from "$lib/remote";
	import type { ChatMessage } from "$lib/schema";
  
  let context: any[] = [];
  let models = ["mistral", "mistral:q2_k", "codellama", "codellama:13b"];
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
    socket = new WebSocket(`wss://${auth}@io.ivy.direct/aura/client`);
    socket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "clients") {
        $connected_clients = data.data;
      }
      if (data.action === "providers") {
        $connected_providers = data.data;
      }
      if (data.action === "response") {
        const json = JSON.parse(data.data);
        messages[messages.length - 1].text += json.response;
        if (json.done) {
          context = json.context;
          messages[messages.length - 1].done = true;
          messages[messages.length - 1].duration = json.eval_duration / 1e9;
          messages[messages.length - 1].tokens = json.eval_count;
          messages[messages.length - 2].done = true;
          messages[messages.length - 2].duration = json.prompt_eval_duration / 1e9;
          messages[messages.length - 2].tokens = json.prompt_eval_count;
          hljs.highlightAll();
        }
      }
    });
    socket.addEventListener("close", async () => {
      connect();
    });
  }

  async function submit() {
    const prompt_copy = prompt;
    prompt = "";

    if (prompt_copy.startsWith("/config")) return config(prompt_copy.split(" ").slice(1));
    if (prompt_copy.startsWith("/summarize")) return summarize(prompt_copy.split(" ").slice(1).join(" "));

    messages = [...messages, { text: prompt_copy, user: "user", count: messages.length }];
    messages = [...messages, { text: "", user: mapModelShort(activeModel), count: messages.length }];
    await send(socket, mapModelShort(activeModel), prompt_copy, context);
  }

  function reset() {
    messages = [];
    context = [];
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

  async function summarize(video: string) {
    video = video.trim();
    let videoID = "";
    if (video.startsWith("https://youtube.com") || video.startsWith("https://www.youtube.com")) {
      videoID = video.split("v=")[1];
      if (videoID.includes("&")) videoID = videoID.split("&")[0];
    } else if (video.startsWith("https://youtu.be")) {
      video = video.split("?")[0];
      videoID = video.split("youtu.be/")[1];
    } else {
      messages = [...messages, { text: "Invalid video URL", user: "aura", count: messages.length }];
      return;
    }

    messages = [...messages, { text: "/summarize " + video, user: "user", count: messages.length }];
    messages = [...messages, { text: "", user: mapModelShort(activeModel), count: messages.length }];
    await summarizeYoutube(socket, mapModelShort(activeModel), videoID)
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
    max-height: calc(100vh - 165px - 5rem);
    overflow-y: auto;

    @media (min-width: 768px) {
      padding-right: 1rem;
    }
  }
</style>
