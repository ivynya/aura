<script lang="ts">
  import "$lib/app.scss";
	import { onMount } from "svelte";
  import { stylesheet, initialize, isLight } from "@ivynya/leaf";
	import StatusHeader from "./StatusHeader.svelte";

  onMount(() => {
    initialize();
		stylesheet.subscribe(sheet => {
			document.body.setAttribute("style", sheet);
			document.body.setAttribute("data-dark", $isLight ? "false" : "true");
		});
  });
</script>

<StatusHeader />
<main>
  <slot />
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    padding: 30px;
    flex: 1 1;

    @media (max-width: 768px) {
      padding: 15px;
    }
  }
</style>
