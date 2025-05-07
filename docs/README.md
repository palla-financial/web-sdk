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
    flowUrl: 'https://mycompanysignup.palla.app/receiver/account',
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
        waitForConfig: false,
        copy: {
            paymentHeader: "Add Your Copy Here",
            paymentInfoText: "Add Your Copy Here"
        },
        styles: {
            paymentHeaderColor: "#FF5733"
        }
    };

    const { paymentIFrameUrl } = Palla.createAddPaymentIFrameUrl({ host, token, ...config });

    const iframe = document.createElement("iframe");

    iframe.setAttribute("src", paymentIFrameUrl);

    const sendMessage = function _sendMessage(msg: any) {

        return iframe?.contentWindow?.postMessage(msg, new URL(paymentIFrameUrl).origin);

    };

    const messageHandler = function _messageHandler(message) {

        if ( message.origin === host ) {

            if ( message?.data?.id === "awaiting-config" ) {
                // this condition is not necessary if waitForConfig is set to false
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

    const cleanUp = function _cleanUp() {

        window.removeEventListener("message", messageHandler);

        iframe.remove();

    };

})( window, document );
```


## Embedable Identity Verification IFrame

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
    message: "credential issue"
}
```

- "idv-success" => idv successful
```
{ 
    id: "idv-success",
    message: "idv success",
    payload: {
        "verifications": [
            { "type": "KYC-US", "level": 2, "status": "complete" },
            { "type": "KYC-US", "level": 1, "status": "complete" }
        ],
        "upgrades": [
            { "type": "KYC-US", "level": 3, "status": "available" }
        ]
    }
}
```

- "idv-fail => idv fail
```
{
    "id": "idv-fail",
    "message": "idv fail",
    "payload": {
        "error": {
            "message": "accounts",
            "rc": 22,
            "resource": "accounts",
            "description": "resource/missing"
        }
    }
}
```

```
{
    "id": "idv-fail",
    "message": "idv fail",
    "payload": {
        "error":{
            "message": "identity data",
            "rc": 22,
            "resource": "identity",
            "description": "resource/missing"
        }
    }
}
```
```
{
    "id": "idv-fail",
    "message": "idv fail",
    "payload": {
        "error":{
            "message": "phone number",
            "rc": 22,
            "resource": "user_identifiers",
            "description": "resource/missing"
        }
    }
}
```
```
{ 
    id: "idv-fail,
    message: "idv fail",
    payload: {
        error: {
            verifications: [
                { "type": "KYC-US", "level": 2, "status": "failed" },
                { "type": "KYC-US", "level": 1, "status": "complete" }
            ],
            upgrades: [
                { "type": "KYC-US", "level": 3, "status": "available" }
            ]
        }
    }
}
```

- "idv-cancel => idv cancel
```
{ 
    id: "idv-cancel,
    message: "idv cancel"
}
```

#### Examples
##### Browser
File: `index.js`
```js
(function( window, document ){
    const config = {
        waitForConfig: false,
    };
    const { idvIFrameUrl } = Palla.createIDVIFrameUrl({ host, token, ...config });

    const iframe = document.createElement("iframe");

    iframe.setAttribute("src", idvIFrameUrl);

    const sendMessage = function _sendMessage(msg: any) {

        return iframe?.contentWindow?.postMessage(msg, new URL(idvIFrameUrl).origin);

    };

    const messageHandler = function _messageHandler(message) {

        if ( message.origin === host ) {
            
            if ( message?.data?.id === "awaiting-config" ) {
                // this condition is not necessary if waitForConfig is set to false
                sendMessage({ id: "config", payload: config });

            } else if ( message?.data?.id === "idv-success" ) {

                // call cleanup
                cleanUp();

            } else if ( message?.data?.id === "idv-fail" ) {

                // call cleanup
                cleanUp();

            } else if ( message?.data?.id === "idv-cancel" ) {

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

    const cleanUp = function _cleanUp() {

        window.removeEventListener("message", messageHandler);

        iframe.remove();

    };

})( window, document );
```

Environments
===

Sandbox Flow URL:
- `https://palla-embed-test.vercel.app`

Live Test Flow URL:
- `https://palla-embed-live-test.vercel.app`

Production Flow URL:
- `https://embed.palla.app`
