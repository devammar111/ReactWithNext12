import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { GridSection } from "@lib/umbraco/types/gridSection.type";
import GridTabs from "./gridTabs";

export type TabItem = {
    label: string,
    text: string,
    segment: string
}

export type GridTabItem = {
    label: string,
    grid: GridSection,
    segment: string
}

export type TabsModel = {
    title?:string,
    items: TabItem[],
    gridItems?: GridTabItem[],
    cta?: string
}

export default function Tabs(model: WidgetModel) {
    const {title, items, cta} = model.content as TabsModel;
    return <GridTabs {...model} />
}