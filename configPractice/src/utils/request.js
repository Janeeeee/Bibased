/* eslint-disable */
import 'fetch-ie8';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  501: '服务器不支持当前请求所需要的某个功能。',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

const request = {
  json(rs) {
    return rs.json();
  },

  // 通过判断当前返回的状态值，决定是返回参数还是抛出异常
  checkStatus(rs) {
    if (rs.status >= 200 && rs.status < 300) {
      return rs;
    }

    const errortext = codeMessage[rs.status] || rs.statusText;
    const error = new Error(errortext);
    error.name = rs.status;
    const errorUrl = rs.url.split('/').pop().split('?')[0];
    error.url = errorUrl;
    error.rs = rs;
    throw error;
  },

  errorThrow(error) {
    // 处理接口返回的数据格式错误的逻辑
    if (error.name) {
      notification.error({
        message: `请求错误 ${error.name}: ${error.url}`,
        description: error.message,
      });
    } else if ('stack' in error && 'message' in error) {
      const errorDes = '出现问题了，程序猿快来修复！！！';
      notification.error({
        message: `请求错误: ${error.message}`,
        description: errorDes,
      });
    }
  },

  requestWithNoBody(method, url, credentials = false) {
    const init = {
      method,
      mode: 'cors',
    };
    if (credentials) {
      init.credentials = credentials;
    }
    return fetch(url, init)
      .then(this.checkStatus)
      .then(this.json)
      .catch(this.errorThrow);
  },

  requestWithBody(method, url, body, credentials = false) {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: credentials ? 'same-origin' : 'omit',
      body: JSON.stringify(body),
    }).then(this.checkStatus)
      .then(this.json)
      .catch(this.errorThrow);
  },

  get(url, credentials) {
    return this.requestWithNoBody('GET', url, credentials);
  },

  post(url, body, credentials) {
    return this.requestWithBody('POST', url, body, credentials);
  },
};
export default request;
