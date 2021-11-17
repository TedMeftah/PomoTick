<script lang="ts">
	import { useMachine } from '@xstate/svelte'
	import Pomodoro from '@/states/pomodoro'
	import Modal from '@/components/Modal.svelte'
	import SettingsFrom from '@/components/SettingsFrom.svelte'

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

	let showSettings = false

	let settingValues = getSettingValues()

	function getSettingValues() {
		return [
			{
				label: 'Work Duration',
				name: 'duration:work',
				value: $state.context.settings.duration['work'] / 60
			},

			{
				label: 'Short Break Duration',
				name: 'duration:break:short',
				value: $state.context.settings.duration['break:short'] / 60
			},

			{
				label: 'Long Break Duration',
				name: 'duration:break:long',
				value: $state.context.settings.duration['break:long'] / 60
			},

			{
				label: 'Long Break After',
				name: 'cycles',
				value: $state.context.settings.cycles
			}
		]
	}

	function updateSettings(e) {
		send('SETTINGS.UPDATE', { settings: e.detail })
		settingValues = getSettingValues()
		showSettings = false
	}

	function resetSettings() {
		send('SETTINGS.UPDATE', {
			settings: {
				cycles: 4,
				'duration:work': 25,
				'duration:break:short': 5,
				'duration:break:long': 10
			}
		})
		settingValues = getSettingValues()
		showSettings = false
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
	<SettingsFrom
		values={settingValues}
		on:reset={resetSettings}
		on:update={updateSettings}
	/>
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
