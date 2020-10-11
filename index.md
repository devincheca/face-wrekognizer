## Face Wrekognizer Developer Documentation

### The Problem

Validating IDs against a face is not a straight forward task when trying to conduct this online for various processes like Know Your Customer, Airline Preflight Passport Validation, ID Validation for enrolling in benefits, etc.

### The Solution

An open source, cross-platform, mobile-friendly online system like this.
>https://face-wrekognizer.name/

### Basic Usage for Demo Purposes

`<iframe src="https://face-wrekognizer.name/" title="Face Wrekognizer"></iframe>`
>Apply css and styling around it however you see fit. The UI is responsive for mobile screens.
>The color theming uses Bulma.io's info, success, and danger color shades. 
>(#3298dc, #48c774, #f14668)

### An Actual Implementation

#### HTML
`<div id="faceWrekognizerDiv"></div>`

#### JS
    var currentToken = tokenManager();
    function initWrekognizer() {
      const wrekDiv = document.getElementById('faceWrekognizerDiv');
      const iframeElement = document.createElement('iframe');
      iframeElement.src = 'https://face-wrekognizer.name?token=' + currentToken.getToken();
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
          getToken: () => {
            return token;
          },
          setToken: (newToken) => {
            token = newToken;
          },
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

This is compliant with the PWA standard and is installable on devices with Chrome.

You can use the [editor on GitHub](https://github.com/devincheca/face-wrekognizer/edit/gh-pages/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/devincheca/face-wrekognizer/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
