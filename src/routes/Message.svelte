<script lang="ts">
	import type { ChatMessage } from "$lib/schema";

  export let message: ChatMessage;
  export let count: number;
</script>

<div>
  <h4>{message.user} <span>{count}</span></h4>
  <p>{message.text}</p>
</div>

<style lang="scss">
  h4 {
    display: flex;
    align-items: center;
    margin: 0;

    span {
      font-size: 0.75rem;
      font-weight: 400;
      background-color: var(--background-darker);
      border-radius: var(--border-radius-sm);
      color: var(--text-muted);
      margin-left: 0.5rem;
      padding: 0.125rem 0.5rem;
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
