<script lang="ts">
	import { useMachine } from '@xstate/svelte'
	import Pomodoro from '@/states/pomodoro'

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

<header>
	<button on:click={openSettings}>Settings</button>
</header>

<dialog open={showSettings}>
	<form on:submit|preventDefault={updateSettings}>
		<input
			type="number"
			name="cycles"
			value={$state.context.settings.cycles}
		/>
		<input
			type="number"
			name="duration:work"
			value={$state.context.settings.duration['work'] / 60}
		/>
		<input
			type="number"
			name="duration:break:short"
			value={$state.context.settings.duration['break:short'] / 60}
		/>
		<input
			type="number"
			name="duration:break:long"
			value={$state.context.settings.duration['break:long'] / 60}
		/>
		<button type="submit">Update Settings</button>
		<button type="reset">Reset</button>
	</form>
</dialog>

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
