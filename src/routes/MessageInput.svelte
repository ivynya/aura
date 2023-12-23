<script lang="ts">
  export let input: string;
</script>

<form on:submit>
  <input bind:value={input} placeholder="Input" />
</form>

<style lang="scss">
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
    padding: 0.75rem;
    background-color: var(--background);
		border-radius: var(--border-radius-sm);
		box-shadow:
			var(--nm-shadow-sm-primary) inset,
			var(--nm-shadow-sm-secondary) inset;
    transition-duration: 0.5s;
    display: block;
    height: 35px;
  }
</style>
