# Palla Web SDK

Thank you for choosing Palla! 💸

## Getting started

### Access Tokens

A partner access token is required for every function of the `palla-web-sdk`. You will need to generate this in your backend and pass it here into the SDK. To generate the token, please see the [Palla Partner Platform API docs](https://documenter.getpostman.com/view/306637/TzkyP11Z#4b19f79a-d589-4487-b6e9-f1df88f8ea09).

### Importing the Palla Web SDK

Install the palla-web-sdk using npm:

```bash
npm install palla-web-sdk
```

Import into your project:

```js
import Palla from 'palla-web-sdk';
```

## Receiver Signup Redirect
Generate your custom receiver signup link using the Palla SDK:
```js
const { redirectUrl } = Palla.createReceiverRedirect({
    flowUrl: 'https://mycompanysignup.palla.app',
    successUrl: 'https://www.partner.com/success?my-session-id=123',
    errorUrl: 'https://www.partner.com/error?my-session-id=123',
    accessToken: 'my-jwt-access-token',
    personal: true, // collect personal details (date of birth)
    paymentLink: true, // create and display payment link
});
```

Redirect the client to the generated link:

```js
window.location.replace(redirectUrl);
```

Successful flows will redirect to the success url with card details in the query string:
```js
// https://www.partner.com/success?paymentMethodId=pmt_01FYFBVRX1PVCKM007FB8CKD3G&country=US&primary=true&type=card&brand=visa&last4=0004&expMonth=02&expYear=2026
{
    "status": "200",
    "result": "success",
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
```js
// https://www.partner.com/error?status=403&result=failed
{
    "status": "403",
    "result": "failed"
}
```
User Canceled Flows Redirect to error url with a canceled result in the query string:
```js
// https://www.partner.com/error?status=499&result=canceled
{
    "status": "499",
    "result": "canceled"
}
```

## Embedable Payment IFrame

### IFrame Events
#### Structure
```
{
    id: string,
    message?: string,
    payload?: <response data>
}
```

#### Types
- "awaiting-config" => send your config
```
{ id: "awaiting-config" }
```
- "credential-error" => bad token
```
{ 
    id: "credential-error",
    message: "credential issue",
    payload: {
        status,
        statusText
    }
}
```
- "add-payment-error" => failed to add card
```
{ 
    id: "add-payment-error",
    message: "add card failed",
    payload: {
        status,
        statusText
    }
    
}
```
- "add-payment-success" => card added to user
```
{ 
    id: "add-payment-success",
    message: "add card success",
    payload: {
        "status": "200",
        "paymentMethodId": "pmt_01FYFBVRX1PVCKM007FB8CKD3G",
        "country": "US",
        "primary": "true",
        "type": "card",
        "brand": "visa",
        "last4": "0004",
        "expMonth": "02",
        "expYear": "2026"
    }
}
```

#### Examples
##### Browser
File: `index.js`
```js
(function( window, document ){

    const config = {
        copy: {
            paymentHeader: "Add Your Copy Here",
            paymentInfoText: "Add Your Copy Here"
        },
        styles: {
            paymentHeaderColor: "#FF5733"
        }
    };

    const { paymentIFrameUrl } = Palla.createAddPaymentIFrameUrl({ host, token });

    const iframe = document.createElement("iframe");

    iframe.setAttribute("src", paymentIFrameUrl);

    const sendMessage = function _sendMessage(msg: any) {

        return iframe?.contentWindow?.postMessage(msg, "*");

    };

    const messageHandler = function _messageHandler(message) {

        if ( message.origin === host ) {

            if ( message?.data?.id === "awaiting-config" ) {

                sendMessage({ id: "config", payload: config });

            } else if ( message?.data?.id === "add-payment-success" ) {

                // call cleanup
                cleanUp();

            } else if ( message?.data?.id === "add-payment-error" ) {

                // call cleanup
                cleanUp();

            } else if ( message?.data?.id === "credential-error" ) {

                // call cleanup
                cleanUp();

            }

        }

    };

    window.addEventListener("message", messageHandler);

    document.querySelector("body").appendChild(iframe);

    const cleanUp = function _cleanUp() => {

        window.removeEventListener("message", messageHandler);

        iframe.remove();

    };

})( window, document );
```