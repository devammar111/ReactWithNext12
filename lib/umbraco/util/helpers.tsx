import Dimensions from "../types/dimensions.type";
import { ImageModel } from "../types/imageModel.type";
import Image from "next/image";
import Nullable from "../types/nullable.type";
import variables from "../../../styles/variables.module.scss";
import ImageAlterations from "../types/imageAlterations.type";
import { NextRouter } from "next/router";
import { UmbracoNode } from "../types/umbracoNode.type";
import { ReactNode } from "react";
import dayjs from 'dayjs';
import locations from "../types/locations.type";
import tribes from "../types/tribes.type";

export function getAbsoluteMediaUrl(url: string): string {
    if (!url) {
        return '';
    }
    if (url.indexOf('//') > -1) {
        return url;
    }
    return process.env.NEXT_PUBLIC_MEDIA_DOMAIN + url;
}

export function getCropUrl(model: ImageModel, cropAlias?: string, width?: number, height?: number): string {
    if (!model) {
        return '';
    }
    var url = getAbsoluteMediaUrl(model.url);
    var queries = {
        'rnd': model.updateDate && new Date(model.updateDate).getTime()
    } as NodeJS.Dict<string | number | undefined>;
    var focalPoint = model.crops?.focalPoint;
    if (focalPoint && focalPoint.left != .5 && focalPoint.top != .5) {
        queries.xy = `${focalPoint.left},${focalPoint.top}`;
    }
    if (cropAlias) {
        var crop = model.crops.crops.find(x => x.alias.toLowerCase() === cropAlias.toLowerCase());
        if (crop) {
            if (crop.coordinates) {
                queries.cc = `${crop.coordinates.x1},${crop.coordinates.y1},${crop.coordinates.x2},${crop.coordinates.y2}`;
            }
            if (!width && !height) {
                const dimensions = getMediaDimensions(model, cropAlias, width, height);
                queries.width = dimensions?.width;
                queries.height = dimensions?.height;
            }
        }
    }

    if (width) {
        queries.width = width;
    }

    if (height) {
        queries.height = height;
    }
    var query = '';
    const queryKeys = Object.keys(queries);
    const start = url.indexOf('?') > -1 ? '&' : '?';
    queryKeys.forEach((key, index) => {
        if (queries[key]) {
            query += `${(index ? '&' : start)}${key}=${queries[key]}`;
        }
    })
    return url + query;
}

export function getAlteredImageUrl(model: ImageModel, alterations: ImageAlterations): string {
    if (!model) {
        return '';
    }
    var url = getAbsoluteMediaUrl(model.url);
    if (url.indexOf('.svg') > -1) {
        return url;
    }
    var query = '?rnd=' + model.updateDate.getTime();
    if (alterations.width) {
        query += '&width=' + alterations.width;
    }
    if (alterations.height) {
        query += '&height=' + alterations.height;
    }
    if (alterations.cropAlias) {
        var crop = model.crops.crops.find(x => x.alias.toLowerCase() === alterations.cropAlias?.toLowerCase());
        if (crop) {
            query += '&width=' + crop.width + '&height=' + crop.height;
            if (crop.coordinates) {
                query += '&rxy=' + crop.coordinates.left + ',' + crop.coordinates.top;
            }
            else if (model.crops && model.crops.focalPoint) {
                query += '&rxy=' + model.crops.focalPoint.left + ',' + model.crops.focalPoint.top;
            }
        }
    }
    else if (model.crops && model.crops.focalPoint) {
        query += '&rxy=' + model.crops.focalPoint.left + ',' + model.crops.focalPoint.top;
    }
    if (alterations.grayScale) {
        query += '&grayscale=' + alterations.grayScale;
    }
    return url + query;
}

export function GetCroppedImage(image: ImageModel, cropAlias: string, classes?: string) {
    const dimensions = getMediaDimensions(image, cropAlias);
    return (
        <Image className={classes} src={getCropUrl(image, cropAlias)} width={dimensions?.width} height={dimensions?.height} layout="responsive" alt={image.name} />
    )
}

export type AlterImageModel = {
    image: ImageModel,
    alterations: ImageAlterations,
    classes?: string
}

