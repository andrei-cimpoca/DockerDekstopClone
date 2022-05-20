import React from "react";
import AuthenticationService from "../routes/account/AuthenticationService";

export default class BackendService {
    static readonly baseUrl = document.location.port == "3000" ? "http://localhost:8081" : document.location.origin;
    static authorizationToken: string | null;

    static postJson(path: String, body: any, searchParams?: URLSearchParams): Promise<Response> {
        return this.request(
            'POST',
            path,
            searchParams,
            'application/json;charset=utf-8',
            JSON.stringify(body)
        )
            // .then(response => response.json());
    }

    static putJson(path: String, body: any, searchParams?: URLSearchParams): Promise<Response> {
        return this.request(
            'PUT',
            path,
            searchParams,
            'application/json;charset=utf-8',
            JSON.stringify(body)
        )
            // .then(response => response.json());
    }

    static delete(path: String, searchParams?: URLSearchParams): Promise<Response> {
        return this.request(
            'DELETE',
            path,
            searchParams
        )
            // .then(response => response.json());
    }

    static post(path: String, data: Map<string, string>, searchParams?: URLSearchParams): Promise<Response> {
        const bodyParams = new URLSearchParams();
        data.forEach((value, key) => bodyParams.append(key, value));

        return this.request(
            'POST',
            path,
            searchParams,
            'application/x-www-form-urlencoded',
            bodyParams.toString());
    }

    static getJson(path: String,
                   searchParams?: URLSearchParams): Promise<any> {
        return this.get(path, searchParams)
            .then(response => response.json());
    }

    static get(path: String,
               searchParams?: URLSearchParams): Promise<Response> {
        return this.request('GET', path, searchParams);
    }

    static request(method: string,
                   path: String,
                   searchParams?: URLSearchParams,
                   contentType?: string,
                   body?: string): Promise<Response> {
        const url = new URL(this.baseUrl + path);
        if (searchParams) {
            searchParams.forEach((value, key) => url.searchParams.append(key, value));
        }

        const headers: HeadersInit = {};
        if (contentType) {
            headers['Content-Type'] = contentType;
        }
        if (null != this.authorizationToken) {
            headers['Authorization'] = this.authorizationToken;
        }
        const initData: RequestInit = {
            method: method,
            headers: headers
        };

        if (body) {
            initData.body = body;
        }

        return fetch(url.toString(), initData)
            .then(response => {
                switch (response.status) {
                    case 200:
                        return new Promise<Response>((resolve) => resolve(response));
                    case 401:
                        AuthenticationService.signOut();
                        return Promise.reject(response.status);
                    default:
                        return Promise.reject(response.status);
                }
            });
    }

    static setAuthorizationToken(authorizationToken: string | null) {
        this.authorizationToken = authorizationToken;
    }
}