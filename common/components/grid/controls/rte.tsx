import { ReactNode } from "react";
import parse, { HTMLReactParserOptions, Element, domToReact } from 'html-react-parser';
import Link from "next/link";
import Image from "next/image";
import { getAbsoluteMediaUrl, getAlteredImageUrl } from "@lib/umbraco/util/helpers";

export type RteModel = {
    text: string,
    className?: string
}

export default function Rte({ text, className }: RteModel) {
    var copy = text as string;
    const options: HTMLReactParserOptions = {

        replace: domNode => {
            if (domNode instanceof Element) {
                switch (domNode.tagName) {
                    case "a":
                        var href = domNode.attribs['href'];
                        if (href?.startsWith('/')) {

                            var target = domNode.attribs['target'];
                            if (!target || target === '_self') {
                                if (domNode.children?.length === 3) {
                                    var imageNode: any = domNode.children[1];
                                    var imageSrc = imageNode.name === "img" ? imageNode["attribs"].src : '';
                                    if (imageSrc) {
                                        return (
                                            <Link href={href}>
                                                <a className={domNode.attribs['class']}>
                                                    <Image src={getAbsoluteMediaUrl(imageSrc)} height={imageNode.attribs.height} width={imageNode.attribs.width} alt={imageNode.attribs.name} />
                                                </a>
                                            </Link>
                                            
                                        )
                                    }
                                    else {
                                        return (
                                            <Link href={href}>
                                                <a className={domNode.attribs['class']}>{domToReact(domNode.children)}</a>
                                            </Link>
                                        )
                                    }
                                }
                                else {
                                    return (
                                        <Link href={href}>
                                            <a className={domNode.attribs['class']}>{domToReact(domNode.children)}</a>
                                        </Link>
                                    )
                                }
                                
                            }
                        }
                        break;
                    case "img":
                        var src = domNode.attribs.src;

                        if (src) {
                            return (
                                <Image src={getAbsoluteMediaUrl(src)} height={domNode.attribs.height} width={domNode.attribs.width} alt={domNode.attribs.name} />

                            )
                        }
                        break;
                }
            }
            return domNode;
        }
    }
    if (!copy) {
        return null;
    }
    return (
        <div className={className + " rte"}>
            {parse(copy, options)}
        </div>
    )
}