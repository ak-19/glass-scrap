import express from 'express';

import { v4 as uuidv4 } from 'uuid';

import { getDataRequestHandler, scrapRequestHandler } from './requestHandler.js';

const mainRouter = express.Router();

mainRouter.post('/', async (req, res) => {
    const requestId = uuidv4();
    const { body: credentials } = req;
    scrapRequestHandler({ credentials, requestId });
    res.json({ message: 'received request', requestId });
})

mainRouter.get('/:id', async (req, res) => {
    const { params } = req;
    const response = await getDataRequestHandler(params.id, req)
    res.json(response);
})

export default mainRouter;