# @swkj/request

## API

| 参数        | 说明                    | 类型   | 默认值        |
|-------------|-------------------------|--------|---------------|
| token       | 请求头携带的token    | string | -，必须 |
| tokenKey    | 请求头携带token的key    | string | Authorization |
| redirectUrl | token失效后重定向的地址 | string | /login        |
| baseURL     | 请求的基础IP地址        | string | -，必须             |

## Events

| 事件名      | 说明                           | 回调参数    |
|-------------|--------------------------------|-------------|
| errorCb     | 请求发生错误之后的回调函数     | msg: string |
| removeToken | token失效后移除token的回调方法 | -           |