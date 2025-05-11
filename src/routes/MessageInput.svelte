<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    input: string;
  }

  let { input = $bindable() }: Props = $props();
</script>

<div>
  <button onclick={bubble('click')}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
    </svg>
  </button>
  <form onsubmit={bubble('submit')}>
    <input bind:value={input} placeholder="Input" />
  </form>
</div>

<style lang="scss">
  div {
    display: flex;
    gap: 1rem;
    width: 100%;
  }

  button {
    background-color: var(--background);
    border: 1px solid var(--background-darker);
    border-radius: var(--border-radius-sm);
    box-shadow:
      var(--nm-shadow-sm-primary),
      var(--nm-shadow-sm-secondary);
    box-sizing: border-box;
    color: var(--text-muted);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition-duration: 0.25s;
    width: 40px;
    height: 40px;
    padding: 0;
    outline: none;
    font-size: 1rem;
    font-family: var(--font-family);
    font-weight: 400;
    line-height: 1.5;

    &:hover {
      border-color: var(--text-primary);
      color: var(--text-primary);
    }
  }

  form {
    flex: 1 1;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid var(--background-darker);
    outline: none;
    color: var(--text-primary);
    font-size: 1rem;
    font-family: var(--font-family);
    font-weight: 400;
    line-height: 1.5;
    padding: 1rem;
    background-color: var(--background);
		border-radius: var(--border-radius-sm);
		box-shadow:
			var(--nm-shadow-sm-primary) inset,
			var(--nm-shadow-sm-secondary) inset;
    transition-duration: 0.5s;
    display: block;
    height: 40px;

    &::placeholder {
      color: var(--text-muted);
    }
  }
</style>
