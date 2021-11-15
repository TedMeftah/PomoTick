import { createMachine, assign } from 'xstate'

interface Context {
	elapsed: number
	duration: number
	interval: number
}

type Event = { type: 'TICK' } | { type: 'PAUSE' } | { type: 'RESUME' } | { type: 'RESET' }

const onTick = assign<Context>({ elapsed: ({ elapsed }) => elapsed + 1 })
const onReset = assign<Context>({ elapsed: 0 })
const isDone = ({ elapsed, duration }: Context) => elapsed >= duration

const ticker =
	({ interval }) =>
	(callback) => {
		let last = Date.now()
		let timer: number

		callback('TICK')
		function tick() {
			timer = requestAnimationFrame(tick)
			const current = Date.now()
			if (current - last >= interval) {
				last = current
				callback('TICK')
			}
		}
		tick()

		return () => cancelAnimationFrame(timer)
	}

export default createMachine<Context, Event>({
	initial: 'paused',
	context: {
		elapsed: 0,
		duration: 60 * 25,
		interval: 1000
	},
	states: {
		running: {
			invoke: { id: 'ticker', src: ticker },
			always: { target: 'done', cond: isDone },
			on: {
				TICK: { actions: onTick },
				PAUSE: 'paused'
			}
		},
		paused: {
			on: {
				RESUME: 'running',
				RESET: { actions: onReset }
			}
		},
		done: { type: 'final' }
	}
})
