import useSWR from "swr";

export async function submitForm(formId: string, data: JSON, culture: string = '') {
    return fetch('/api/forms/' + formId + '/', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function submitUmbracoForm(formId: string, contentId: number, data: JSON, culture: string = '') {
    return fetch('/api/forms/' + formId + '/' + contentId, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}