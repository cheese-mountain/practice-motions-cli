import {
    createPrompt,
    useKeypress,
    usePrefix,
    isEnterKey,
    makeTheme,
    useState,
} from '@inquirer/core'
import motions from './motions.json' assert { type: 'json' }
import colors from 'yoctocolors-cjs'
import figures from '@inquirer/figures'
type Motion = (typeof motions)[number]

// Create custom prompter to support loading indicator
export const prompt = createPrompt((config: Motion, done) => {
    const theme = makeTheme({ prefix: { idle: colors.green(figures.tick) } })
    const prefix = usePrefix({ status: 'loading', theme })
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)
    const { motion, keystroke } = config
    const message = theme.style.message(` How do you ${motion}?`, 'idle')

    useKeypress((key, rl) => {
        if (isEnterKey(key)) {
            if (value === keystroke) {
                done(value)
            } else {
                setValue('')
                setError(true)
            }
        } else {
            setError(false)
            setValue(rl.line)
        }
    })

    return [
        `${prefix} ${message} ${value}`,
        error
            ? theme.style.error('Invalid motion combination. Try again!')
            : '',
    ]
})

export function log(err: unknown) {
    console.log(err instanceof Error ? err.message : err)
}

export const getMotions = () => shuffle(motions)

function shuffle<T>(array: Array<T>): Array<T> {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}
