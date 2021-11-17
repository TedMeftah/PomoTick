import type { TransitionConfig } from 'svelte/types/runtime/transition'

export function wait(node: Element, duration = 200): TransitionConfig {
	return {
		duration,
		tick: (t) => node.toggleAttribute('hidden', t !== 1)
	}
}
