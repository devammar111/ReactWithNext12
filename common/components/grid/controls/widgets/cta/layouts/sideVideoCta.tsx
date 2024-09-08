import Rte from '@components/grid/controls/rte';
import { VideoModel } from '@lib/umbraco/types/videoModel.type';
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import LazyVideo from '@components/video/lazyVideo';
import WidgetWrapper from '../../widgetWrapper';
import styles from './sideVideoCta.module.scss';

export type SideVideoCtaModel = {
    text: string,
    video: VideoModel
}

export default function SideVideoCta(model: WidgetModel) {
    const data = model.content as SideVideoCtaModel;
    return (
        <WidgetWrapper model={model} styles={styles}>
            <div className={styles.boxContainer + ' grid-container small-padding-bottom-1 small-padding-top-1 medium-padding-bottom-2 medium-padding-top-2 large-padding-top-3 large-padding-bottom-3'}>
                <div className={styles.text}>
                    <Rte text={data.text} />
                </div>
                <div className={styles.imageContainer}>
                    <LazyVideo video={data.video} />
                </div>
            </div>
        </WidgetWrapper>
    )
}