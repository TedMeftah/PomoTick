<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import NumberInput from '@/components/NumberInput.svelte'

	type Value = {
		label: string
		name: string
		value: number
	}

	export let values: Value[]

	const dispatch = createEventDispatcher()

	function onReset() {
		dispatch('reset')
	}

	function onSubmit(e) {
		const settings = {}
		var data = new FormData(e.target)
		for (var [key, value] of data) {
			const numberValue = typeof value === 'string' && parseInt(value)
			if (numberValue) {
				settings[key] = numberValue
			}
		}
		dispatch('update', settings)
	}
</script>

<form on:reset|preventDefault={onReset} on:submit|preventDefault={onSubmit}>
	<h3 id="modal-title">Settings</h3>

	<fieldset>
		{#each values as { value, name, label }}
			<NumberInput {label} {name} {value} />
		{/each}
	</fieldset>

	<footer>
		<button type="submit">Save</button>
		<button type="reset">Default</button>
	</footer>
</form>

<style>
	h3 {
		@apply font-medium text-lg px-4 pt-5 text-gray-900 leading-6;
	}

	fieldset {
		@apply bg-white px-4 pt-5 pb-4;
	}

	footer {
		@apply bg-gray-50 py-3 px-4;
	}

	button {
		@apply border rounded-md font-medium shadow-sm text-base w-full py-2 px-4 inline-flex justify-center;
	}

	button:focus {
		@apply outline-none ring-2 ring-offset-2 ring-indigo-500;
	}

	button[type='submit'] {
		@apply border-transparent bg-indigo-600 text-white;
	}

	button[type='submit']:hover {
		@apply bg-indigo-700;
	}

	button[type='reset'] {
		@apply bg-white border-gray-300 mt-3 text-gray-700;
	}

	button[type='reset']:hover {
		@apply bg-gray-50;
	}

	@screen sm {
		h3 {
			@apply px-6;
		}
		fieldset {
			@apply p-6;
		}
		footer {
			@apply flex flex-row-reverse px-6;
		}

		button {
			@apply text-sm w-auto;
		}

		button[type='reset'] {
			@apply mr-auto mt-0;
		}
	}
</style>
