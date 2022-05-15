import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Person from './data-model/personModel.js';
import processGlassDoorAccount from './glassdoor-processing/scrapper.js'

const scrapRequestHandler = async requestData => {
    const { requestId, credentials } = requestData;
    try {
        const { username, password } = credentials;
        const downloadPath = path.resolve(`./download/${requestId}`);
        const account = await processGlassDoorAccount(username, password, downloadPath);
        console.log('Recevied account - storing to database');

        const personToSave = new Person({ status: 'done', ...account, requestId });
        await personToSave.save();
        console.log(account.name + ' saved');
        return 'Done with processing';
    } catch (error) {
        const personToSave = new Person({ status: 'failed', error: error.message, requestId });
        await personToSave.save();
        console.log('Request ' + requestId + ' failed');
        return error
    }
}

function renameFileIfNeededSync(requestId) {
    const dir = __dirname + `/download/${requestId}`
    fs.readdirSync(dir)
        .forEach(filename => {
            const filepath = path.resolve(dir, filename);
            if (!filepath.includes('resume.pdf')) {
                fs.renameSync(filepath, `/${dir}/resume.pdf`);
            }
        });
}

const getDataRequestHandler = async (requestId, req) => {
    const person = await Person.findOne({ requestId });

    if (person) {
        if (person.status == 'failed') {
            const { error } = person;
            return { message: 'Failed to process that request', error };
        }

        const p = person.reducedJson();
        try {
            renameFileIfNeededSync(requestId)
            p.resume = `${req.protocol}://${req.get('host')}/pdf/${requestId}/resume.pdf`;
        } catch (error) {
            p.error = 'Failed to get resume pdf';
        }
        return p;
    }

    return { message: 'Failed to find that request' };
}

export { getDataRequestHandler, scrapRequestHandler };




