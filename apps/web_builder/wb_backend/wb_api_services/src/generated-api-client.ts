// tslint:disable

import * as request from "superagent";
import {
    SuperAgentStatic,
    SuperAgentRequest,
    Response
} from "superagent";

export type RequestHeaders = {
    [header: string]: string;
}
export type RequestHeadersHandler = (headers: RequestHeaders) => RequestHeaders;

export type ConfigureAgentHandler = (agent: SuperAgentStatic) => SuperAgentStatic;

export type ConfigureRequestHandler = (agent: SuperAgentRequest) => SuperAgentRequest;

export type CallbackHandler = (err: any, res ? : request.Response) => void;

export type NewPageDAO = {
    'url_alias' ? : string;
    'title' ? : string;
    'metaTags' ? : string;
    'sections' ? : {};
} & {
    [key: string]: any;
};

export type NewProjectDAO = {
    'name' ? : string;
    'alias' ? : string;
    'description' ? : string;
    'thumbnail' ? : string;
} & {
    [key: string]: any;
};

export type PageDAO = {
    'id' ? : number;
    'url_alias' ? : string;
    'title' ? : string;
    'meta_tags' ? : string;
    'sections' ? : {};
    'project_id' ? : number;
} & {
    [key: string]: any;
};

export type UserDAO = {
    'userId' ? : number;
    'username' ? : string;
} & {
    [key: string]: any;
};

export type LoginResponseDAO = {
    'accessToken' ? : string;
    'refreshToken' ? : string;
    'userId' ? : number;
    'username' ? : string;
} & {
    [key: string]: any;
};

export type LoginDAO = {
    'username' ? : string;
    'password' ? : string;
} & {
    [key: string]: any;
};

export type RefreshResponseDAO = {
    'accessToken' ? : string;
    'refreshToken' ? : string;
} & {
    [key: string]: any;
};

export type RefreshDAO = {
    'refreshToken' ? : string;
} & {
    [key: string]: any;
};

export type ProjectDAO = {
    'id' ? : number;
    'name' ? : string;
    'description' ? : string;
    'created_at' ? : string;
    'updated_at' ? : string;
    'thumbnail' ? : string;
    'alias' ? : string;
} & {
    [key: string]: any;
};

export type RegisterResponseDAO = {
    'newUserId' ? : number;
    'newUsername' ? : string;
} & {
    [key: string]: any;
};

export type RegisterDAO = {
    'username' ? : string;
    'password' ? : string;
} & {
    [key: string]: any;
};

export type ImageResponseDAO = {
    'signedUrl' ? : string;
    'shortUrl' ? : string;
    'fileName' ? : string;
    'imageId' ? : number;
} & {
    [key: string]: any;
};

export type ImageDAO = {
    'fileName' ? : string;
    'fileType' ? : string;
    'signedUrl' ? : string;
} & {
    [key: string]: any;
};

export type Logger = {
    log: (line: string) => any
};

export interface ResponseWithBody < S extends number, T > extends Response {
    status: S;
    body: T;
}

export type QueryParameters = {
    [param: string]: any
};

export interface CommonRequestOptions {
    $queryParameters ? : QueryParameters;
    $domain ? : string;
    $path ? : string | ((path: string) => string);
    $retries ? : number; // number of retries; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#retrying-requests
    $timeout ? : number; // request timeout in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
    $deadline ? : number; // request deadline in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
}

