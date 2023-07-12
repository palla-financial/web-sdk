'use strict';

// Utils

const mergeCallbackQuery = function (queryString, query) {
  return queryString.split('&').reduce(
    (acc, value) => {
      if (!value) return acc;
      const [key, val] = value.split('=');
      if (key && !acc[key]) acc[key] = val;
      return acc;
    },
    { ...query }
  );
};

const objectToQueryString = (obj) =>
  Object.entries(obj)
    .map(function ([key, val]) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    })
    .join('&');

const createReceiverRedirect = function (opts) {
  const { flowUrl, accessToken, successUrl, cancelUrl, errorUrl, ...rest } = opts;
  const url = new URL(flowUrl);
  const redirectUrl = (
    url.origin +
    url.pathname +
    '?' +
    objectToQueryString(
      mergeCallbackQuery(url.search.substring(1), {
        ...rest,
        token: accessToken,
        ...(successUrl && { success: successUrl }),
        ...(errorUrl && { error: errorUrl }),
        ...(cancelUrl && { cancel: cancelUrl }),
      })
    ) +
    url.hash
  );
  return {
    redirectUrl,
    "redircetUrl": redirectUrl,
  };
};

export default { createReceiverRedirect };