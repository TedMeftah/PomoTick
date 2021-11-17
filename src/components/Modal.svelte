<script lang="ts">
	import type { TransitionConfig } from 'svelte/types/runtime/transition'

	export let open = false

	function wait(node: Element, duration = 200): TransitionConfig {
		return {
			duration,
			tick: (t) => node.toggleAttribute('hidden', t !== 1)
		}
	}
</script>

{#if open}
	<div
		hidden={!open}
		in:wait={200}
		out:wait={300}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div class="content">
			<div class="overlay" aria-hidden="true" />
			<div class="panel">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	[role='dialog'] {
		@apply inset-0 z-10 block fixed overflow-y-auto visible;
	}

	[role='dialog'][hidden] {
		@apply invisible;
	}

	[role='dialog'] .content {
		@apply flex min-h-screen text-center px-4 pt-4 pb-20 items-end justify-center;
	}

	[role='dialog'] .overlay {
		@apply bg-gray-500 bg-opacity-75 inset-0 transition-opacity fixed;
		@apply opacity-100;
		@apply ease-in duration-200;
	}

	[role='dialog'][hidden] .overlay {
		@apply ease-out duration-300;
		@apply opacity-0;
	}

	[role='dialog'] .panel {
		@apply bg-white rounded-lg shadow-xl text-left transform transition-all inline-block align-bottom overflow-hidden;
		@apply opacity-100 translate-y-0;
		@apply ease-out duration-300;
	}

	[role='dialog'][hidden] .panel {
		@apply opacity-0 ease-in translate-y-4 duration-200;
		@apply ease-in duration-200;
	}

	@screen sm {
		[role='dialog'] .content {
			@apply p-0 block;
		}
		[role='dialog'] .content::before {
			@apply h-screen content-[''] inline-block align-middle;
		}

		[role='dialog'] .panel {
			@apply max-w-lg my-8 w-full align-middle;
			@apply scale-100;
		}
		[role='dialog'] .panel[hidden] {
			@apply scale-95 translate-y-0;
		}
	}
</style>
