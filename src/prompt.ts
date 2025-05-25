import {
    createPrompt,
    useKeypress,
    usePrefix,
    isEnterKey,
    makeTheme,
    useState,
} from '@inquirer/core'
import type motions from './motions.json'
import colors from 'yoctocolors-cjs'
import figures from '@inquirer/figures'
type Motion = (typeof motions)[number]

// Create custom prompter to support loading indicator
const loader = createPrompt((config: Motion, done) => {
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

export default loader
