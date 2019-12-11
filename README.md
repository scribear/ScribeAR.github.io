# ScribeAR
Live Transcription for Augmented Reality Glasses

Clone the repository

You will need:
Nodejs: download at https://nodejs.org/en/
Node comes with npm, which you will need to start the dev server. Check that Node and npm are installed with 'node -v' and 'npm -v'
You will need the following npm dependencies:
     npx: This will set up the initial react app. Install with 'npm install -g npx'.
     gh-pages: Support for uploading a React app to GitHub Pages, which hosts our site. Install with 'npm install gh-pages --save-dev'.
     react-redux: A library used for storing global state to limit passing data through multiple components. Install with 'npm install react-redux'. See the redux folder and any file that uses react-redux for usage examples.

When everything is set up, running 'npm start' should open the page in a Chrome tab with address localhost:3000. As long as you leave the server running (don't close or sigint from the terminal), any save to a file should update the page.

Follow the instructions in the readme of this page to learn how to deploy your changes to GitHub pages: https://github.com/gitname/react-gh-pages. Once you have followed the steps, simply running 'npm run deploy' and entering your GitHub info when prompted will have the page deployed within a few minutes. The site's URL is https://classtranscribe.github.io/ScribeAR.github.io/.

For those who have never used ReactJS, it is a JavaScript tool developed by Facebook for web development, deconstructing a site in terms of its components. While it's technically a library, it can be helpful to think of it as a format or boilerplate for a site. React uses JSX, which is very similar to HTML, to render its elements. You may want to find a tutorial to explain the general ideas behind how data flows in React. This video is a good place to start: https://www.youtube.com/watch?v=sBws8MSXN7A&t=2442s (I generally prefer videos but reactjs.org also has great documentation.) Or just jump right in if that's more your speed.
