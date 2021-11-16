<script lang="ts">
	export let open = false
</script>

<div class="dialog" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="content">
		<!--
        Background overlay, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
		<div class="overlay" aria-hidden="true" />
		<!--
        Modal panel, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
		<div
			class="bg-white rounded-lg shadow-xl text-left transform transition-all inline-block align-bottom overflow-hidden sm:max-w-lg sm:my-8 sm:w-full sm:align-middle"
		>
            <slot></slot>
		</div>
	</div>
</div>

<style>
	.dialog {
		@apply inset-0 z-10 fixed overflow-y-auto;
	}
	.dialog .content {
		@apply flex min-h-screen text-center px-4 pt-4 pb-20 items-end justify-center;
	}

	.dialog .overlay {
		@apply bg-gray-500 bg-opacity-75 inset-0 transition-opacity fixed;
	}

	@screen sm {
		.dialog .content {
			@apply p-0 block;
		}
		.dialog .content::before {
            @apply h-screen content-[''] inline-block align-middle;
		}
	}
</style>
