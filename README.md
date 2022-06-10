permalink: /index.html
# ScribeAR

* For all other documents and references, see our Box folder. If you can't access Box with your Illinois account, go to https://cloud-dashboard.illinois.edu/cbdash/ and turn U of I Box on.
* [RampUpTest](./Readme/WalkThroughGuide.md)
* [WebUIGuide](./Readme/WebUIGuide.md)
* For all communications, see Slack.
* Replace/update this readme as necessary.

## Resources

* React: https://reactjs.org/docs/getting-started.html
* Redux: https://redux.js.org/tutorials/essentials/part-1-overview-concepts, https://daveceddia.com/redux-tutorial/ 

## Setup

Download Node.js at nodejs.org. Node comes with npm (Node Package Manager), which we will use for running code on your machine and deploying it to Github Pages. Make sure node and npm are in your `PATH` and then run `node -v` and `npm -v`.

Here are some relevant files worth knowing about. These files are present in any React repository. Most of them are initialized automatically with the command `npx create-react-app`.
* `.gitignore` lists files that won't be committed to Git. You will likely never touch any of the files listed there (except for `notes.txt`, which you may create in your local directory to keep any personal notes).
* `node_modules` handles the backend for us. This folder is huge and that’s why we don’t commit it to Git (i.e. it's listed in `.gitignore`). Don’t touch `node_modules` directly unless you know what you’re doing.
* `package.json` provides information that (a) npm uses to run the build, (b) npm uses to update our individual `node_modules` folders, and (c) shows us things like home URL and version number. JSON stands for JavaScript Object Notation and is essentially a JS-style object with key-value pairs.
     * The most important parts of this file are:
          * `dependencies`, which specifies the dependencies and version numbers we are using in our project.
          * `scripts`, which allows us to use shorthand for some common commands.
     * Note that `package.json` is committed to Git.
          * When you want to add a new dependency to the project, run `npm install <dependencyname>` and npm will automatically update `node_modules` and `package.json`.
          * When you push a commit, you will include this file with any dependencies and scripts that you added (i.e. it's not in `.gitignore`).
          * When you pull a commit, it may contain updated dependencies or scripts. This information will be stored in this file. Run `npm update` to apply these changes locally to your `node_modules`.
               * After your first time cloning the directory, you should be able to just run `npm update`, which will take a few minutes to create the `node_modules` folder, then if you run `npm start` it should load the page in a browser.
          * Essentially, `node_modules` runs a whole lot of code. But `package.json` dictates what `node_modules` should contain.
* `public` directory holds `index.html`, the home html file. It is automatically connected to `src/App.js` and you will rarely need to touch the html or anything else in `public`. `manifest.json` holds some basic information used by `index.html` and I don’t really know what it does.
     * Any external CSS libraries you want to use should be linked in the `index.html` file. (Right now there aren't any.)
     * All images should be stored in the public directory and referenced in the project as though they are in the same folder, i.e. simply as `./imgname.jpg`.
* `src` directory is where 99% of the work is done. `App.tsx`, the top overarching file, lives here. All components are stored in `src/components` and most of the code you write is somewhere in here.

When you push a commit, if the commit is ready to deploy to Github Pages, also run `npm run deploy` and the site at our URL will be updated within a couple minutes.

## Relevant Technologies

I prefer to learn through videos so most of the links I'm posting will be videos. I will also post some documentation, which is useful, but imo only as a reference, not a way to learn something new.

**ReactJS** is a JavaScript library for frontend development, but you can also think of it as a template for organizing code for a web page. You will want to become comfortable with JavaScript if you are not already.
* The core idea of React is to separate code into components. For example, on most websites, a header is a component; a sidebar is a component; buttons can be components nested in other components, and so on. This is useful because it allows us to reuse code when we need the same type of components multiple times. It also allows us to render only one component at a time, using much less overhead than re-rendering a whole site. React handles component rendering automatically to optimize it for the page. For example, the Recognition component renders multiple times per second as it gets Speech Recognition results (because we keep updating the component's `recognition` variable). We don’t want the whole page to re-render every time this happens so we split it into components.
* React uses TSX for the actual elements on the page. TSX is a version of JSX which uses Typescript instead of Javascript. While Javascript and Typescript are similar I would definitely recommend having a good grasp on the differences between the two before trying to add code to this project.
* State is generally maintained directly in components, except when a global state manager like Redux is used.
     * Data can be passed down from parent to child components through props, which are kind of like arguments or parameters passed to the child. However, data cannot be passed up from a child to a parent. This is why React is said to have a *unidirectional data flow*. One workaround is to pass a function down as a prop, which the child can call to be executed by the parent. This is done in `Options`, which passes functions to the `OnOff`, etc. components in order to reuse `OnOff` for different purposes if necessary.
     * Components can modify their own state (via the function `setState`), and they can modify their children’s props, but they can’t modify their own props.
* Here is a look at the component tree for the site so far. If you expand the `src/components` folder of the code, you’ll see the same structure. Of course, the component tree will change over time.
     ```
     ├ App
     ├─── API
     └─────── WebspeechRecognition
     ├─────── AzureRecognition
     ├─── SIDEBAR
     ├─────── Display
     ├─────── Phrase
     ├─────── SpeechToText
     ├─────── Visualization
     ├─── TOPBAR
     ├─────── PickApi
     ├─────── FullScreen
     ├─────── MenuHide
     ```

**Redux** is a JavaScript library used to store global state. It is particularly useful alongside React because it solves many of the difficulties created by React’s unidirectional data flow.
* Without a global state manager, state can only be stored in components and passed down from one component to another (recall React's unidirectional data flow). So in React alone, if you want to pass state up to a parent component, you have to declare a function in the parent component and pass it down to the child as a prop. This can get very tedious and lead to over-rendering when you have multiple levels of components. A common problem with this is prop drilling, which is when you have to pass props through many levels of components when the components in the middle have no need for the data. For example, the buttons are stored in OnOff, PlusMinus, and Record, but most of the data they control is needed across the entire page. Redux is a great tool to store state globally and avoid tedious/inefficient prop drilling.
* In the site, Redux is only used for the options buttons as described above. You can check out the redux directory to see how it’s set up. OnOff, PlusMinus, and Record set state. App and Captions use this state.
* Keep in mind that Redux cannot be used directly in React class components. As a workaround, Captions (functional component) gets global state from Redux and passes it down to Recognition (class component) as props.
* [This video](https://www.youtube.com/watch?v=CVpUuw9XSjY) is a great resource for learning Redux in conjunction with React. Everything I know about Redux came from this video, so obviously I’m still at a beginner level with it. Still, the video covers everything you need to know to understand how the site currently uses Redux for global state. Use the video to try to understand what is going on in Options and its child components. Options does not invoke Redux but it does pass functions to its children to be used by Redux.

     
## Speech Recognition

We currently use 3 API's:

**Webspeech:** is an API available through Reacts library, so it is very simple to get working. It is run asynchronously to the rest of the code and because of this, having it communicate with everything else can be a little tricky. The best way I have found to communicate with it is by using stateRef's which react offers with "React.useRef()"

**Azure:** is another API we use and is slightly more difficult to work with, as it requires a key and region authentication. It is also run asynchronously so we use "React.useRef()" to communicate with it as well. Azure is much more exciting as a lot of its capabilities are pretty cutting edge, a lot of updates we have planned involve implementing Azure features.

**StreamText:** is a website that we actually just render with an Iframe. There is almost no coding involved and because it uses an Iframe, there is also very little communication possible. Anyone looking to help with streamtext would probably need to get comfortable with XML requests.
