
import axios from "axios";
import { tansParams } from './utils/format'

import type {
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import type { IAuthConfig, IResponse, IConfig } from './types/index.d'

const TIME_OUT = 30000;


class Request {
  #instance: AxiosInstance;
  #authConfig: IAuthConfig;

  constructor(config: IAuthConfig) {
    this.#authConfig = config;
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

  request<T = any, R = IResponse<T>>(config: IConfig){
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
          config.headers[this.#authConfig.tokenKey || 'Authorization'] = `${this.#authConfig.tokenStart || 'Bearer '}${this.#authConfig.getToken()}`;
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

        // 二进制数据则直接返回
        if (
          response.request.responseType === 'blob' ||
          response.request.responseType === 'arraybuffer'
        ) {
          return Promise.resolve(response.data)
        }

        const { code, info } = response.data;
        if (code === 200 || info === "OK") {
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
    this.#authConfig.errorCb(response.data)
    return Promise.reject(response.data);
  }
}

export default Request;
