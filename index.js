'use strict';

(function (window) {

  const _Palla = {};

  _Palla.createReceiverRedirect = function ({
    flowUrl,
    successUrl,
    errorUrl,
    accessToken,
  }) {
    return `${flowUrl}?token=${encodeURIComponent(accessToken)}&success=${encodeURIComponent(successUrl)}&error=${encodeURIComponent(errorUrl)}`;
  };

  window.Palla = _Palla;

})(window);