export function AlteredImage({ image, alterations, classes }: AlterImageModel) {
    return (
        <Image className={classes} src={getAlteredImageUrl(image, alterations)} width={image.width} height={image.height} layout="responsive" alt={image.name} />
    )
}

export function getMediaDimensions(model: ImageModel, cropAlias?: string, width?: number, height?: number): Nullable<Dimensions> {
    if (width !== undefined || height != undefined) {
        if (width === 0 && height === 0) {
            return {
                width: model.width,
                height: model.height
            }
        }
        if (!height) {
            height = model.height * ((width || 0) / model.width);
        }
        else if (!width) {
            width = model.width * (height / model.height);
        }
        return {
            width: width || 0,
            height
        };
    }
    if (cropAlias) {
        var crop = model.crops && model.crops.crops ? model.crops.crops.find(x => x.alias.toLowerCase() === cropAlias.toLowerCase()) : null;
        if (!crop) {
            return {
                width: model.width,
                height: model.height
            };
        }
        return {
            width: crop.width,
            height: crop.height
        };
    }
    return null;
}

export type ResponsiveValue<T> = {
    small?: T,
    medium?: T,
    large?: T,
    xlarge?: T,
    xxlarge?: T
}

export function GetBreakpointValue<T>(value: ResponsiveValue<T>) {
    var size = window.innerWidth;
    if (size < parseInt(variables.breakpointMedium)) {
        return value.small;
    }
    else if (size < parseInt(variables.breakpointLarge)) {
        return value.medium || value.small;
    }
    else if (size < parseInt(variables.breakpointXLarge)) {
        return value.large || value.medium || value.small;
    }
    else if (size < parseInt(variables.breakpointXXLarge)) {
        return value.xlarge || value.large || value.medium || value.small;
    }
    return value.xxlarge || value.xlarge || value.large || value.medium || value.small;
}

