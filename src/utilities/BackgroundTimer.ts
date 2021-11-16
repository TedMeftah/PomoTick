import TimeWorker from '@/workers/Timer?worker'
import type TimerWoker from '@/workers/Timer'

type Callback = () => void

class BackgroundTimer {
	#worker: TimerWoker
	#counter = 0
	#callbacks = new Map<number, Callback>()

	constructor() {
		this.#worker = new TimeWorker()
		this.#worker.addEventListener('message', (e) => {
			this.#callbacks.get(e.data)?.()
		})
	}

	setInterval(callback: Callback, delay: number): number {
		this.#counter++
		this.#worker.postMessage({
			type: 'setInterval',
			id: this.#counter,
			delay: delay
		})
		this.#callbacks.set(this.#counter, callback)
		return this.#counter
	}

	clearInterval(id: number): void {
		this.#worker.postMessage({
			type: 'clearInterval',
			id: id
		})
		this.#callbacks.delete(id)
	}

	setTimeout(callback: Callback, delay: number): number {
		this.#counter++
		this.#worker.postMessage({
			type: 'setTimeout',
			id: this.#counter,
			delay: delay
		})
		this.#callbacks.set(this.#counter, callback)
		return this.#counter
	}

	clearTimeout(id: number): void {
		this.#worker.postMessage({
			type: 'clearTimeout',
			id: id
		})
		this.#callbacks.delete(id)
	}
}

export default typeof Worker === 'undefined' ? undefined : new BackgroundTimer()
