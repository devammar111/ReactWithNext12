import Link, { LinkProps } from "next/link";

export default function ScrollLink(props: React.PropsWithChildren<LinkProps>) {
    const scroll = props.href !== undefined && typeof(props.href) === 'string' && props.href.indexOf('#') > -1;
    return <Link scroll={scroll} {...props} />
}