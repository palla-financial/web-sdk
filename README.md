# Palla Web SDK

Thank you for choosing Palla!

## Getting started

```js
import PallaSDK from 'palla-sdk';

const { redirect } = PallaSDK.createReceiverRedirect({
    successUrl: '',
    errorUrl: '',
    accessToken: ''
});
```
Successful flows will redirect to success with card details(id, last4, brand, expiration) in query string.
```
https://www.success.url.com/path/to/page?paymentMethodId=1234&last4=0066&brand=visa&exp=05-24
```
Failed flows will redirect to error url with error details(status code).
```
https://www.error.url.com/path/to/page?errorCode=1234
```
