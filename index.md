## Face Wrekognizer Developer Documentation

### The Problem

Validating IDs against a face is not a straight forward task when trying to conduct this online for various processes like Know Your Customer, Airline Preflight Passport Validation, ID Validation for enrolling in benefits, etc.

### The Solution

An open source, cross-platform, mobile-friendly online system like this:
>https://face-wrekognizer.name/

### Basic Usage for Demo Purposes

`<iframe src="https://face-wrekognizer.name/" title="Face Wrekognizer"></iframe>`
>Apply css and styling around it however you see fit. The UI is responsive for mobile screens.
>The color theming uses Bulma.io's info, success, and danger color shades. 
>(#3298dc, #48c774, #f14668)

### Another Means of Using The System (just link to it and send your users there)
`<a href="https://face-wrekognizer.name?token=theTokenYouGetGoesHereIfYouAreJustPrototypingOmitTheToken" target="_blank">Validate ID</a>`

### An Actual Implementation

You can refer to the code snippets below or take a look at the sample index.html file here:
>https://github.com/devincheca/face-wrekognizer/blob/main/index.html

#### HTML
`<div id="faceWrekognizerDiv"></div>`

#### JS
    var currentToken = tokenManager();
    function initWrekognizer() {
      const wrekDiv = document.getElementById('faceWrekognizerDiv');
      const iframeElement = document.createElement('iframe');
      iframeElement.src = 'https://face-wrekognizer.name?token=' + currentToken().getToken();
      iframeElement.title = 'Face Wrekognizer';
      wrekDiv.appendChild(iframeElement);
    }
    async getTokenAndStart() {
      const res = await fetch('https://face-wrekognizer.name/tokens/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      currentToken().setToken(json.token);
      initWrekognizer();
    }
    function tokenManager() {
      let token = null;
      return function () {
        return {
          getToken: () => { return token; },
          setToken: (newToken) => { token = newToken; },
          checkToken: async () => {
            // note this is a one time read so tokens cannot be reused
            const res = await fetch('https://face-wrekognizer.name/tokens/checkToken', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
            const json = await res.json();
            return json;
          },
        };
      }
    }
    window.onload = getTokenAndStart;

### API Token System

The site provides a means of directing users to it and having them return after completing the process flow. The token returned from the initial API call is the same token you provide for the final API call to validate against the API that the face validation process was conducted successfully.

##### Note: The tokens are for one time use so that they cannot be used to break the system with duplicate reads. If you need to run the process flow again, just get a fresh token.

This is a public facing API with CORS enabled so feel free to implement the UI to match your site/process's look and feel. The image validation endpoint operates via a multipart/form-data HTML form upload.


#### HTML
```html
<form action="https://face-wrekognizer.name/validate/sendImg" method="post" enctype="multipart/form-data" id="photoUploadForm" name="photoUploadForm">
    <input hidden type="text" id="formToken" name="formToken" value="" />
    <input type="file" accept="image/*" capture="user" id="faceInput" name="faceInput" />
    <input type="file" accept="image/*" capture="environment" id="idInput" name="idInput" />
</form>
```

This is compliant with the PWA standard and is installable on devices with Chrome.

### A Server Side Implementation with AWS

Make sure to have the correct access permissions set in place to do this. You will need S3, and Rekognition. I did this through Hapi with nodejs but any server side stack should be able to handle this logic. If your application calls for more tailored backend processing, then the code below is a good start.

>https://github.com/devincheca/face-wrekognizer/blob/main/serverSample.js
