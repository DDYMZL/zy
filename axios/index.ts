
import axios from "axios";
import { tansParams } from './utils/format'

import type {
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import type { IAuthConfig, IResponse } from './types/index.d'

type TMethod =
  | "POST"
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

const TIME_OUT = 30000;

const ERROE_CODE_MSG: { [key: number]: string } = {
  401: "无效的会话，或者会话已过期，请重新登录！",
  403: "当前操作没有权限",
  404: "访问资源不存在",
};

interface IConfig {
  url: string;
  baseURL?: string;
  method?: TMethod;
  data?: any;
  params?: any;
  headers?: any;
  timeout?: number;
}

class Request {
  #instance: AxiosInstance;
  authConfig: IAuthConfig;

  constructor(config: IAuthConfig) {
    this.authConfig = config;
    this.#instance = axios.create({
      baseURL: config.baseURL,
      timeout: TIME_OUT,
    });
    this.#interceptor();
  }

  get<T = any, R = IResponse<T>>(config: IConfig) {
    config.method = "GET";
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
    return this.#instance<unknown, R>(config);
  }

  post<T = any, R = IResponse<T>>(config: IConfig) {
    config.method = "POST";
    return this.#instance<unknown, R>(config);
  }

  put<T = any, R = IResponse<T>>(config: IConfig) {
    config.method = "PUT";
    return this.#instance<unknown, R>(config);
  }

  delete<T = any, R = IResponse<T>>(config: IConfig) {
    config.method = "DELETE";
    return this.#instance<unknown, R>(config);
  }

  getDefault<T = any, R = IResponse<T>>(config: IConfig) {
    config.method = "GET";
    const instance = axios.create({
      baseURL: "",
      timeout: TIME_OUT,
    });
    this.#interceptorDefault(instance);
    return instance<unknown, R>(config);
  }

  #interceptor() {
    this.#instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        if (!config.headers?.noToken) {
          config.headers[this.authConfig.tokenKey] = this.authConfig.tokenStart + this.authConfig.getToken();
        }
        if (config.headers?.emptyBaseURL) {
          config.baseURL = "";
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.#instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, info } = response.data;
        if (code === 200) {
          return Promise.resolve(response.data);
        } else if (info === "OK") {
          return Promise.resolve(response.data);
        } else {
          return this.#handleError(response);
        }
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  #interceptorDefault(instance: AxiosInstance) {
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { status } = response;
        if (status === 200) {
          return Promise.resolve(response.data);
        } else {
          return this.#handleError(response);
        }
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  #handleError(response: AxiosResponse) {
    const { code, data, msg } = response.data;
    const errmsg = ERROE_CODE_MSG[code] || msg;
    this.authConfig.errorCb(errmsg)
    if (code === 401) {
      this.authConfig.removeToken();
      location.href = this.authConfig.redirectUrl;
    }
    return Promise.reject(data);
  }
}

export default Request;
