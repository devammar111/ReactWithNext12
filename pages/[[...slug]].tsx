import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Grid from '../common/components/grid/grid'
import Layout from '../common/components/layout/layout'
import { IParams } from '../common/types/iparams.type'
import { GridSection } from '../lib/umbraco/types/gridSection.type'
import { PageData } from '../lib/umbraco/types/pageData.type'
import { getPage, getPages, log } from '../lib/umbraco/util/dataApi'
import styles from '../styles/Home.module.scss'
import LogLevel from '@lib/umbraco/types/logLevel.typs'

export type PageModel = {
    data: PageData,
    preview: boolean
}

const Page: NextPage<PageModel> = ({data, preview}) => {
    var bodyText = data.page.properties['bodyText'] as GridSection;
    return (
        <Layout data={data} preview={preview}>
            <Grid {...bodyText} />
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async ({params, preview = false}) => {
    const { slug } = params as IParams;
    const data = await getPage('/' + (slug?.join('/') || ''), preview);
    return {
        props: {
            data,
            preview
        },
        notFound: !data || !data.page,
        revalidate: 10
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const pages = await getPages();
    return {
        paths: pages.map(path => {
            var slug = path.split('/');
            if (slug.length > 1 && !slug[slug.length - 1]) {
                slug = slug.slice(1, slug.length - 1);
            }
            return {
                params: { slug }
            };
        }),
        fallback: 'blocking'
    }
}

export default Page
