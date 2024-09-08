import Link from './link';
import { CSSProperties } from 'react';
import { FlexibleLinkModel } from '../../../lib/umbraco/types/flexibleLinkModel.type';

export type FlexibleLinkRenderModel = {
    link: FlexibleLinkModel,
    className?: string,
    style?: CSSProperties,
    children?: React.ReactNode
}

export default function FlexibleLink({ link, children, className, style }: FlexibleLinkRenderModel) {
    const replaceEmphasizedHelper = (labelData: React.ReactNode) => {
        if (typeof (labelData) === 'string') {
            const parts = labelData.split('**');
            return parts.map((part, index) =>
                index % 2 === 1 ? <span key={index} className="emphasize">{part}</span> : part)
        }
        return labelData;
    }
    const replaceEmphasized = (labelData: React.ReactNode) => {
        if (!labelData) {
            return null;
        }
        if (typeof (labelData) === 'string') {
            return replaceEmphasizedHelper(labelData);
        }
        else if (Array.isArray(labelData)) {
            return labelData.map(part =>
                replaceEmphasizedHelper(part)
            )
        }
        return null;
        
    }
    const label = replaceEmphasized(children || link.label);

    const isLocal = (url:string) => {
        return url.startsWith('#') || url.startsWith('/') || (url.indexOf('localhost:') > -1 || url.indexOf('.azurewebsites.net') > -1 || url.indexOf('.azurestaticapps.net') > -1 || url.indexOf('.azurefd.net') > -1 || url.indexOf('alaskanative.net') > -1)
    }

    if (link.newTab || !link.attributes['href'] || !isLocal(link.attributes['href'])) {
        return (
            <a rel="noreferrer" className={className} {...link.attributes} style={style} target="_blank">{replaceEmphasized(label)}</a>
        )
    }
    else {
        return (
            <Link href={link.attributes['href']}>
                <a className={className} style={style}>{label}</a>
            </Link>
        )
    }
}