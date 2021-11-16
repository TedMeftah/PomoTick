import { createMachine, assign } from 'xstate'
import BackgroundTimer from '@/utilities/BackgroundTimer'

interface Context {
	config: {
		interval: number
		cycles: number
		duration: {
			work: number
			'break:short': number
			'break:long': number
		}
	}
	cycles: number
	duration: number
	elapsed: number
}


type Event = { type: 'TICK' } | { type: 'PAUSE' } | { type: 'RESUME' } | { type: 'RESET' }

const ticker =
	({ config }) =>
	(callback) => {
		if (!BackgroundTimer) return
		const timer = BackgroundTimer.setInterval(() => callback('TICK'), config.interval)
		return () => BackgroundTimer.clearInterval(timer)
	}

const onTick = assign<Context>({ elapsed: ({ elapsed }) => elapsed + 1 })

const isElapsed = ({ elapsed, duration }: Context) => elapsed >= duration
const isCycle = ({ cycles, config }: Context) => cycles >= config.cycles

const incCycles = assign<Context>({ cycles: ({ cycles }) => cycles + 1 })
const resetCycles = assign<Context>({ cycles: 0 })
const resetElapsed = assign<Context>({ elapsed: 0 })
const resetDuration = (of: keyof Context['config']['duration']) =>
	assign<Context>({ duration: ({ config }) => config.duration[of] })

export default createMachine<Context, Event>({
	initial: 'paused',
	context: {
		config: {
			interval: 100,
			cycles: 4,
			duration: {
				work: 1 * 60,
				'break:short': 1 * 60,
				'break:long': 1 * 60
			}
		},
		cycles: 0,
		duration: 0,
		elapsed: 0
	},

	states: {
		paused: {
			on: {
				RESUME: 'running.history',
				RESET: { actions: resetElapsed }
			}
		},

		running: {
			initial: 'work',

			invoke: { id: 'ticker', src: ticker },

			on: {
				PAUSE: 'paused',
				TICK: { actions: onTick }
			},

			states: {
				history: { type: 'history' },
				work: {
					entry: resetDuration('work'),

					always: {
						cond: isElapsed,
						target: 'break:short',
						actions: [resetElapsed, incCycles]
					}
				},

				'break:short': {
					entry: resetDuration('break:short'),
					always: [
						{ target: 'break:long', cond: isCycle },
						{ target: 'work', cond: isElapsed, actions: resetElapsed }
					]
				},

				'break:long': {
					entry: resetDuration('break:long'),
					always: {
						cond: isElapsed,
						target: 'work',
						actions: [resetElapsed, resetCycles]
					}
				}
			}
		}
	}
})
