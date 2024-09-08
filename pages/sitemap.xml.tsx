import SitemapEntry from '@lib/umbraco/types/sitemapEntry';
import { getSitemap } from '@lib/umbraco/util/dataApi';
import type { GetServerSideProps, NextPage } from 'next';
import dayjs from "dayjs";

export type SitemapModel = {
    sitemap: SitemapEntry[]
}

const Sitemap: NextPage<SitemapModel> = (params) => {
    return (
        <div></div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({res, req}) => {
    const sitemap = await getSitemap();
    if (res) {
        res.setHeader('Content-Type', 'text/xml');
        res.write(
            `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${sitemap.map(item => `
                    <url>
                        <loc>${item.url}</loc>
                        <lastmod>${dayjs(item.lastModified).format('YYYY-MM-DD')}</lastmod>
                        <priority>${item.priority}</priority>
                    </url>
                `).join('\n')}
            </urlset>`
        )
        res.end();
    }
    return {
        props: {}
    }
}

export default Sitemap
