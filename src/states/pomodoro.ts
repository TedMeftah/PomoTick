import { createMachine, assign } from 'xstate'
import BackgroundTimer from '@/utilities/BackgroundTimer'

interface Context {
	settings: {
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

type Event = Unpack<{
	TICK: Record<string, never>
	PAUSE: Record<string, never>
	RESUME: Record<string, never>
	RESET: Record<string, never>
	'SETTINGS.UPDATE': { settings: SettingsPayload }
}>

type SettingsPayload = Partial<{
	cycles: number
	'duration:work': number
	'duration:break:short': number
	'duration:break:long': number
}>

type SettingsEvent = Event & { type: 'SETTINGS.UPDATE' }

const ticker =
	({ settings }) =>
	(callback) => {
		if (!BackgroundTimer) return
		const timer = BackgroundTimer.setInterval(() => callback('TICK'), settings.interval)
		return () => BackgroundTimer.clearInterval(timer)
	}

const onTick = assign<Context>({ elapsed: ({ elapsed }) => elapsed + 1 })

const isElapsed = ({ elapsed, duration }: Context) => elapsed >= duration
const isCycle = ({ cycles, settings }: Context) => cycles >= settings.cycles

const incCycles = assign<Context>({ cycles: ({ cycles }) => cycles + 1 })
const resetCycles = assign<Context>({ cycles: 0 })
const resetElapsed = assign<Context>({ elapsed: 0 })
const resetDuration = (of: keyof Context['settings']['duration']) =>
	assign<Context>({ duration: ({ settings }) => settings.duration[of] })

const setSettings = assign<Context, SettingsEvent>(({ settings }, event) => {
	if (event.type !== 'SETTINGS.UPDATE') return
	return {
		settings: {
			interval: settings.interval,
			cycles: event.settings.cycles || settings.cycles,
			duration: {
				work: event.settings['duration:work'] * 60 || settings.duration.work,
				'break:long':
					event.settings['duration:break:long'] * 60 || settings.duration['break:long'],
				'break:short':
					event.settings['duration:break:short'] * 60 || settings.duration['break:short']
			}
		}
	}
})

export default createMachine<Context, Event>({
	initial: 'paused',
	context: {
		settings: {
			interval: 1000,
			cycles: 4,
			duration: {
				work: 25 * 60,
				'break:short': 5 * 60,
				'break:long': 15 * 60
			}
		},
		cycles: 0,
		duration: 0,
		elapsed: 0
	},

	on: {
		'SETTINGS.UPDATE': { actions: setSettings }
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
					},

					on: {
						'SETTINGS.UPDATE': { actions: [setSettings, resetDuration('work')] }
					}
				},

				'break:short': {
					entry: resetDuration('break:short'),
					always: [
						{ target: 'break:long', cond: isCycle },
						{ target: 'work', cond: isElapsed, actions: resetElapsed }
					],
					on: {
						'SETTINGS.UPDATE': { actions: [setSettings, resetDuration('break:short')] }
					}
				},

				'break:long': {
					entry: resetDuration('break:long'),
					always: {
						cond: isElapsed,
						target: 'work',
						actions: [resetElapsed, resetCycles]
					},
					on: {
						'SETTINGS.UPDATE': { actions: [setSettings, resetDuration('break:short')] }
					}
				}
			}
		}
	}
})
