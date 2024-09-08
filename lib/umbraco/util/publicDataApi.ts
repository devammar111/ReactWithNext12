import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import PaginatedContent from "../types/paginatedContent.type"
import { UmbracoNode } from "../types/umbracoNode.type";
import { Json } from "./dataApi";

const dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

const parseDates = (data: any): any => {
    if (!data) {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => {
            return parseDates(item);
        })
    }
    else if (typeof (data) === 'object') {
        var keys = Object.keys(data);
        var result: Json = {};
        keys.forEach(key => {
            result[key] = parseDates(data[key]);
        });
        return result;
    }
    else if (typeof (data) === 'string') {
        var match = dateRegex.exec(data);
        if (match) {
            return new Date(data);
        }
    }
    return data;
}

async function getCollection(data: string) {
    return fetch('/api/collection/', {
        method: 'POST',
        body: data
    })
        .then(res => {
            const json = res.json();
            return json.then(result =>
                parseDates(result) as UmbracoNode[]
            );
        });
}

export function useCollection(pageId: number, page: number, pageSize: number, sources?: number | number[], query?: string, allowedContentTypes?: string[], preview: boolean = false, culture?: string, id?: string | string[] | undefined, variant?: string, category?: string, sourcesAlias?: string | string[]) {
    const data = JSON.stringify({
        pageId,
        sources,
        query,
        page,
        pageSize,
        allowedContentTypes,
        preview,
        culture,
        id,
        variant,
        category,
        sourcesAlias
    });
    return useSWR<UmbracoNode[]>('collection-' + data, () => getCollection(data))
}

export function useCollectionInfinite(pageId: number, page: number, pageSize: number, sources?: number | number[], query?: string,
    allowedContentTypes?: string[], sortBy?: string, startDate?: Date, endDate?: Date, preview: boolean = false, culture?: string, showPrevious?: null | boolean, id?: string | string[] | undefined, featuredId?: string, sourcesAlias?: string | string[]) {
    const data = {
        pageId,
        sources,
        query,
        page,
        pageSize,
        allowedContentTypes,
        sortBy,
        startDate,
        endDate,
        preview,
        culture,
        showPrevious,
        id,
        featuredId,
        sourcesAlias
    };
    return useSWRInfinite<UmbracoNode[]>(
        (index) => {
            data.page = index + 1;
            return 'collection-' + JSON.stringify(data);
        }, () => getCollection(JSON.stringify(data))
    );
}