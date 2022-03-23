'use strict';

(function (window) {

  const _Palla = {};

  // Utils

  const mergeCallbackQuery = function (queryString, query) {
    return queryString.split('&').reduce((acc, value) => {
      const [key, val] = value.split('=');
      if (!acc[key]) acc[key] = val;
      return acc;
    }, { ...query });
  };

  const objectToQueryString = obj => Object.entries(obj).map(
    function ([key, val]) { return `${key}=${encodeURIComponent(val)}`; }
  ).join('&');

  _Palla.createReceiverRedirect = function (opts) {
    const { flowUrl, accessToken, successUrl, errorUrl, ...rest } = opts;
    const url = new URL(flowUrl);
    return url.origin + url.pathname + '?' + objectToQueryString(
      mergeCallbackQuery(url.search.substring(1), {
        ...rest,
        token: accessToken,
        success: successUrl,
        error: errorUrl,
      })
    ) + url.hash;
  };

  window.Palla = _Palla;

})(window);