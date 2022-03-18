# Palla Web SDK

Thank you for choosing Palla!

## Getting started

### Access Tokens

A partner access token is required for every function of the `palla-web-sdk`. You will need to generate this in your backend and pass it here into the SDK. To generate the token, please see the [Palla Partner Platform API docs](https://documenter.getpostman.com/view/306637/TzkyP11Z#4b19f79a-d589-4487-b6e9-f1df88f8ea09).

### Importing the Palla Web SDK

```bash
npm install palla-web-sdk
```

```js
import Palla from 'palla-web-sdk';
```

## Initiating the redirect flow
Generate your custom receiver signup link using the Palla SDK:

```js
const { redirectUrl } = Palla.createReceiverRedirect({
    flowUrl: 'https://palla.app',
    successUrl: 'https://www.partner.com/success',
    errorUrl: 'https://www.partner.com/error',
    accessToken: 'my-jwt-access-token',
});
```
Redirect the client to the generated link:

```js
window.location.replace(redirectUrl);
```

Successful flows will redirect to the success url with card details in the query string:
```json
https://www.partner.com/success?paymentMethodId=pmt_01FYFBVRX1PVCKM007FB8CKD3G&country=US&primary=true&type=card&brand=visa&last4=0004&expMonth=02&expYear=2026
{
    "paymentMethodId": "pmt_01FYFBVRX1PVCKM007FB8CKD3G",
    "country": "US",
    "primary": "true",
    "type": "card",
    "brand": "visa",
    "last4": "0004",
    "expMonth": "02",
    "expYear": "2026"
}
```

Failed flows will redirect to the error url with a failed result in the query string:
```json
https://www.partner.com/error?status=403&result=failed
{
    "status": "403",
    "result": "failed"
}
```
User Canceled Flows Redirect to error url with a canceled result in the query string:
```json
https://www.partner.com/error?status=499&result=canceled
{
    "status": "499",
    "result": "canceled"
}
```
