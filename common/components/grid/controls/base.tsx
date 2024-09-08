import UmbracoForm from "../../umbracoForm/umbracoForm"
import Rte from "./rte"
import Widget from "./widget"

export type BaseModel = {
    alias: string,
    content: any
}

export default function Base({ alias, content }: BaseModel) {
    switch (alias) {
        case "widget":
            return <Widget {...content} />
        case "rte":
            return <Rte text={content} />
        case "umbraco_form_picker":
            return <UmbracoForm {...content} />
        default:
            return null
    }
}