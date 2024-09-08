import Rte from "@components/grid/controls/rte";
import { gsap } from "@lib/greensock/all";
import { VideoModel } from "@lib/umbraco/types/videoModel.type";
import { cloneElement, createContext, isValidElement, ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react";
import styles from './expandingVideo.module.scss';



export type ExpandingVideoThumbnailModel = {
    open: () => void,
    close: () => void
}

export function ExpandingVideoThumbnail(video: VideoModel) {
    var controller = useExpandingVideoContext();
    return (
        <div className="expandingVideoThumbnail" onClick={controller.open}>
            
            <div className="modal">
                {controller.active &&
                    <Rte text={video.html} />
                }
            </div>
        </div>
    )
}

export function ExpandingVideoTrigger(children: ReactNode[]) {
    var controller = useExpandingVideoContext();
    return children.map(child => {
        if (isValidElement(child)) {
            return cloneElement(child, { onClick: controller.open});
        }
        return child;
    })
}

export type ExpandingVideoModel = {
    video: VideoModel,
    children: ReactNode
}

export type ExpandingVideoContextModel = {
    active: boolean,
    open: () => void,
    close: () => void
}

const ExpandingVideoContext = createContext<ExpandingVideoContextModel>(undefined!);

export const useExpandingVideoContext = () => {
    return useContext(ExpandingVideoContext);
}

export default function ExpandingVideo({video, children} : ExpandingVideoModel) {
    const [open, setOpen] = useState(false);
    const [animating, setAnimating] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const contextModel = {
        active: open,
        open: () => {
            if (!animating) {
                setAnimating(true);
                setOpen(true);
                const element = container.current;
                if (element) {
                    const thumbnail = element.querySelector('.expandingVideoThumbnail');
                    const modal = element?.querySelector('.modal');
                    const modalBackdrop = element?.querySelector('.modalBackdrop');
                    if (thumbnail && modal && modalBackdrop) {
                        const tl = gsap.timeline({
                            onComplete: () => {
                                setAnimating(false);
                            }
                        });
                    }
                }
            }
        },
        close: () => {
            if (!animating) {
                const element = container.current;
                if (element) {
                    const thumbnail = element.querySelector('.expandingVideoThumbnail');
                    const modal = element?.querySelector('.modal');
                    const modalBackdrop = element?.querySelector('.modalBackdrop');
                    if (thumbnail && modal && modalBackdrop) {
                        const tl = gsap.timeline({
                            onComplete: () => {
                                setOpen(false);
                                setAnimating(false);
                            }
                        })
                            .fromTo(thumbnail)
                        ;
                    }
                }
            }
        }
    }

    useEffect(() => {
        const element = container.current;
        if (element) {
            const container = element.querySelector('.expandingVideoThumbnail');
            const modal = container?.querySelectorAll('.modal');
            const modalBackdrop = container?.querySelectorAll('.modalBackdrop');
            if (container && modal && modalBackdrop) {
                const tl = gsap.timeline({
                });
            }
        }
    })

    return (
        <ExpandingVideoContext.Provider value={contextModel}>
            <div className={styles.expandingVideo} ref={container}>
                {children}
                <div className="modalBackdrop"></div>
            </div>
        </ExpandingVideoContext.Provider>
    )
}