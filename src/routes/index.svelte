<script>
	import { useMachine } from '@xstate/svelte'
	import TimerMachine from '@/states/timer'

	const { state, send } = useMachine(TimerMachine)
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<div>
	{$state.context.duration - $state.context.elapsed}

	{#if $state.value === 'paused'}
		<button on:click={() => send('RESUME')}>Run</button>
	{/if}

	{#if $state.value === 'running'}
		<button on:click={() => send('PAUSE')}>Pause</button>
	{/if}

	{#if $state.value === 'paused'}
		<button on:click={() => send('RESET')}>Reset</button>
	{/if}
</div>

<style></style>
