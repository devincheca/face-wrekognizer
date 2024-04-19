export default function Disclaimer(props: { isAgreed: boolean, onAgree: () => void, onViewDemo: () => void }) {
  const { isAgreed, onAgree, onViewDemo } = props;

  return (
    <div>
      <div className="legalese notification">
        <h1 className="text-center">Welcome to the Face Wrekognizer ID Validation System</h1>
        <div className="textBody">
          <p className="py-2">Upon agreeing to the following terms you will be prompted for a current portrait photo or ("selfie") and a current photo of a form of identification. Once this process is complete and you receive a green light, you may close this tab, and return to the original site that directed you here.</p>
          <p className="font-bold">By agreeing to these terms you provide faceWrekognizer access to the images you upload for this process.</p>
          <p className="py-2">DISCLAIMER: This application is not liable for any mishandling of photographic images on behalf of AWS or any intermediary while using this product. This includes but is not limited to, your internet browser, your internet service provider, any cloud provider, or any malicious users that may intercept internet traffic while using this service. You acknowledge this application's purpose and relinquish the right to engage this applications's developers for compensation for any damages that may result from it's use. Metadata stored with the application outside of what AWS may collect includes a unique identifier valid for one-time use.</p>
          <p className="py-2">Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p className="py-2">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
          <p className="text-right py-2">Copyright 2024 faceWrekognizer</p>
        </div>
        <div className="text-center">
          { !isAgreed && <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={onAgree}>Agree</button> }
          { isAgreed && <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={onViewDemo}>View Demo</button> }
        </div>
      </div>
    </div>
  );
};
