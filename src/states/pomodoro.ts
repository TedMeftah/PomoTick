import { createMachine } from 'xstate'
import TimerMachine from './timer'

interface Context {
	longBreakCycle: number
	durations: {
        work: number,
        shortBreak: number,
        longBreak: number,
    }
}

export default createMachine<Context, Event>({
    initial: 'idle',
    context: {
        longBreakCycle: 4,
	    durations: {
            work: 25,
            shortBreak: 5,
            longBreak: 30,
        }
    },
    states: {
        idle: {
            invoke: { src: TimerMachine, id: 'timer', onDone: 'done' },
        },

        done: {

        }
    }
})
