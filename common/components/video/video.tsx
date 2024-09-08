import { VideoModel } from '../../../lib/umbraco/types/videoModel.type';
import Rte from '../grid/controls/rte';
import LoadingIndicator from '../loadingIndicator/loadingIndicator';
import styles from './video.module.scss';

export type VideoElementModel = {
    load: boolean,
    data: VideoModel
}

export default function Video({ load, data }: VideoElementModel) {
    var containerStyles = {
        paddingTop: (100 * data.height / data.width) + '%' 
    }

    const getAutoPlayHtml = () => {
        const html = data.html;

        const result = html.match(/src="([^"]+)"/);
        if (!result) return html;

        const originalSrc = result[1];
        let src = originalSrc;

        if (!src.match(/autoplay=1/gm)) {
            src = src.includes('?') ? src += '&autoplay=1' : src += '?autoplay=1';
        }
        
        return data.html.replace(originalSrc, src);
    }
    
    return (
        <div className={styles.video} style={containerStyles}>
            {load &&
                <Rte text={getAutoPlayHtml()} />
            }
        </div>
    )
}