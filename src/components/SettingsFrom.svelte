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
	<header class="px-4 pt-5 sm:px-6">
		<h3 class="font-medium text-lg text-gray-900 leading-6" id="modal-title">Settings</h3>
	</header>
	<fieldset class="bg-white px-4 pt-5 pb-4 sm:p-6">
		{#each values as { value, name, label }}
			<NumberInput {label} {name} {value} />
		{/each}
	</fieldset>

	<footer>
		<div class="bg-gray-50 py-3 px-4 sm:flex sm:flex-row-reverse sm:px-6">
			<button
				type="submit"
				class="border border-transparent rounded-md font-medium bg-red-600 shadow-sm text-base text-white w-full py-2 px-4 inline-flex justify-center sm:text-sm sm:ml-3 sm:w-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
			>
				Save
			</button>
			<button
				type="reset"
				class="bg-white border rounded-md font-medium border-gray-300 shadow-sm mt-3 text-base w-full py-2 px-4 text-gray-700 inline-flex justify-center sm:mt-0 sm:text-sm sm:ml-3 sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Default
			</button>
		</div>
	</footer>
</form>
