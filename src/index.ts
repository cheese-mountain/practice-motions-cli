#!/usr/bin/env bun

import { select } from '@inquirer/prompts'
import { getPrompts, ask, type Choice, choices } from './prompts/index'

const options = { clearPromptOnDone: true }

function exit(err: unknown) {
    console.log(err instanceof Error ? err.message : err)
    process.exit(0)
}

async function main() {
    const type = (await select({
        message: ' What do you want to practice?',
        choices,
    }).catch(exit)) as Choice
    const prompts = getPrompts(type)

    const start = performance.now()
    for (const prompt of prompts) {
        await ask(prompt, options).catch(exit)
    }

    const time = (performance.now() - start) / 1000
    const speed = (time / prompts.length).toFixed(2)

    console.log(`Good job! Average time: ${speed}s / motion 🔥`)
}

await main()
