#!/usr/bin/env bun

import { confirm } from '@inquirer/prompts'
import { prompt, log, getMotions } from './lib'

const options = { clearPromptOnDone: true }
const motions = getMotions()

const ready = await confirm({ message: 'Ready? 🏁' }).catch(log)
if (ready) {
    const start = performance.now()
    for (const motion of motions) {
        await prompt(motion, options).catch(log)
    }

    const time = (performance.now() - start) / 1000
    const speed = (time / motions.length).toFixed(2)

    console.log(`Average time: ${speed}s / motion 🔥`)
}
