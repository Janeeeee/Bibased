/**
 * @method spellUrl
 * @param {string} url 传入的固定的url
 * @param {Object} params url中所带的参数
 * @description 拼写url
 */
const spellUrl = (url, params) => {
  let newUrl = url;
  if (params) {
    const paramsArray = [];
    // 拼接参数
    Object.keys(params).forEach(
      key => paramsArray.push(`${key}=${params[key]}`)
    );
    if (url && url.search(/\?/) === -1) {
      newUrl += `?${paramsArray.join('&')}`;
    } else {
      newUrl += `&${paramsArray.join('&')}`;
    }
  }
  return newUrl;
};

export default spellUrl;
