<script lang="ts">
	interface Props {
		input: string;
		images: string[];
		thumbs: string[];
		submit: (e: SubmitEvent) => void;
		click: () => void;
	}

	let {
		input = $bindable(),
		images = $bindable(),
		thumbs = $bindable(),
		submit,
		click
	}: Props = $props();

	// Function to handle file input change
	function handleFileChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					if (reader.result) {
						thumbs = [...thumbs, reader.result as string];
						images = [...images, (reader.result as string).split(',')[1]];
					}
				};
				reader.readAsDataURL(file);
			});
		}
	}

	// Function to handle paste event
	function handlePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (items) {
			Array.from(items).forEach((item) => {
				if (item.type.startsWith('image/')) {
					const file = item.getAsFile();
					if (file) {
						const reader = new FileReader();
						reader.onload = () => {
							if (reader.result) {
								thumbs = [...thumbs, reader.result as string];
								images = [...images, (reader.result as string).split(',')[1]];
							}
						};
						reader.readAsDataURL(file);
					}
				}
			});
		}
	}
</script>

<svelte:window on:paste={handlePaste} />

<div class="thumbs">
	{#each thumbs as thumb, i}
		<button
			class="thumb"
			style="transform: rotateZ({Math.random() * i * 5 - 5}deg);"
			onclick={() => {
				thumbs = thumbs.filter((t) => t !== thumb);
				images = images.filter((i) => i !== thumb.split(',')[1]);
			}}
		>
			<img src={thumb} alt="Thumbnail" />
		</button>
	{/each}
</div>
<div>
	<button onclick={click}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="bi bi-plus-lg"
			viewBox="0 0 16 16"
		>
			<title>Plus</title>
			<path
				fill-rule="evenodd"
				d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
			/>
		</svg>
	</button>
	<!-- todo fix this so its visible and usable later -->
	<input type="file" accept="image/*" multiple onchange={handleFileChange} hidden />
	<form onsubmit={submit}>
		<input type="text" bind:value={input} placeholder="What do you want to ask?" />
	</form>
</div>

<style lang="scss">
	div {
		box-sizing: border-box;
		display: flex;
		gap: 1rem;
		width: 100%;
	}

	button {
		background-color: var(--background);
		border: 1px solid var(--border-primary);
		border-radius: var(--border-radius);
		box-shadow: var(--nm-shadow-sm-primary), var(--nm-shadow-sm-secondary);
		box-sizing: border-box;
		color: var(--text-muted);
		cursor: pointer;
		display: grid;
		place-items: center;
		transition-duration: 0.25s;
		width: 35px;
		height: 35px;
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
		display: flex;
		flex: 1 1;
		flex-direction: column;
		gap: 0.5rem;
	}

	input[type='text'] {
		box-sizing: border-box;
		flex: 1 1;
		border: none;
		outline: none;
		color: var(--text-primary);
		font-size: 0.8rem;
		font-family: var(--font-family);
		font-weight: 400;
		padding: 0.75rem 1rem;
		background-color: var(--background);
		border-radius: var(--border-radius);
		box-shadow:
			var(--nm-shadow-sm-primary) inset,
			var(--nm-shadow-sm-secondary) inset;
		transition-duration: 0.5s;

		&::placeholder {
			color: var(--text-muted);
		}
	}

	.thumbs {
		margin-bottom: 0.5rem;
	}

	.thumb {
		display: grid;
		place-items: center;
		padding: 0.25rem;
		height: unset;
		width: 100px;
	}
	.thumb img {
		border-radius: var(--border-radius-sm);
		width: 100%;
		max-height: 100px;
	}
</style>
