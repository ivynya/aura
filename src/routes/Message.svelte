<script lang="ts">
  import { marked } from "marked";
  import { fade } from "svelte/transition"; 
	import type { ChatMessage } from "$lib/schema";

  export let message: ChatMessage;
  export let count: number;

  $: duration = (message.duration_total || 0) / 1000;
  $: tokens = message.tokens || 0;
</script>

<div id="msg-{count}" class="msg" class:user={message.user === "user"} transition:fade={{duration: 200}}>
  <h4>
    <span>{count}</span>
    {message.user}
    <span class="spacer" />
    {#if message.done}
      <span>{(tokens / duration).toFixed(1)} tk/s</span>
      <span>{tokens}tk</span>
      <span>{duration.toFixed(1)}s</span>
    {/if}
  </h4>
  {#if message.text.length === 0}
    <div class="loading">parsing context...</div>
  {:else}
    <div>{@html marked.parse(message.text)}</div>
  {/if}
</div>

<style lang="scss">
  .msg {
    background: var(--background);
    border: 1px solid;
    border-color:
      var(--border-primary)
      var(--border-secondary)
      var(--border-secondary)
      var(--border-primary);
    border-radius: var(--border-radius-sm);
    box-shadow:
      var(--nm-shadow-sm-primary),
      var(--nm-shadow-sm-secondary);
    transition-duration: 0.5s;
    box-shadow: var(--nm-shadow-sm-secondary);
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

    span {
      font-size: 0.8rem;
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
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-primary);
    white-space: pre-wrap;
  }

  .msg :global(code) {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--text-primary);
    white-space: pre-wrap;
    background-color: var(--background-darker);
    border-radius: var(--border-radius-sm);
    padding: 0 0.25rem;
    overflow-x: auto;
    font-family: cartograph-cf, monospace;
  }
  
  .msg :global(pre) {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-primary);
    white-space: pre-wrap;
    background-color: var(--background-darker);
    border-radius: var(--border-radius-sm);
    padding: 0.5rem 1rem;
    overflow-x: auto;
    font-family: cartograph-cf, monospace;
  }
</style>
