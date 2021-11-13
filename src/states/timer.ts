import { createMachine, assign } from 'xstate'

interface TimerContext {
	elapsed: number
	duration: number
}

type TimerEvent =
	| { type: 'TICK' }
	| { type: 'PAUSE' }
	| { type: 'RESUME' }
	| { type: 'RESET' }

const onTick = assign<TimerContext>({ elapsed: ({ elapsed }) => elapsed + 1 })
const onReset = assign<TimerContext>({ elapsed: 0 })
const isDone = ({ elapsed, duration }: TimerContext) => elapsed >= duration

const ticker = () => (callback) => {
	const id = setInterval(() => callback('TICK'), 1000)
	return () => clearInterval(id)
}

export default createMachine<TimerContext, TimerEvent>({
	initial: 'paused',
	context: {
		elapsed: 0,
		duration: 50
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
