<script lang="ts">
	import { connected } from "$lib/state";
</script>

<div class="status">
  {#if $connected !== "not connected"}
    <span>illm connected • {$connected} clients</span>
  {:else}
    <span>illm disconnected</span>
  {/if}
</div>

<style lang="scss">
  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #2E3440;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    box-shadow: var(--nm-shadow-sm-primary);
    color: #D8DEE9;
    font-size: 0.75rem;
    font-family: var(--font-family);
    font-weight: 400;
    line-height: 1.5;
    height: 10px;
    padding-bottom: 15px;
  }
</style>
