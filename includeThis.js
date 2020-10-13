var currentToken = tokenManager();
function initWrekognizer() {
  const wrekDiv = document.getElementById('faceWrekognizerDiv');
  const iframeElement = document.createElement('iframe');
  iframeElement.src = 'https://face-wrekognizer.name?token=' + currentToken().getToken();
  iframeElement.id = 'iframeBox';
  iframeElement.title = 'Face Wrekognizer';
  wrekDiv.appendChild(iframeElement);
}
async function getTokenAndStart() {
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
(function() { getTokenAndStart(); }())

