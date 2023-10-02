import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

let isLock = false
const __dirname = fileURLToPath(new URL('.', import.meta.url))

fs.watch(path.join(__dirname, '..', 'backend', 'migrations'), () => {
  if (isLock) return
  isLock = true

  exec('pnpm pocketbase-typegen', (error) => {
    if (isLock) {
      isLock = false
    }

    if (error) {
      throw new Error(error)
    }

    console.log('[apps/watcher] Pocketbase types generated.')
  })
})
