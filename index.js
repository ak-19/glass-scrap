import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import './data-model/database.js';

import mainRouter from './mainRouter.js'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/pdf', express.static('download'))

app.use('/', mainRouter)

app.listen(process.env.PORT || 8080, () => console.log(`Server runing at ${process.env.PORT || 8080}`))