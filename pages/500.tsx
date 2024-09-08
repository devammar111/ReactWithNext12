import type { GetStaticProps, NextPage } from 'next'
import Grid from '../common/components/grid/grid'
import Layout from '../common/components/layout/layout'
import { GridSection } from '../lib/umbraco/types/gridSection.type'
import { getErrorPage } from '../lib/umbraco/util/dataApi'
import { PageModel } from './[[...slug]]'


const Error500: NextPage<PageModel> = ({data, preview}) => {
    var bodyText = data.page.properties['bodyText'] as GridSection;
    return (
        <Layout data={data} preview={preview}>
            <Grid {...bodyText} />
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async ({params, preview = false, locale}) => {
    const data = await getErrorPage(500, preview, locale);
    return {
        props: {
            data,
            preview
        },
        revalidate: 10
    }
}

export default Error500