export function parseMagicStrings(content: string, router?: NextRouter, page?: UmbracoNode, dictionaries?: NodeJS.Dict<string>, externalData?: NodeJS.Dict<string>, referer?: string) {
    const placeholderCheck = /\[([@%#\*\$])(\w+)\]/g;
    if (!content) {
        return content;
    }

    var matches = Array.from(content.matchAll(placeholderCheck));
    for (const match of matches) {
        const type = match[1];
        const alias = match[2];
        var change = '';
        switch (type) {
            case '@':
                if (router) {
                    var queryVal = router.query[alias];
                    if (queryVal) {
                        change = Array.isArray(queryVal) ? (queryVal as string[]).join(', ') : queryVal;
                    }
                    else {
                        switch (alias.toLowerCase()) {
                            case 'remote_addr':
                                //not implemented
                                break;
                            case 'url':
                                change = process.env.NEXT_PUBLIC_HOST + router.asPath;
                                break;
                            case 'http_referer':
                                change = referer || '';
                                break;
                            case 'http_user_agent':
                                //not implemented
                                break;
                        }
                    }
                }
                break;
            //case '%':
            //    var cookie = getCookie(alias);
            //    if (cookie) {
            //        change = cookie.toString();
            //    }
            //    break;
            case '#':
                if (dictionaries) {
                    change = dictionaries[alias] || '';
                }
                break;
            case '$':
                if (page) {
                    switch (alias) {
                        case 'nodeName':
                            change = page.name;
                            break;
                        case 'pageId':
                            change = page.id + '';
                            break;
                        default:
                            change = (page.properties[alias] + '') || '';
                            break;
                    }
                }
                break;
            case '*':
                if (externalData) {
                    change = externalData[alias] || '';
                }
                break;
        }
        content = content.replaceAll(match[0], change);
    }
    const dictionaryCheck = /\#(\w+)/g;
    var matches = Array.from(content.matchAll(dictionaryCheck));
    for (const match of matches) {
        const alias = match[1];
        var change = '';
        if (dictionaries) {
            change = dictionaries[alias] || '';
        }
        if (change) {
            content = content.replaceAll(match[0], change);
        }
    }
    return content;
}

export function ToTimeSpan(seconds: number) {
    const timeInSeconds: number = seconds; // Replace with your desired number of seconds

    const time: Date = new Date(timeInSeconds * 1000); // JavaScript's Date operates in milliseconds, so we multiply by 1000
    const hours: string = String('0' + time.getUTCHours()).slice(-2);
    const minutes: string = String('0' + time.getUTCMinutes()).slice(-2);
    const secondsString: string = String('0' + time.getUTCSeconds()).slice(-2);
    const result: string = `${hours}:${minutes}:${secondsString}`;

    return result;
}
export function FormatTimeWithHoursAndMinutes(seconds: number) {
    var result = "" + (seconds % 60);
    if (seconds > 60) {
        var minutes = Math.floor(seconds / 60);
        result = (minutes % 60) + ":" + (result.length == 1 ? "0" : "") + result;
    }
    if (seconds >= 3600) {
        var hours = Math.floor(seconds / 3600);
        result = (hours % 24) + ":" + (result.length == 4 ? "0" : "") + result;
    }
    return result;
}

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r: number, g: number, b: number) {
    var a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function getContrastRatio(color1: string, color2: string) {
    if (color1.length < 6) {
        color1 = color1 + color1.replace('#', '');
    }
    if (color2.length < 6) {
        color2 = color2 + color2.replace('#', '');
    }
    const hexConverter = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const colorResult1 = hexConverter.exec(color1);
    const colorResult2 = hexConverter.exec(color2);
    var lum1 = luminance(parseInt(colorResult1![1], 16), parseInt(colorResult1![2], 16), parseInt(colorResult1![3], 16));
    var lum2 = luminance(parseInt(colorResult2![1], 16), parseInt(colorResult2![2], 16), parseInt(colorResult2![3] as string, 16));
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

export function isLowContrast(color1?: string, color2?: string) {
    if (!color1 || !color2) {
        return false;
    }
    const ratio = getContrastRatio(color1, color2);
    return ratio < 8;
}

export function groupEventsByMonthAndYear(events: UmbracoNode[]): [string, UmbracoNode[]][] {
    const groupedEvents: { [key: string]: UmbracoNode[] } = {};

    events.forEach(event => {
        const startDate = new Date(event.properties.startDate);
        const year = startDate.getUTCFullYear();
        const month = startDate.toLocaleString('default', { month: 'long' });
        event.properties.summary = truncateAtWord(event.properties.summary, 313);
        const key = `${month} ${year}`;

        if (!groupedEvents[key]) {
            groupedEvents[key] = [];
        }

        groupedEvents[key].push(event);
    });

    // Convert the object to an array of key-value pairs
    const result: [string, UmbracoNode[]][] = Object.entries(groupedEvents);

    return result;
}
export function filterLocationsByCategory(locations: locations[], category: string): locations[] {
    const filteredLocations: locations[] = [];
    if (locations) {
        if (category != "") {
            locations.forEach(location => {
                if (location.properties.categories.find(i => i.name === category) != null &&
                    location.properties.categories.find(i => i.name === category) != undefined) {
                    filteredLocations.push(location);
                }
            });
        }
        else {
            locations.forEach(location => {
                filteredLocations.push(location);
            });
        }

    }
    return filteredLocations;
}
export function searchLocationsByCategory(locations: locations[], category: string): locations[] {
    const filteredLocations: locations[] = [];
    if (locations) {
        for (let location of locations) {
            if (category && category != "") {
                if (location.name.toLowerCase().includes(category.toLowerCase())) {
                    filteredLocations.push(location);
                }
                for (let categoryObj of location?.properties?.categories) {
                    if (categoryObj.name.toLowerCase().includes(category.toLowerCase())) {
                        if (filteredLocations && filteredLocations.find(x => x.id != location.id && !x.name.toLowerCase().includes(category.toLowerCase()))) {
                            filteredLocations.push(location);
                            break;
                        }
                    }
                }
                if (location?.properties?.tribes) {
                    for (let tribeObj of location?.properties?.tribes) {
                        if (tribeObj.name.toLowerCase().includes(category.toLowerCase())) {
                            filteredLocations.push(location);
                            break;
                        }
                    }
                }
            }
            else {
                filteredLocations.push(location);
            }

        }
    }
    return filteredLocations;
}

export function filterLocationsByCategoryAndSearchTerm(locations: locations[], category: string, searchTerm: string): locations[] {
    const filteredLocations: locations[] = [];
    const finalFilteredLocations: locations[] = [];
    if (locations) {
        if (category != "") {
            locations.forEach(location => {
                if (location.properties.categories.find(i => i.name === category) != null &&
                    location.properties.categories.find(i => i.name === category) != undefined) {
                    filteredLocations.push(location);
                }
            });
        }
        else {
            locations.forEach(location => {
                filteredLocations.push(location);
            });
        }

        for (let filteredLocation of filteredLocations) {
            if (searchTerm && searchTerm != "") {
                if (filteredLocation.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    finalFilteredLocations.push(filteredLocation);
                    break;
                }
                for (let categoryObj of filteredLocation?.properties?.categories) {
                    if (categoryObj.name.toLowerCase().includes(category.toLowerCase())) {
                        finalFilteredLocations.push(filteredLocation);
                        break;
                    }
                }
                if (filteredLocation?.properties?.tribes) {
                    for (let tribeObj of filteredLocation?.properties?.tribes) {
                        if (tribeObj.name.toLowerCase().includes(category.toLowerCase())) {
                            finalFilteredLocations.push(filteredLocation);
                            break;
                        }
                    }
                }
            }
            else {
                filteredLocations.push(filteredLocation);
            }

        }

    }
    return finalFilteredLocations;
}

export function getAssociateCategoriesFromLocationsWithIcons(locations: locations[], allLabel: string, allLabelIcon: string): tribes[] {
    const filteredCategories: tribes[] = [];
    var tribeObjSeeAll = {} as tribes;
    tribeObjSeeAll.icon = allLabelIcon;
    tribeObjSeeAll.label = allLabel;
    if (locations) {
        for (let location of locations) {
            for (let categoryObj of location?.properties?.categories) {
                if (filteredCategories && !filteredCategories.some(x => x.label == categoryObj.name)) {
                    var tribeObj = {} as tribes;
                    tribeObj.icon = categoryObj.icon;
                    tribeObj.label = categoryObj.name;
                    filteredCategories.push(tribeObj);
                }
            }

        }


    }
    var allCategoriesWithIcons = filteredCategories.sort((a, b) => a.label.localeCompare(b.label));
    allCategoriesWithIcons.push(tribeObjSeeAll);

    return allCategoriesWithIcons;
}

export function getAssociateCategoriesFromLocationsWithoutIcons(locations: locations[]): string[] {
    const filteredCategories: string[] = [];
    if (locations) {
        for (let location of locations) {
            for (let categoryObj of location?.properties?.categories) {
                if (filteredCategories && filteredCategories.indexOf(categoryObj.name) < 0) {
                    filteredCategories.push(categoryObj.name);
                }
            }

        }
    }
    return filteredCategories.sort((a, b) => a.localeCompare(b));
}
export function truncateAtWord(textToTruncate: string, length?: number): string {
    if (length !== undefined) {
        const variableLength = length;
        if (textToTruncate == null || textToTruncate.length < length) {
            return textToTruncate;
        }
    }


    const iNextSpace = textToTruncate.lastIndexOf(" ", length);
    return `${textToTruncate.substring(0, iNextSpace > 0 ? iNextSpace : length).trim()}...`;
}

export function formatDateRange(startDate: Date, endDate: Date): string {
    const eventStartDate = dayjs(startDate);
    const eventEndDate = dayjs(endDate);
    const optionsFull: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    let startFormatted = startDate.toLocaleString('en-US', optionsFull);
    let endFormatted = endDate.toLocaleString('en-US', optionsTime);

    if (eventStartDate.format('MMMM') != eventEndDate.format('MMMM') ||
        eventStartDate.format('yyyy') != eventEndDate.format('yyyy') ||
        eventStartDate.format('D') != eventEndDate.format('D')) {
        endFormatted = endDate.toLocaleString('en-US', optionsFull);
        return `${startFormatted} to ${endFormatted}`
    }

    return `${startFormatted} - ${endFormatted}`;
}
