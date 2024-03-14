import type { AxiosResponse } from 'axios';

/**
 * 用户信息
 *
 * admin 是否为管理员
 * nickName 用户昵称
 * phonenumber 手机
 * userName 用户名称
 * avatar 头像
 */
export interface IUserInfo {
  admin: boolean;
  nickName: string;
  phonenumber: string;
  userName: string;
  avatar: string;
  userId: number;
  dept: {
    deptName: string;
    deptId: number;
  } | null;
}

export interface AxiosRequestConfig {
  /** 隐藏报错提示 */
  isHideMsg?: boolean;
  /** 是否携带token */
  isToken?: boolean;
  /** 开启文件下载 */
  downloadFile?: boolean;
  /**token实效是否开启鉴权弹窗 */
  isHideAuth?: boolean;
}
/**常规带分页响应数据结构 */
export interface IResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}
/**常规带分页响应数据结构 */
export interface IResponseTable<T = any> {
  code: number;
  data: T;
  msg: string;
  // 列表独有
  rows: T[];
  total: number;
}
/**验证码独有响应 */
export interface ICaptchaResponse {
  code: number;
  msg: string;
  captchaOnOff?: boolean;
  img: string;
  uuid: string;
}
/**登录独有响应 */
export interface ILoginResponse {
  code: number;
  msg: string;
  token: string;
  jpassToken: string;
}
/**用户详情独有响应 */
export interface IUserInfoResponse {
  code: number;
  msg: string;
  permissions: any[];
  /**权限列表 */
  roles: string[];
  /**用户信息 */
  user: IUserInfo;
}
// 获取用户信息（包含岗位和角色分组）
export interface IUserProfile {
  code: number;
  msg: string;
  data: any;
  postGroup: string;
  roleGroup: string;
}

export interface IAuthConfig {
  removeToken: () => void;
  errorCb: (res: AxiosResponse) => Promise<never>;
  getToken: () => string;
  tokenStart?: string;
  tokenKey?: string;
  loginUrl?: string;
  baseURL: string;
}

type TMethod =
  | "POST"
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

export interface IConfig {
  url: string;
  baseURL?: string;
  method?: TMethod;
  data?: any;
  params?: any;
  headers?: any;
  timeout?: number;
  responseType: 
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';
}

export type TResponseType = 'arraybuffer'| 'blob'| 'document'| 'json'| 'text'| 'stream';  

import axios from '../index'
export default axios