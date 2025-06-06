import {
    createPrompt,
    useKeypress,
    usePrefix,
    isEnterKey,
    makeTheme,
    useState,
} from '@inquirer/core'
import colors from 'yoctocolors-cjs'
import figures from '@inquirer/figures'
import basic from './basic.json'
import { readFileSync } from 'fs'
import { join } from 'path'
export const choices = [
    {
        value: 'basic',
        name: '🐌 Basic navigation',
    },
    {
        value: 'jumps',
        name: '🐰 Line jumps',
    },
    {
        value: 'motions',
        name: '🚀 Common motions',
    },
] as const

export type Choice = (typeof choices)[number]['value']
type Prompt = (typeof basic)[number]

export function getPrompts(type: Choice): Prompt[] {
    const path = join(__dirname, `${type}.json`)
    const json = readFileSync(path, 'utf8')
    return shuffle(JSON.parse(json))
}

function shuffle<T>(array: Array<T>): Array<T> {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// 🔍 function getNumber(x: number): number { ... }
//              █─────────╯

// Create custom prompter to support custom behaviors
type CodeMarker = [start: number, end?: number]
function isCodeMarker(arr?: (number | undefined)[]): arr is CodeMarker {
    return !!arr && arr.length > 1
}

function getHelperCode([start, end]: CodeMarker): string {
    const header = '🔍 function getNumber(x: number): number { ... }'
    const indent = '\n' + ' '.repeat(3)
    end = end ? end : header.length - 2
    let marker = '─'.repeat(Math.abs(end - start) - 2)
    marker = start < end ? `█${marker}╯` : `╰${marker}█`
    marker = `${indent}${' '.repeat(Math.min(start, end))}${marker}`
    return colors.dim(header) + marker
}
export const ask = createPrompt(({ prompt, answer, marker }: Prompt, done) => {
    const theme = makeTheme({ prefix: { idle: colors.green(figures.tick) } })
    const prefix = usePrefix({ status: 'loading', theme })
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)
    const code = isCodeMarker(marker) ? getHelperCode(marker) : ''
    const question = theme.style.message(` How do you ${prompt}?`, 'idle')
    const errorMsg = theme.style.error(' Wrong combination. Try again!')
    const msg = `${prefix} ${question} ${value}`

    useKeypress((key, rl) => {
        if (isEnterKey(key)) {
            if (value === answer) {
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

    if (error) return [msg, errorMsg]
    return code ? [msg, code] : msg
})
