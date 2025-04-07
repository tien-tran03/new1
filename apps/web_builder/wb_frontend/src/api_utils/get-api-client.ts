import ApiClient, { RequestHeaders } from "@kis/wb-api-services/dist/generated-api-client";
import { getBaseApiUrl } from "../config_helper";
import { sessionStorageKeys } from "../redux_logic";

export const getApiClient = () => {
    const apiClient = new ApiClient(getBaseApiUrl());
    apiClient.setRequestHeadersHandler((headers: RequestHeaders) => {
        const authHeaders = { Authorization: `Bearer ${localStorage.getItem(sessionStorageKeys.accessToken)}` };
        return { ...headers, ...authHeaders };
    });
    return apiClient;
}