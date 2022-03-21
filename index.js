'use strict';

(function (window) {

  const _Palla = {};

  _Palla.createReceiverRedirect = function ({
    flowUrl,
    successUrl,
    errorUrl,
    accessToken,
  }) {
    const token = encodeURIComponent(accessToken);
    const success = encodeURIComponent(successUrl);
    const error = encodeURIComponent(errorUrl);
    return flowUrl + '?token=' + token + '&success=' + success + '&error=' + error;
  };

  window.Palla = _Palla;

})(window);