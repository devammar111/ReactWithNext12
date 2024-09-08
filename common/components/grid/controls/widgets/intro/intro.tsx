import { useCurrentPageContext } from '@components/layout/layout';
import SocialBlock from '@components/socialBlock/socialBlock';
import LazyVideo from '@components/video/lazyVideo';
import Video from '@components/video/video';
import { VideoModel } from '@lib/umbraco/types/videoModel.type';
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import Rte from '../../rte';
import WidgetWrapper from '../widgetWrapper';
import styles from './intro.module.scss';

export type IntroModel = {
    title?: string,
    text?: string,
    video?: VideoModel,
    includeShareButtons: boolean
}

export default function Intro(model: WidgetModel) {
    const data = model.content as IntroModel;
    const page = useCurrentPageContext();

    return (
        <WidgetWrapper model={model} styles={styles}>
            <div className={styles.content + ' grid-container'}>
                {data.title &&
                    <h1 className="redUnderline capWidth">{data.title}</h1>
                }
                {data.includeShareButtons &&
                    <div className='small-margin-bottom-1 hide-for-large'>
                        <SocialBlock label='Share'></SocialBlock>
                    </div>
                }
                {data.video &&
                    <div className={styles.videoContainer + ' small-margin-top-1 medium-margin-top-2 large-margin-top-3'}>
                        <LazyVideo video={data.video} />
                    </div>
                }
                {!data.video && page.properties.videoData &&
                    <div className={styles.videoContainer + ' small-margin-top-1 medium-margin-top-2 large-margin-top-3'}>
                        <LazyVideo video={page.properties.videoData} />
                    </div>
                }
                {data.text &&
                    <Rte className={styles.text} text={data.text} />
                }
            </div>
            {data.includeShareButtons &&
                <div className={styles.socialContainer + ' hide-for-small-only hide-for-medium-only'}>
                    <SocialBlock label='Share'></SocialBlock>
                </div>
            }
        </WidgetWrapper>
    )
}