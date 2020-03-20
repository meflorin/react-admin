import { stringify } from 'query-string';

const { apiURL } = require ('./configuration/config');

/**
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default async (type, resource, params) => {
    let url = '';
    let query = '';
    const options = {
        headers : new Headers({
            Accept: 'application/json',
        }),
    };
    switch (type) {     
        case 'GET': {
            const extra = params.extra;
            query = {
                extra: JSON.stringify(extra)
            };            
            url = `${apiURL}/${resource}?${stringify(query)}`;
            break;
        }       
        default:
            throw new Error(`Unsupported Data Provider request type ${type}`);
    }

    const apiResponse = await fetch(url, options);
    let apiResponseData = await apiResponse.json()
    
    switch (type) {                             
        default:
        return apiResponseData;
    }  
};