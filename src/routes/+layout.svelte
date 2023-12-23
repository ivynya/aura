<script lang="ts">
  import "$lib/app.scss";
	import { onMount } from "svelte";
  import { stylesheet, initialize, isLight } from "@ivynya/leaf";

  onMount(() => {
    initialize();
		stylesheet.subscribe(sheet => {
			document.body.setAttribute("style", sheet);
			document.body.setAttribute("data-dark", $isLight ? "false" : "true");
		});
  });
</script>

<main>
  <slot />
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    padding: 30px;
  }
</style>
