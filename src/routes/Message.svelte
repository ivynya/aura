<script lang="ts">
	import type { ChatMessage } from "$lib/schema";

  export let message: ChatMessage;
  export let count: number;
</script>

<div>
  <h4>
    <span>{count}</span>
    {message.user}
    {#if message.done}
      <span>{message.tokens} tokens</span>
      <span>{Math.round(message.duration_total || 0) / 1000} seconds</span>
    {/if}
  </h4>
  <p>{message.text}</p>
</div>

<style lang="scss">
  h4 {
    display: flex;
    align-items: center;
    margin: 0;
    gap: 0.5rem;

    span {
      font-size: 0.8rem;
      color: var(--text-muted);
      padding: 0.125rem 0.5rem;
    }

    span:first-of-type {
      background-color: var(--background-darker);
      border-radius: var(--border-radius-sm);
      display: grid;
      place-items: center;
      min-width: 0.5rem;
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
