<script lang="ts">
	export let open = false
</script>

{#if open}
	<div
		class="dialog"
		class:is-open={open}
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
	.dialog {
		@apply inset-0 z-10 fixed overflow-y-auto;
	}
	.dialog .content {
		@apply flex min-h-screen text-center px-4 pt-4 pb-20 items-end justify-center;
	}

	.dialog .overlay {
		@apply bg-gray-500 bg-opacity-75 inset-0 transition-opacity fixed;
		@apply opacity-0;
		@apply ease-out duration-300;
	}

	.dialog.is-open .overlay {
		@apply opacity-100;
		@apply ease-in duration-200;
	}

	.dialog .panel {
		@apply bg-white rounded-lg shadow-xl text-left transform transition-all inline-block align-bottom overflow-hidden;
		@apply opacity-0 ease-in translate-y-4 duration-200;
		@apply ease-in duration-200;
	}

	.dialog.is-open .panel {
		@apply opacity-100 translate-y-0;
		@apply ease-out duration-300;
	}

	@screen sm {
		.dialog .content {
			@apply p-0 block;
		}
		.dialog .content::before {
			@apply h-screen content-[''] inline-block align-middle;
		}

		.dialog .panel {
			@apply max-w-lg my-8 w-full align-middle;
			@apply scale-95 translate-y-0;
		}
		.dialog.is-open .panel {
			@apply scale-100;
		}
	}
</style>
