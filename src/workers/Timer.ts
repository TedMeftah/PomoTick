/// <reference lib="WebWorker" />
declare const self: WorkerGlobalScope

type Unpack<T> = {
	[K in keyof T]: T[K] & { type: K }
}[keyof T]

type Payload = Unpack<{
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
}>

self.addEventListener('message', function ({ data }: MessageEvent<Payload>) {
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

type Type = Omit<Worker, 'postMessage'> & {
	postMessage: (message: Payload) => void
}

export default Type
