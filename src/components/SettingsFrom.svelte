<script lang="ts">
	import type { Context } from '@/states/pomodoro'

	import { createEventDispatcher } from 'svelte'
	import Modal from '@/components/Modal.svelte'
	import NumberInput from '@/components/NumberInput.svelte'

	type Field = {
		label: string
		name: string
		value: number
	}

	const defaults = {
		cycles: 4,
		'duration:work': 25,
		'duration:break:short': 5,
		'duration:break:long': 10
	}

	export let context: () => Context['settings']

	export let show = false

	export let send

	let fields: Field[] = [
		{
			label: 'Work Duration',
			name: 'duration:work',
			value: 0
		},

		{
			label: 'Short Break Duration',
			name: 'duration:break:short',
			value: 0
		},

		{
			label: 'Long Break Duration',
			name: 'duration:break:long',
			value: 0
		},

		{
			label: 'Long Break After',
			name: 'cycles',
			value: 0
		}
	]

	function syncFields() {
		const { cycles, duration } = context()
		setValues({
			cycles,
			'duration:work': duration.work / 60,
			'duration:break:short': duration['break:short'] / 60,
			'duration:break:long': duration['break:long'] / 60
		})
	}

	syncFields()

	function setValues(values) {
		fields = fields.map((field) => {
			console.log(field.name, values[field.name])
			field.value = values[field.name] ?? field.value
			return field
		})
	}

	function onReset() {
		setValues(defaults)
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

		send('SETTINGS.UPDATE', { settings })
		syncFields()
        show = false
	}
</script>

<Modal open={show} on:close={() => (show = false)}>
	<form on:reset|preventDefault={onReset} on:submit|preventDefault={onSubmit}>
		<h3 id="modal-title">Settings</h3>

		<fieldset>
			{#each fields as { value, name, label }}
				<NumberInput {label} {name} {value} />
			{/each}
		</fieldset>

		<footer>
			<button type="submit">Save</button>
			<button type="reset">Default</button>
		</footer>
	</form>
</Modal>

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
