import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import styles from './googleMap.module.scss';
import WidgetWrapper from '../../widgetWrapper';
import Rte from '@components/grid/controls/rte';

export type GoogleMapModel = {
    embedCode: string
}

export default function GoogleMap(model: WidgetModel) {
    const data = model.content as GoogleMapModel;
    return (
        <WidgetWrapper model={model} styles={styles}>
            <Rte text={data.embedCode} />
        </WidgetWrapper>
    )
}