<script lang="ts">
	import Message from "./Message.svelte";

  const message = {
    text: "Authenticate:\n\n```\n/config username <username>\n```\n```\n/config password <password>\n```",
    user: "aura",
    count: 0,
    done: true
  };
</script>

<Message {message} count={0} />
