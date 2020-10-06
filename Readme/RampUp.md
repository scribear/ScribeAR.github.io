Before you start:

Install eslint support in VS code if you are using VS code. This help
fixing coding style.

Install nodejs package manager to get start with our project

Walk through mission with the standard Reactjs.

Detail: Create a self-Introduction popup card with component.

Step 1: go to src folder, find the options folder in
components/TopSpace/Options

Create a new folder named RampUpTest and a javascript file index.js
inside.

![](media/image1.png){width="4.166146106736658in"
height="0.32287620297462816in"}

Template code for react component:

![](media/image2.png){width="4.426529965004375in"
height="3.270424321959755in"}

Then read component document about \<SpringPop\> component and import
it.

![](media/image3.png){width="3.6662084426946633in"
height="0.38536854768153983in"}

In the div, use \<SpringPop\> to display your content

![](media/image4.png){width="6.040910979877515in"
height="0.6978291776027996in"}

Usage of hooks:

useState: Official doc <https://reactjs.org/docs/hooks-state.html>

useEffect: Official doc <https://reactjs.org/docs/hooks-effect.html>

Now create a button to control whether the SpringPop works:

Use our \<ToggleButton\> component

First is to import it:

![](media/image5.png){width="4.197391732283465in"
height="0.1978915135608049in"}

Example usage

![](media/image6.png){width="6.45752624671916in"
height="1.0311209536307961in"}

![](media/image7.png){width="4.4681911636045495in"
height="0.8540594925634296in"}

Create state and handle it within handleClick function

![](media/image8.png){width="6.5in"
height="5.613194444444445in"}Complete template code

Now try to display it:

Go to Options/index.js

![](media/image9.png){width="3.572470472440945in"
height="0.21872265966754156in"}

Import your RampUpTest component

![](media/image10.png){width="6.5in" height="0.5131944444444444in"}

Put this after the instruction part, inside 'else' statement.

Now just npm start to see whats going on:

![](media/image11.png){width="4.166146106736658in"
height="0.5832600612423448in"}

Worked! But looking rough, just a few more steps for styling:

1.  Go to your rampuptest index.js file, add variant outlined to your
    ToggleButton

and change size to medium to match up with SpirngPop:

![](media/image12.png){width="6.5in" height="0.2763888888888889in"}

2.  Create index.module.css file in RampUpTest folder.

> Anything more on css module please read components document or see
> official doc online.
>
> Use div as wrapper of the component
>
> ![](media/image13.png){width="6.5in" height="3.10625in"}
>
> And modify css file with flex box model
>
> <https://www.w3schools.com/css/css3_flexbox.asp>
>
> ![](media/image14.png){width="4.8848064304461944in"
> height="2.6559175415573053in"}
>
> Css example.
>
> Now you should see a style-wise match up button pairs and
> congratulations.
>
> **Now one last thing:**
>
> This test is no need to upload to master branch of our github. You can
> upload it to your own branch or not upload at all. To prevent
> accidently upload it, you could edit .gitignore file as below:
>
> ![](media/image15.png){width="4.291129702537183in"
> height="0.6561679790026247in"}
