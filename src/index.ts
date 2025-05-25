#!/usr/bin/env bun

import { confirm } from '@inquirer/prompts'
import prompt from './prompt'
import motions from './motions.json' assert { type: 'json' }

function log(err: unknown) {
    console.log(err instanceof Error ? err.message : err)
}

function shuffle<T>(array: Array<T>): Array<T> {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}
const options = { clearPromptOnDone: true }

const ready = await confirm({ message: 'Ready? 🏁' }).catch(log)
if (ready) {
    const start = performance.now()
    for (const motion of shuffle(motions)) {
        await prompt(motion, options).catch(log)
    }

    const time = (performance.now() - start) / 1000
    const speed = (time / motions.length).toFixed(2)

    console.log(`Average time: ${speed}s / motion 🔥`)
}
