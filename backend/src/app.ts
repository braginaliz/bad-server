import helmet from 'helmet'
import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import fs from 'fs'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

import { rateLimitApp } from './utils/rateLimits'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

app.use(cors())
app.use(cors({ origin: process.env.ORIGIN_ALLOW || 'http://localhost:3000', credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));
const uploadedPath = path.join(__dirname, 'public', process.env.UPLOAD_PATH_TEMP || '')
if (!fs.existsSync(uploadedPath)) {
  fs.mkdirSync(uploadedPath, { recursive: true })
}

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.use(rateLimitApp)
app.use(helmet())
app.use(routes)
app.use(errors())
app.use(errorHandler)

app.set('trust proxy', 1)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()