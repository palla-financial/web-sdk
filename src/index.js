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

const flattenKeys = (obj) => Object.assign(
  {},
  ...function _flatten(o, prefix = '') {
    return [].concat(
      ...Object.keys(o).map(
        k => {
          // this doesn't handle array values
          if (typeof o[k] === 'object') {
            return _flatten(o[k], `${prefix ? `${prefix}.` : ''}${k}`);
          } else {
            return ({ [`${prefix ? `${prefix}.` : ''}${k}`]: o[k] });
          }
        }
      )
    );
  }(obj)
);

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

const createAddPaymentIFrameUrl = function (opts) {
  const { token, host, ...rest } = opts;
  const url = new URL(host);
  const paymentIFrameUrl = (
    url.origin +
    '/e/payments' +
    '?' +
    objectToQueryString({ token, ...flattenKeys(rest) }) +
    url.hash
  );
  return { paymentIFrameUrl };
};

const createIDVIFrameUrl = function (opts) {
  const { token, host, ...rest } = opts;
  const url = new URL(host);
  const idvIFrameUrl = (
    url.origin +
    '/e/idv' +
    '?' +
    objectToQueryString({ token, ...flattenKeys(rest) }) +
    url.hash
  );
  return { idvIFrameUrl };
};

export default { createReceiverRedirect, createAddPaymentIFrameUrl, createIDVIFrameUrl };