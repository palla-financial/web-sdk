# Palla Web SDK

Thank you for choosing Palla!

## Getting started

```js
import Palla from 'palla';
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
```
https://www.partner.com/success?paymentMethodId=abc123&last4=0066&brand=visa&exp=202405
{
    "paymentMethodId": "abc123",
    "last4": "0066",
    "brand": "visa",
    "exp": "202405"
}
```

Failed flows will redirect to the error url with a failed result in the query string:
```
https://www.partner.com/error?status=403&result=failed
{
    "status": "403",
    "result": "failed"
}
```
User Canceled Flows Redirect to error url with a canceled result in the query string:
```
https://www.partner.com/error?status=499&result=canceled
{
    "status": "499",
    "result": "canceled"
}
```
