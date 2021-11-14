import { createMachine, assign } from 'xstate'

interface Context {
	elapsed: number
	duration: number
}

type Event =
	| { type: 'TICK' }
	| { type: 'PAUSE' }
	| { type: 'RESUME' }
	| { type: 'RESET' }

const onTick = assign<Context>({ elapsed: ({ elapsed }) => elapsed + 1 })
const onReset = assign<Context>({ elapsed: 0 })
const isDone = ({ elapsed, duration }: Context) => elapsed >= duration

const ticker = () => (callback) => {
	const id = setInterval(() => callback('TICK'), 1000)
	return () => clearInterval(id)
}

export default createMachine<Context, Event>({
	initial: 'running',
	context: {
		elapsed: 0,
		duration: 10
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
