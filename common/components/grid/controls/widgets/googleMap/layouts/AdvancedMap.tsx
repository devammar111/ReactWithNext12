import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import styles from './AdvancedMap.module.scss';
import IntractiveMap from '@components/intractiveMap/intractiveMap';
import WidgetWrapper from '../../widgetWrapper';
import { GeocodedLocation } from '@lib/umbraco/types/geocodedLocation.type';
import tribes from '@lib/umbraco/types/tribes.type';
import { UmbracoNode } from '../../../../../../../lib/umbraco/types/umbracoNode.type';
import { useCurrentPageContext } from '../../../../../layout/layout';
import { useCollection } from '../../../../../../../lib/umbraco/util/publicDataApi';
import locations from '../../../../../../../lib/umbraco/types/locations.type';

export type AdvancedMapModel = {
    embedCode: string,
    googleMapCenter: GeocodedLocation,
    zoomLevel: number,
    isMapDraggable: boolean,
    sources?: UmbracoNode[],
    allowedTypes?: string[],
    allLabel?: string,
    allLabelIcon?: string
}

export default function AdvancedMap(model: WidgetModel) {
    const { embedCode, googleMapCenter, zoomLevel, isMapDraggable, sources, allowedTypes, allLabel,allLabelIcon } = model.content as AdvancedMapModel;
    const currentPage = useCurrentPageContext();
    const { data, error, mutate, isValidating } = useCollection(currentPage.id, 1, 0, sources?.map(source => source.id), "", allowedTypes);
    const isEmpty = data?.length === 0;
    const loadingInitData = !data && !error;
    //let locationItems = ! data as locations[];
    let locationItems;
    if (!isEmpty) {
        locationItems = data as locations[];
    }
    return (
        <WidgetWrapper model={model} styles={styles}>
            {locationItems && allLabel && allLabelIcon &&
                <div>
                    <IntractiveMap googleMapCenter={googleMapCenter}
                        zoomLevel={zoomLevel} isMapDraggable={isMapDraggable}
                        locationItems={locationItems} allLabel={allLabel} allLabelIcon={allLabelIcon}
                    />
                </div>
            }
            
        </WidgetWrapper>
    )
}