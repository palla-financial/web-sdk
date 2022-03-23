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
    ([key, val]) => `${key}=${encodeURIComponent(val)}`
  ).join('&');

  _Palla.createReceiverRedirect = function ({
    flowUrl,
    successUrl,
    errorUrl,
    accessToken,
    ...query,
  }) {
    const url = new URL(flowUrl);
    return url.origin + '?' + objectToQueryString(
      mergeCallbackQuery(url.search.substring(1), {
        ...query,
        token: accessToken,
        success: successUrl,
        error: errorUrl,
      })
    );
  };

  window.Palla = _Palla;

})(window);