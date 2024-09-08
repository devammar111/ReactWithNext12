// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { stdout } from 'process';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
    }
    const { id } = req.query;
    const response = await fetch(process.env.DATA_API_BASEURL + 'forms/' + id, {
        method: 'POST',
        body: req.body,
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': process.env.UMBRACO_API_KEY + ''
        }
    });
    const data = await response.text();
    res.status(response.status).send(data);
}