/**
 * API documentation for kis-serverless service
 * @class ApiClient
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class ApiClient {

    private domain: string = "";
    private errorHandlers: CallbackHandler[] = [];
    private requestHeadersHandler ? : RequestHeadersHandler;
    private configureAgentHandler ? : ConfigureAgentHandler;
    private configureRequestHandler ? : ConfigureRequestHandler;

    constructor(domain ? : string, private logger ? : Logger) {
        if (domain) {
            this.domain = domain;
        }
    }

    getDomain() {
        return this.domain;
    }

    addErrorHandler(handler: CallbackHandler) {
        this.errorHandlers.push(handler);
    }

    setRequestHeadersHandler(handler: RequestHeadersHandler) {
        this.requestHeadersHandler = handler;
    }

    setConfigureAgentHandler(handler: ConfigureAgentHandler) {
        this.configureAgentHandler = handler;
    }

    setConfigureRequestHandler(handler: ConfigureRequestHandler) {
        this.configureRequestHandler = handler;
    }

    private request(method: string, url: string, body: any, headers: RequestHeaders, queryParameters: QueryParameters, form: any, reject: CallbackHandler, resolve: CallbackHandler, opts: CommonRequestOptions) {
        if (this.logger) {
            this.logger.log(`Call ${method} ${url}`);
        }

        const agent = this.configureAgentHandler ?
            this.configureAgentHandler(request.default) :
            request.default;

        let req = agent(method, url);
        if (this.configureRequestHandler) {
            req = this.configureRequestHandler(req);
        }

        req = req.query(queryParameters);

        if (this.requestHeadersHandler) {
            headers = this.requestHeadersHandler({
                ...headers
            });
        }

        req.set(headers);

        if (body) {
            req.send(body);

            if (typeof(body) === 'object' && !(body.constructor.name === 'Buffer')) {
                headers['content-type'] = 'application/json';
            }
        }

        if (Object.keys(form).length > 0) {
            req.type('form');
            req.send(form);
        }

        if (opts.$retries && opts.$retries > 0) {
            req.retry(opts.$retries);
        }

        if (opts.$timeout && opts.$timeout > 0 || opts.$deadline && opts.$deadline > 0) {
            req.timeout({
                deadline: opts.$deadline,
                response: opts.$timeout
            });
        }

        req.end((error, response) => {
            // an error will also be emitted for a 4xx and 5xx status code
            // the error object will then have error.status and error.response fields
            // see superagent error handling: https://github.com/visionmedia/superagent/blob/master/docs/index.md#error-handling
            if (error) {
                reject(error);
                this.errorHandlers.forEach(handler => handler(error));
            } else {
                resolve(response);
            }
        });
    }

    private convertParameterCollectionFormat < T > (param: T, collectionFormat: string | undefined): T | string {
        if (Array.isArray(param) && param.length >= 2) {
            switch (collectionFormat) {
                case "csv":
                    return param.join(",");
                case "ssv":
                    return param.join(" ");
                case "tsv":
                    return param.join("\t");
                case "pipes":
                    return param.join("|");
                default:
                    return param;
            }
        }

        return param;
    }

    postLoginURL(parameters: {
        'body': LoginDAO,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/login';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * User login
     * @method
     * @name ApiClient#postLogin
     * @param {} body - Body required in the request
     */
    postLogin(parameters: {
        'body': LoginDAO,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, LoginResponseDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/login';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postRefreshURL(parameters: {
        'body': RefreshDAO,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/refresh';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Refresh token
     * @method
     * @name ApiClient#postRefresh
     * @param {} body - Body required in the request
     */
    postRefresh(parameters: {
        'body': RefreshDAO,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, RefreshResponseDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/refresh';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postRegisterURL(parameters: {
        'body': RegisterDAO,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/register';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Register new user
     * @method
     * @name ApiClient#postRegister
     * @param {} body - Body required in the request
     */
    postRegister(parameters: {
        'body': RegisterDAO,
    } & CommonRequestOptions): Promise < ResponseWithBody < 201, RegisterResponseDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/register';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postVerifyTokenURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/verify-token';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Verify user token
     * @method
     * @name ApiClient#postVerifyToken
     */
    postVerifyToken(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, void > | ResponseWithBody < 400, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/verify-token';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postLogoutURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/logout';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Logout user
     * @method
     * @name ApiClient#postLogout
     */
    postLogout(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, void > | ResponseWithBody < 400, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/logout';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getUserByIdURL(parameters: {
        'userId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/profile/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{userId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['userId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * get-users-by-id
     * @method
     * @name ApiClient#getUserById
     * @param {string} userId - API documentation for kis-serverless service
     */
    getUserById(parameters: {
        'userId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, UserDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/profile/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{userId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['userId'],
                    ''
                ).toString())}`
            );

            if (parameters['userId'] === undefined) {
                reject(new Error('Missing required  parameter: userId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    putUpdateUserURL(parameters: {
        'userId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/profile/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{userId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['userId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * update-user
     * @method
     * @name ApiClient#putUpdateUser
     * @param {string} userId - API documentation for kis-serverless service
     */
    putUpdateUser(parameters: {
        'userId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, UserDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/profile/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{userId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['userId'],
                    ''
                ).toString())}`
            );

            if (parameters['userId'] === undefined) {
                reject(new Error('Missing required  parameter: userId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getUsersURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/users';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * get-users
     * @method
     * @name ApiClient#getUsers
     */
    getUsers(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, UserDAO > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/users';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getDeletedUsersURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/deleted-users';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * get-delete-users
     * @method
     * @name ApiClient#getDeletedUsers
     */
    getDeletedUsers(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, UserDAO > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/deleted-users';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postCreateNewProjectURL(parameters: {
        'body': NewProjectDAO,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/create-new-project';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Create a new project
     * @method
     * @name ApiClient#postCreateNewProject
     * @param {} body - Body required in the request
     */
    postCreateNewProject(parameters: {
        'body': NewProjectDAO,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ProjectDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/create-new-project';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getProjectsURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Get all projects
     * @method
     * @name ApiClient#getProjects
     */
    getProjects(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, ProjectDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 403, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getProjectDetailURL(parameters: {
        'projectId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/project-detail/{projectId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{projectId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['projectId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Get project details
     * @method
     * @name ApiClient#getProjectDetail
     * @param {string} projectId - API documentation for kis-serverless service
     */
    getProjectDetail(parameters: {
        'projectId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ProjectDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/project-detail/{projectId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{projectId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['projectId'],
                    ''
                ).toString())}`
            );

            if (parameters['projectId'] === undefined) {
                reject(new Error('Missing required  parameter: projectId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    putUpdateProjectURL(parameters: {
        'projectId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/project-detail/{projectId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{projectId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['projectId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Update project details
     * @method
     * @name ApiClient#putUpdateProject
     * @param {string} projectId - API documentation for kis-serverless service
     */
    putUpdateProject(parameters: {
        'projectId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ProjectDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/project-detail/{projectId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{projectId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['projectId'],
                    ''
                ).toString())}`
            );

            if (parameters['projectId'] === undefined) {
                reject(new Error('Missing required  parameter: projectId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getPageDetailsURL(parameters: {
        'alias': string,
        'urlAlias': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/page-detail/{alias}/{url_alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['alias'],
                        ''
                    ).toString())}`
        );

        path = path.replace(
            '{url_alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['urlAlias'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Get page details
     * @method
     * @name ApiClient#getPageDetails
     * @param {string} alias - API documentation for kis-serverless service
     * @param {string} urlAlias - API documentation for kis-serverless service
     */
    getPageDetails(parameters: {
        'alias': string,
        'urlAlias': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, PageDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/page-detail/{alias}/{url_alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['alias'],
                    ''
                ).toString())}`
            );

            if (parameters['alias'] === undefined) {
                reject(new Error('Missing required  parameter: alias'));
                return;
            }

            path = path.replace(
                '{url_alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['urlAlias'],
                    ''
                ).toString())}`
            );

            if (parameters['urlAlias'] === undefined) {
                reject(new Error('Missing required  parameter: urlAlias'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    deleteProjectURL(parameters: {
        'projectId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{projectId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{projectId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['projectId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Delete project
     * @method
     * @name ApiClient#deleteProject
     * @param {string} projectId - API documentation for kis-serverless service
     */
    deleteProject(parameters: {
        'projectId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{projectId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{projectId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['projectId'],
                    ''
                ).toString())}`
            );

            if (parameters['projectId'] === undefined) {
                reject(new Error('Missing required  parameter: projectId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postDuplicateProjectURL(parameters: {
        'projectId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{projectId}/duplicate';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{projectId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['projectId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Duplicate a project
     * @method
     * @name ApiClient#postDuplicateProject
     * @param {string} projectId - API documentation for kis-serverless service
     */
    postDuplicateProject(parameters: {
        'projectId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ProjectDAO > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{projectId}/duplicate';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{projectId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['projectId'],
                    ''
                ).toString())}`
            );

            if (parameters['projectId'] === undefined) {
                reject(new Error('Missing required  parameter: projectId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postCreateNewPageURL(parameters: {
        'body': NewPageDAO,
        'alias': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{alias}/create-new-page';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['alias'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Create a new page
     * @method
     * @name ApiClient#postCreateNewPage
     * @param {} body - Body required in the request
     * @param {string} alias - API documentation for kis-serverless service
     */
    postCreateNewPage(parameters: {
        'body': NewPageDAO,
        'alias': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, PageDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{alias}/create-new-page';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            path = path.replace(
                '{alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['alias'],
                    ''
                ).toString())}`
            );

            if (parameters['alias'] === undefined) {
                reject(new Error('Missing required  parameter: alias'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getProjectDetailsByAliasURL(parameters: {
        'alias': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects-detail/{alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['alias'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Get all projects by alias
     * @method
     * @name ApiClient#getProjectDetailsByAlias
     * @param {string} alias - API documentation for kis-serverless service
     */
    getProjectDetailsByAlias(parameters: {
        'alias': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ProjectDAO > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects-detail/{alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['alias'],
                    ''
                ).toString())}`
            );

            if (parameters['alias'] === undefined) {
                reject(new Error('Missing required  parameter: alias'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getPagesURL(parameters: {
        'alias': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/page-detail/{alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['alias'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Get all pages
     * @method
     * @name ApiClient#getPages
     * @param {string} alias - API documentation for kis-serverless service
     */
    getPages(parameters: {
        'alias': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, PageDAO > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/page-detail/{alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['alias'],
                    ''
                ).toString())}`
            );

            if (parameters['alias'] === undefined) {
                reject(new Error('Missing required  parameter: alias'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    updatePageURL(parameters: {
        'alias': string,
        'urlAlias': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{alias}/{url_alias}/update';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['alias'],
                        ''
                    ).toString())}`
        );

        path = path.replace(
            '{url_alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['urlAlias'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Update page details
     * @method
     * @name ApiClient#updatePage
     * @param {string} alias - API documentation for kis-serverless service
     * @param {string} urlAlias - API documentation for kis-serverless service
     */
    updatePage(parameters: {
        'alias': string,
        'urlAlias': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, PageDAO > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{alias}/{url_alias}/update';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['alias'],
                    ''
                ).toString())}`
            );

            if (parameters['alias'] === undefined) {
                reject(new Error('Missing required  parameter: alias'));
                return;
            }

            path = path.replace(
                '{url_alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['urlAlias'],
                    ''
                ).toString())}`
            );

            if (parameters['urlAlias'] === undefined) {
                reject(new Error('Missing required  parameter: urlAlias'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    deletePageURL(parameters: {
        'alias': string,
        'urlAlias': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{alias}/{url_alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['alias'],
                        ''
                    ).toString())}`
        );

        path = path.replace(
            '{url_alias}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['urlAlias'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Delete page
     * @method
     * @name ApiClient#deletePage
     * @param {string} alias - API documentation for kis-serverless service
     * @param {string} urlAlias - API documentation for kis-serverless service
     */
    deletePage(parameters: {
        'alias': string,
        'urlAlias': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, void > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/projects/{alias}/{url_alias}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['alias'],
                    ''
                ).toString())}`
            );

            if (parameters['alias'] === undefined) {
                reject(new Error('Missing required  parameter: alias'));
                return;
            }

            path = path.replace(
                '{url_alias}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['urlAlias'],
                    ''
                ).toString())}`
            );

            if (parameters['urlAlias'] === undefined) {
                reject(new Error('Missing required  parameter: urlAlias'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postUploadImageURL(parameters: {
        'body': ImageDAO,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/upload-image';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * upload-image
     * @method
     * @name ApiClient#postUploadImage
     * @param {} body - Body required in the request
     */
    postUploadImage(parameters: {
        'body': ImageDAO,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ImageResponseDAO > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/upload-image';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    deleteUserURL(parameters: {
        'userId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/delete-users/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{userId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['userId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Delete a user by ID
     * @method
     * @name ApiClient#deleteUser
     * @param {string} userId - API documentation for kis-serverless service
     */
    deleteUser(parameters: {
        'userId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, void > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/delete-users/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{userId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['userId'],
                    ''
                ).toString())}`
            );

            if (parameters['userId'] === undefined) {
                reject(new Error('Missing required  parameter: userId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    restoreUserURL(parameters: {
        'userId': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/restore-user/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{userId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['userId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Restore a soft-deleted user
     * @method
     * @name ApiClient#restoreUser
     * @param {string} userId - API documentation for kis-serverless service
     */
    restoreUser(parameters: {
        'userId': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, void > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 500, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/restore-user/{userId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'application/json';

            path = path.replace(
                '{userId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['userId'],
                    ''
                ).toString())}`
            );

            if (parameters['userId'] === undefined) {
                reject(new Error('Missing required  parameter: userId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

}

export default ApiClient;