<script lang="ts">
	import { connected_clients, connected_providers } from '$lib/state';

	let clients_text = $derived($connected_clients === '1' ? 'client' : 'clients');
	let providers_text = $derived($connected_providers === '1' ? 'provider' : 'providers');
</script>

<div class="status">
	{#if $connected_clients !== 'not connected'}
		<span
			>illm connected • {$connected_clients}
			{clients_text} • {$connected_providers}
			{providers_text}</span
		>
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
		background-color: #213147;
		color: #d8dee9;
		font-size: 0.75rem;
		font-family: var(--font-family);
		font-weight: 400;
		line-height: 1.5;
		height: 10px;
	}
</style>
