import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function rangeRequestPlugin() {
  return {
    name: 'range-request',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.endsWith('.mp4')) return next()

        const filePath = path.join(process.cwd(), 'public', decodeURIComponent(req.url))
        if (!fs.existsSync(filePath)) return next()

        const stat = fs.statSync(filePath)
        const total = stat.size
        const range = req.headers.range

        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Content-Type', 'video/mp4')

        if (range) {
          const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
          const start = parseInt(startStr, 10)
          const end = endStr ? parseInt(endStr, 10) : total - 1
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Content-Length': end - start + 1,
          })
          fs.createReadStream(filePath, { start, end }).pipe(res)
        } else {
          res.setHeader('Content-Length', total)
          fs.createReadStream(filePath).pipe(res)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [rangeRequestPlugin(), react(), tailwindcss()],
})
