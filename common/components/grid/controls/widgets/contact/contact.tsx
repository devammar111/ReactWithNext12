import { useCommonDataContext } from "@components/layout/layout";
import FlexibleLink from "@components/links/flexibleLink";
import UmbracoForm from "@components/umbracoForm/umbracoForm";
import { FlexibleLinkModel } from "@lib/umbraco/types/flexibleLinkModel.type";
import { Hours } from "@lib/umbraco/types/hours.type";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import PhoneNumberModel from "@lib/umbraco/types/phoneNumberModel.type";
import UmbracoFormModel from "@lib/umbraco/types/umbracoFormModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { getAbsoluteMediaUrl, GetCroppedImage, AlteredImage, getAlteredImageUrl } from "@lib/umbraco/util/helpers";
import WidgetWrapper from "../widgetWrapper";
import styles from './contact.module.scss';

export type ContactModel = {
    sideImage: ImageModel,
    address: string,
    mapLink: FlexibleLinkModel,
    phoneNumbers: PhoneNumberModel[],
    hours: Hours[]
    form: UmbracoFormModel
}

export default function Contact(model: WidgetModel) {
    const data = model.content as ContactModel;
    return (
        <WidgetWrapper styles={styles} model={model}>
            <div className={styles.contactWrapper + ' grid-x small-up-1 medium-up-1 large-up-2'}>
                <div className={styles.background + ' ' +  styles.contentWrapper + ' cell small-padding-top-1 small-padding-bottom-1 medium-padding-top-3 medium-padding-bottom-3'} style={{backgroundImage: `url('${getAlteredImageUrl(data.sideImage, {})}')`}}>
                    <div className={styles.content + ' darkBackground'}>
                        <p className={styles.address}>{data.address}</p>
                        <FlexibleLink className="directionsLink small-margin-bottom-1 medium-margin-bottom-2" link={data.mapLink} />
                        <ul className={'no-bullet small-margin-bottom-1 medium-margin-bottom-2 ' + styles.phoneNumber}>
                            {data.phoneNumbers.map(phoneNumber => 
                                <li key={phoneNumber.label}>
                                    {phoneNumber.label}: {
                                        phoneNumber.link ? (
                                            <a href={phoneNumber.link} target="_blank">{phoneNumber.number}</a>
                                        ) : (
                                            <span>{phoneNumber.number}</span>
                                        )
                                    }
                                </li>
                            )}
                        </ul>
                        <ul className={styles.hours + " no-bullet"}>
                            {data.hours.map(set => 
                                <li key={set.description}>
                                    {set.icon &&
                                        <div className={styles.icon}>
                                            <AlteredImage image={set.icon} alterations={{height: 42}} />
                                        </div> 
                                    }
                                    <div className={styles.hourTitle}>{set.description}:</div>
                                    <p>{set.timeframe}</p>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className={styles.formWrapper + ' cell small-padding-top-1 small-padding-bottom-1 medium-padding-top-3 medium-padding-bottom-3'}>
                    <div className={styles.content}>
                        <UmbracoForm {...data.form} />
                    </div>
                </div>
            </div>
        </WidgetWrapper>
    )
}