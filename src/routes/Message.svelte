<script lang="ts">
	import type { ChatMessage } from "$lib/schema";

  export let message: ChatMessage;
  export let count: number;
</script>

<div class:user={message.user === "user"}>
  <h4>
    <span>{count}</span>
    {message.user}
    <span class="spacer" />
    {#if message.done}
      <span>{message.tokens} tokens</span>
      <span>{Math.round(message.duration_total || 0) / 1000} seconds</span>
    {/if}
  </h4>
  <p>{message.text}</p>
</div>

<style lang="scss">
  div.user {
    filter: grayscale(1);

    h4 {
      color: var(--text-muted);
    }

    p {
      color: var(--text-muted);
    }
  }

  h4 {
    border-top: dotted 3px var(--background-darker);
    display: flex;
    align-items: center;
    margin: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
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

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-primary);
  }
</style>
