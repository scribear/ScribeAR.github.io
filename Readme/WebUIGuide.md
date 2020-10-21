# Web UI Component Guide

### Currently we have made new component every time we need one, which is not effective. Now there are general components compatible for all sorts of usage. (hopefully)
### The pdf document contains detailed picture of how these components look like.

### 1.Switch

./components/Switch

![](./image/SwitchApp.png)

* usage code:

```javascript
    <Switch page={page} prev={prev_page} next={next_page} titleMap={testMap} />
```
* page: the redux state reflecting current page
* prev: function that goes to previous page
* next: function that goes to next page
* titleMap: This is an array stores the title of each page

```javascript
const testMap = [
    'p1',
    'p2',
    'p3'
];
```

### 2.ToggleButton

./components/ToggleButton

This is a button with changing state function.

Based on materialUI button and Iconbutton.

![](./image/ToggleApp.png)

Example code:

```javascript
    <ToggleButton type='Icon' className="Play" color="inherit" size="large" disabled = {(if_hide === 0)} onClick={() => dispatch(audiovis_flip())}>
        {audioVis && (if_hide !== 0) ? <PauseCircleFilledIcon className="pause" color = {play_color} /> :
            <PlayCircleFilledIcon className={styles.Adplay} color = {play_color} />}
    </ToggleButton>

    <ToggleButton color = "inherit" variant = "outlined" size = "small" onClick={() => dispatch(props.increment())}>+</ToggleButton>

```

* Currently Toggle Button is the mixed of materialUI offered button. But for future potential implementation, please use this toggle button instead of Button from materialUI
* type: 'Icon' for IconButton, otherwise for Button
* [materialUI Button Doc](https://material-ui.com/components/buttons/)

### 3.SpringPop

./components/SpringPop

The spring pop is a pop-up window on clicked

![](./image/SpringPopAppOne.png)

Example code:

```javascript

<SpringPop type='switch' state={bot_size} functionMap={funcMap_bx} imageMap={imageMap_bx} >
    Layout
</SpringPop>

<SpringPop title='Tutorial' type='display'>
    -The text size button can be used to change size of
    text shown in caption space.<br />
    -There are 3 different graph can be toggled to help
    reflex the surrounding voices by clicking forth button<br />
    -For circular graph, try to drag it around.<br />
    -To stop captioning just click switch button for Recording. Also
    click again to resume captioning.<br />
    -To memorize textsize option, click save after choosing a proper size of the text.
</SpringPop>

```
* type: 'dislay':use for display information; 'switch': use to switch states
* state: used for switch type, state to be manipulated
* functionMap: used for switch type, an array stored onToggle functions
* imageMap: used for switch type, an array stored image.
* Title: used for display type, title
* disable: false by default, true to disable the button(bool)


### CSS suggestion

Use [CSS module](https://github.com/css-modules/css-modules)

For responsive purpose, please consider display:flex model

AVOID SETTING POSITION TO ABSOLUTE  
