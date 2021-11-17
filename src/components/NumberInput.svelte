<script>
	export let name
	export let step = 1
	export let min = 1
	export let max = Infinity
	export let value = 1
	export let label = ''
	export let id = name
	export let placeholder = min.toString()

	let input

	function refocus() {
		input.focus()
	}

	function decrement() {
		value = Math.max(min, value - step)
	}

	function increment() {
		value = Math.min(value + step, max)
	}
</script>

<label for={id}>{label}</label>
<div class="rounded-md flex shadow-sm mt-1">
	<button type="button" tabindex="-1" on:focus={refocus} on:click={decrement}>
		<svg viewBox="0 0 24 24" role="img" aria-labelledby="{id}-dec">
			<title id="{id}-dec">Decrement</title>
			<path d="M20 12H4" />
		</svg>
	</button>
	<input
		type="number"
		bind:this={input}
		bind:value
		{id}
		{name}
		{step}
		{min}
		{placeholder}
	/>
	<button type="button" tabindex="-1" on:focus={refocus} on:click={increment}>
		<svg viewBox="0 0 24 24" role="img" aria-labelledby="{id}-inc">
			<title id="{id}-dec">Increment</title>
			<path d="M12 4v16m8-8H4" />
		</svg>
	</button>
</div>

<style>
	label {
		@apply font-medium text-sm text-gray-700 block;
	}
	button {
		@apply border font-medium space-x-2 bg-gray-50 border-gray-300 text-sm py-2 px-4 text-gray-700 relative inline-flex items-center;
	}

	button:first-child {
		@apply rounded-l-md -mr-px;
	}

	button:last-child {
		@apply rounded-r-md -ml-px;
	}

	button:hover {
		@apply bg-gray-100;
	}

	button:focus {
		@apply outline-none border-indigo-500 ring-1 ring-indigo-500;
	}

	button svg {
		@apply h-5 fill-none stroke-current text-gray-400 w-5;
	}

	button svg path {
		@apply stroke-cap-round stroke-join-round stroke-width-2;
	}
	input {
		@apply rounded-none border-gray-300 text-center w-full text-gray-900 block;
	}

	input:focus {
		@apply border-indigo-500 rounded-[4px] ring-indigo-500 z-10 relative;
	}

	label:not(:first-child) {
		@apply mt-6;
	}

	@screen sm {
		input {
			@apply text-sm;
		}
	}
</style>
