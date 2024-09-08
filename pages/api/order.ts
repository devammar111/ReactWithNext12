// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import PaginatedContent from '../../lib/umbraco/types/paginatedContent.type';
import { UmbracoNode } from '../../lib/umbraco/types/umbracoNode.type';

export default async function handler(req: NextApiRequest, res: NextApiResponse<UmbracoNode[] | string>) {
    console.log('req', req.body[0]);
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
    }
    const response = await fetch(process.env.DATA_API_BASEURL + 'checkout/', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': process.env.UMBRACO_API_KEY + ''
        }
    });

    if (!response.ok) {
        res.status(response.status).send('Error with the fetch request');
        return;
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        res.status(500).send('Invalid JSON in response');
        return;
    }

    res.status(response.status).send(data);
}
