<script lang="ts">
	import Message from './Message.svelte';

	const c_protocol = '/config protocol <protocol="wss"|"ws">';
	const c_endpoint = '/config endpoint <endpoint>';
	const c_username = '/config username <username>';
	const c_password = '/config password <password>';

	const text = ['Authenticate:', '', '```', c_protocol, c_endpoint, c_username, c_password, '```'];

	const message = {
		model: 'aura',
		role: 'tool' as 'tool',
		content: text.join('\n'),
		count: 0,
		done: true
	};
</script>

<Message {message} count={0} />
