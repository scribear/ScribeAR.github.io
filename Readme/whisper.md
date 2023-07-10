# Current Implementation of Whisper

Whisper has been integrated into ScribeAR by using an iframe. The iframe is on this [link](https://github.com/scribear/v/tree/master/whisper)

In the `index.html`, please replace the next `<meta http-equiv="origin-trial">` tags content with a new registered key. (Currently the key is set to expire on Mar 7th, 2024)

## Registration steps and checks:

1. Go to [this link](https://developer.chrome.com/origintrials/#/view_trial/303992974847508481)
2. Sign in with any account
3. Give the Origin as `https://scribear.illinois.edu/`
4. Tick "Match all subdomains"
5. Agree to all the terms and conditions
6. Register
7. Copy the new key and replace it in the `index.html`
8. Wait for a few minutes for the site to be redeployed.
9. Open the [website](https://scribear.illinois.edu/v/whisper/) and check if the base model is downloading and transcribing properly.

## Steps to check if the Whisper model is running on ScribeAR

1. Open SessionStorage in the Application part of “Inspect Page”
2. Click download base model, (you will get a pop up asking to confirm download), console should show a comment. And SessionStorage variables should have been set.
3. Then click microphone off and on
4. Whisper should start transcribing

## To improve:

- Whenever listening is set to true, whisper should automatically start transcribing
- Check the accuracy of the speech model.
- Currently, after downloading the model, alert pops up to start the microphone again. Can change it to use Swal.

Possible ways of appending or loading the whisper wasm js script files into React js throws different errors. WASM threads were only running in the HTML implementation of the Whisper. We could try hosting the js files separately and loading them into the ReactJS site by using get methods.

## Some Explored methods:

- Using webassembly in react js: Have to call individual functions in wasm files, after downloading some npm wasm packages.
- Directly just enabling it to use wasm support in react? Check out [this article](https://www.telerik.com/blogs/using-webassembly-with-react) but that isn't direct, have to use wasm.
- Maybe WebAssembly plugin? [Here](https://developer.chrome.com/origintrials/#/view_trial/2948731856020832257) is a link.
- Raised issue: [GitHub issue](https://github.com/ggerganov/whisper.cpp/issues/646), Explore the possible solution.
- Blazor Webassembly writes in C#
- [whisper-node](https://github.com/ariym/whisper-node) - errors and lots of issues, and also not live transcription
- Can we embed a webpage inside a webpage? Use iframe? Yes, but needs refinement.

### Error:

`Module.instantiateWasm callback failed with error: TypeError: WebAssembly.Instance(): Argument 0 must be a WebAssembly.Module`
Same error: [GitHub issue](https://github.com/emscripten-core/emscripten/issues/16794)
NOT SOLVED!
