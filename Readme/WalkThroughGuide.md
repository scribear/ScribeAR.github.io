## Walkthrough Taks with UI components

Create a self-Introduction popup card with component to help you better understand ui components and how to use them properly.

## Before you start:

* Install eslint support in VS code if you are using VS code. This help fixing coding style.

* Install nodejs package manager to get start with our project


## Step 1:

* Go to src folder, find the options folder in "components/TopSpace/Options" 

* Create a new folder named RampUpTest and a javascript file index.js inside.

```javascript
import React from 'react'

const RampUpTest = (props) => {
    return (
        <div>
            {
             //your content   
            }
        </div>
    )
}


```
Then import <SpringPop> component and use it in your return div

```javascript
import SpringPop from "../../../SpringPop"

//.....

<SpringPop title='your name' type='display'>
    your content
</SpringPop>

```
## Step 2:
Create a switch to disable/enable the springpop with <ToggleButton> component

* Usage of hooks:
* useState: [Official doc](https://reactjs.org/docs/hooks-state.html)
* useEffect: [Official doc](https://reactjs.org/docs/hooks-effect.html)
* Now create a button to control whether the SpringPop works with our <ToggleButton> component

```javascript
//import
import ToggleButton from '../../../ToggleButton'

//...
<ToggleButton size='medium' color='inherit' onClick={handleClick}>
    {
        //button content
    }
</ToggleButton>
```
Now to write the handleClick with hooks

```javascript
const [dis,setDis] = useState(false);
const handleClick = () => {
    //handleClick
}

```
Complete template code


```javascript
import React from 'react';
import { useState } from 'react'
import SpringPop from '../../../SpringPop'
import ToggleButton from '../../../ToggleButton'
import styles from './index.module.css'

const RampUpTest = (props) => {
    const [dis,setDis] = useState(false);
    const handleClick = () => {
       //handle onclicked
    }
    return (

       <div className={styles.wrapper}>
           <div className={styles.button}>
                <ToggleButton variant='outlined' size='medium' color='inherit' onClick={handleClick}>
                    {
                        //yourcontent 
                    }
                </ToggleButton>
           </div>

            <div className={styles.spring}>
                <SpringPop title='Your Name' type='display' disable={dis} >
                    Your content
                </SpringPop>
            </div>

        </div>
    )


}

export default RampUpTest;
```
## Step3:
Put the component into option menu 

* Go to Options/index.js
* import RampUpTest from where you located your component
* Put this after the instruction part, inside ‘else’ statement.

```javascript
import Ramp from '../Options/RampUpTest'

//...

<div className={styles.itemwrapper}>
    <Ramp />
</div>
```


## Step4:
Create style file for the component with css module.

* Create a index.module.css file inside your rampuptest folder

[CSS module official doc](https://github.com/css-modules/css-modules)

[Flex model](https://www.w3schools.com/css/css3_flexbox.asp)
```css
.wrapper{
    display: flex;
    justify-content: space-between;
}
.button {
    display: flex;
    margin-left: 10px;}
.spring {
    display: flex;
    margin-right: 10px;
}
```
Congradulations! Now you should see a complete rampup component on option menu side bar.