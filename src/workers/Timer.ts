/// <reference lib="WebWorker" />
declare const self: WorkerGlobalScope

type Payload = {
	setInterval: {
		id: number
		delay: number
	}
	clearInterval: {
		id: number
	}
	setTimeout: {
		id: number
		delay: number
	}
	clearTimeout: {
		id: number
	}
}

type Type<T> = {
	[K in keyof T]: T[K] & { type: K }
}[keyof T]

self.addEventListener('message', function ({ data }: MessageEvent<Type<Payload>>) {
	switch (data.type) {
		case 'setInterval':
			setInterval(function () {
				postMessage(data.id)
			}, data.delay)
			break
		case 'clearInterval':
			clearInterval(data.id)
			break
		case 'setTimeout':
			setTimeout(function () {
				postMessage(data.id)
			}, data.delay)
			break
		case 'clearTimeout':
			clearTimeout(data.id)
			break
	}
})

export type {}
