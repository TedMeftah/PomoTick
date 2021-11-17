<script lang="ts">
	import { useMachine } from '@xstate/svelte'
	import Pomodoro from '@/states/pomodoro'
	import NumberInput from '@/components/NumberInput.svelte'
	import Modal from '@/components/Modal.svelte'

	function format(num) {
		return num.toString().padStart(2, '0')
	}

	let { state, send } = useMachine(Pomodoro)

	$: time = $state.context.duration - $state.context.elapsed
	$: seconds = Math.round(time % 60)
	$: minutes = Math.round((time - seconds) / 60)
	$: formated = `${format(minutes)}:${format(seconds)}`

	$: current = $state.matches('paused')
		? 'Paused'
		: $state.matches('running.work')
		? 'Work'
		: $state.matches('running.break:short')
		? 'Break'
		: $state.matches('running.break:long')
		? 'Long Break'
		: ''

	function updateSettings(e) {
		const settings = {}
		var data = new FormData(e.target)
		for (var [key, value] of data) {
			const numberValue = typeof value === 'string' && parseInt(value)
			if (numberValue) {
				settings[key] = numberValue
			}
		}
		console.log(settings)
		send('SETTINGS.UPDATE', { settings })
	}

	let showSettings = false

	function openSettings() {
		send('PAUSE')
		showSettings = true
	}

	function closeSettings() {
		send('PAUSE')
		showSettings = true
	}
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>
<header class="z-100 fixed">
	<button type="button" on:click={() => (showSettings = !showSettings)}>
		<svg class="h-6 w-6" fill="none" stroke="currentColor">
			<title>Settings</title>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
			/>
		</svg>
	</button>
</header>
<Modal open={showSettings}>
	<form on:submit|preventDefault={updateSettings}>
		<header class="px-4 pt-5 sm:px-6">
			<h3 class="font-medium text-lg text-gray-900 leading-6" id="modal-title">
				Settings
			</h3>
		</header>
		<fieldset class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
			<NumberInput
				label="Work Duration"
				name="duration:work"
				value={$state.context.settings.duration['work'] / 60}
			/>

			<NumberInput
				label="Short Break Duration"
				name="duration:break:short"
				value={$state.context.settings.duration['break:short'] / 60}
			/>

			<NumberInput
				label="Long Break Duration"
				name="duration:break:long"
				value={$state.context.settings.duration['break:long'] / 60}
			/>

			<NumberInput
				label="Long Break After"
				name="cycles"
				value={$state.context.settings.cycles}
			/>
		</fieldset>

		<footer>
			<div class="bg-gray-50 py-3 px-4 sm:flex sm:flex-row-reverse sm:px-6">
				<button
					type="submit"
					class="border border-transparent rounded-md font-medium bg-red-600 shadow-sm text-base text-white w-full py-2 px-4 inline-flex justify-center sm:text-sm sm:ml-3 sm:w-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
				>
					Update Settings
				</button>
				<button
					type="reset"
					class="bg-white border rounded-md font-medium border-gray-300 shadow-sm mt-3 text-base w-full py-2 px-4 text-gray-700 inline-flex justify-center sm:mt-0 sm:text-sm sm:ml-3 sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Reset
				</button>
			</div>
		</footer>
	</form>
</Modal>
<div class="flex flex-col h-screen select-none justify-center items-center">
	<span
		class="rounded-full bg-cyan-300 text-lg tracking-wider py-1 px-4 text-cyan-900 uppercase block"
	>
		{current}
	</span>
	<time class="font-bold text-10xl block tabular-nums" datetime="PT{minutes}M{seconds}S">
		{formated}
	</time>

	{$state.context.cycles}/{$state.context.settings.cycles}

	{#if $state.value === 'paused'}
		<button on:click={() => send('RESUME')}>Start</button>
	{/if}
	{#if $state.matches('running')}
		<button on:click={() => send('PAUSE')}>Stop</button>
	{/if}

	<button disabled={$state.value !== 'paused'} on:click={() => send('RESET')}>
		Restart
	</button>
</div>

<style>
	button:disabled {
		@apply opacity-40 pointer-events-none;
	}
</style>
