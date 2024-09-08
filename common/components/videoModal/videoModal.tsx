import Backdrop from "@components/backdrop/backdrop"
import Rte from "@components/grid/controls/rte"
import { VideoModel } from "@lib/umbraco/types/videoModel.type"
import { AnimatePresence, motion } from "framer-motion";
import styles from './videoModal.module.scss';

export type VideoModalModel = {
    video: VideoModel,
    open?: boolean,
    onClose: () => void,
    thumbnail?: HTMLImageElement
}

export default function VideoModal({ video, open, onClose }: VideoModalModel) {
    return (
        <>
            {open && (
                <Backdrop onClick={onClose} >
                    <AnimatePresence>
                        <div className={styles.videoBox}>
                            <motion.div layoutId={'video'} className={styles.videoModal}>
                                <div className={styles.closeContainer}>
                                    <motion.a className={styles.closeButton + ' bmg-icon bmg-icon-times'} onClick={onClose}></motion.a>
                                </div>
                                <>
                                    <motion.div className={styles.videoContainer} style={{ paddingTop: video.ratio, backgroundImage: 'url("' + video.thumbnailUrl + '")' }}>
                                        <Rte text={video.html.replace('?', '?autoplay=1&')} />
                                    </motion.div>
                                </>
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </Backdrop>
            )}
        </>
    )
}