// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getPage } from '@lib/umbraco/util/dataApi';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{message?: string}>) {
    res.clearPreviewData();
    const slug = req.headers.referer ? req.headers.referer.replace('https://' + req.headers.host, '') : '/';
    const data = await getPage(slug + '', false);
    if (data) {
        res.redirect(data.page.url);
    }
    else {
        res.redirect('/');
    }
}
