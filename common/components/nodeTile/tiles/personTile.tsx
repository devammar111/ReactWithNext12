import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { GetCroppedImage } from "@lib/umbraco/util/helpers";
import styles from './personTile.module.scss';
export default function PersonTile(model: UmbracoNode) {
    return (
        <div className={styles.personTile}>
            {GetCroppedImage(model.properties.image as ImageModel, 'portrait')}
            <h6>{model.name}</h6>
            <span>{model.properties.role +  (model.properties.title ? ' / '+ model.properties.title : '')}</span>
        </div>
    )
}