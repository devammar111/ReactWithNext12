import LogLevel from '@lib/umbraco/types/logLevel.type';
import SitemapEntry from '@lib/umbraco/types/sitemapEntry';
import { getRobots, log } from '@lib/umbraco/util/dataApi';
import type { GetServerSideProps, NextPage } from 'next';

export type SitemapModel = {
    sitemap: SitemapEntry[]
}

const Sitemap: NextPage<SitemapModel> = (params) => {
    return (
        <div></div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({res, req}) => {
    try {
        var host = req.headers.host;
        if (req.headers["x-forwarded-host"]) {
            host = req.headers["x-forwarded-host"]?.toString();
        }
        const robots = await getRobots(host);
        if (res) {
            res.setHeader('Content-Type', 'text/plain');
            res.write(
                `Sitemap: https://${host}/sitemap.xml
User-agent: *

Disallow: /api/
${robots.map(url => 'Disallow: ' + url).join('\n')}`
            )
            res.end();
        }
        return {
            props: {}
        }
    }
    catch (error) {
        console.log(error);
        log(JSON.stringify(error), LogLevel.Error);
        throw error;
    }
}

export default Sitemap
