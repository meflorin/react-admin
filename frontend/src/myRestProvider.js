import { stringify } from 'query-string';
import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE_MANY,
    DELETE_MANY    
} from 'react-admin';

const  apiURL = 'http://localhost:7777';

/**
 * Maps react-admin queries to my REST API
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default (type, resource, params) => {
    let url = '';
    let query = '';
    const options = {
        headers : new Headers({
            Accept: 'application/json',
        }),
    };
    switch (type) {     
        case GET_LIST: {
            const exp = params.pagination.perPage == 1000 ? 1 : 0;
            const extra = params.extra;
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            query = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([
                    (page - 1) * perPage,
                    page * perPage - 1,
                ]),
                filter: JSON.stringify(params.filter),
                exp: JSON.stringify(exp),
                extra: JSON.stringify(extra)
            };            
            url = `${apiURL}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_ONE:
            url = `${apiURL}/${resource}/${params.id}`;
            break;
        case CREATE:
            url = `${apiURL}/${resource}`;
            options.method = 'POST';
            options.body = JSON.stringify(params.data);
            break;
        case UPDATE:
            url = `${apiURL}/${resource}/${params.id}`;
            options.method = 'PUT';
            options.body = JSON.stringify(params.data);
            break;
        case UPDATE_MANY:
            query = {
                filter: JSON.stringify({ id: params.ids }),
            };
            url = `${apiURL}/${resource}?${stringify(query)}`;
            options.method = 'PATCH';
            options.body = JSON.stringify(params.data);
            break;
        case DELETE:
            url = `${apiURL}/${resource}/${params.id}`;
            options.method = 'DELETE';
            break;
        case DELETE_MANY:
            query = {
                filter: JSON.stringify({ id: params.ids }),
            };
            url = `${apiURL}/${resource}?${stringify(query)}`;
            options.method = 'DELETE';
            break;
        case GET_MANY: {
            query = {
                filter: JSON.stringify({ id: params.ids }),
            };
            url = `${apiURL}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_MANY_REFERENCE: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            let query = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([
                    (page - 1) * perPage,
                    page * perPage - 1,
                ]),
                filter: JSON.stringify({
                    ...params.filter,
                    [params.target]: params.id,
                }),
            };
            url = `${apiURL}/${resource}?${stringify(query)}`;
            break;
        }
        default:
            throw new Error(`Unsupported Data Provider request type ${type}`);
    }

    let headers;
    return fetch(url, options)
        .then(res => {
            headers = res.headers;
            return res.json();
        })
        .then(json => {
            switch (type) {
                case GET_LIST:
                case GET_MANY_REFERENCE:
                    if (!headers.has('content-range')) {
                        throw new Error(
                            'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
                        );
                    }
                    return {
                        data: json,
                        total: parseInt(
                            headers
                                .get('content-range')
                                .split('/')
                                .pop(),
                            10
                        ),
                    };
                case CREATE:
                    return { data: { ...params.data, id: json.id } };
                case DELETE_MANY:
                    return { data: json || [] };                  
                default:
                    return { data: json };
            }
        });
};