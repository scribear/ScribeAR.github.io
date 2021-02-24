# My Plan on Responsive design

## 1.Overall

Currently the web page lack responsive design to adapt various resolution of devices. Therefore the basic responsive design should be as following:
 ### a. The break point set up

  THIS IS MORE IMPORTANT THAN PERCENTAGE CSS FILE DESIGN
  
  Adapt breakpoint attribute to all possible components since we are using material UI, this process should be straight forward. 

  Any information or tutorial about Material-UI breakpoint should see here [https://material-ui.com/customization/breakpoints/]. Also the corresponding web page of component you want to use breakpoint of.

  The breakpoint supports the change of layout based on several size of screen. We can mainly focus on phone screen and computer screen switch for now and tablet screen size as well.

  Usage of breakpoint is focusing on different platform adaption, but it might be limited as original web design. More thoughts of mine is in introducing react-native.

  ### b. The rem and em replacement with CSS

  Using rem or em to replace pixel in the web design. This is to synchronize differences of marging or padding in same platform devices with different screen size. (e.g. 15inch laptop and 13inch laptop). With breakpoint overall layout should be fine. This is to adjust minor visual flaws.

  ### c. The text size and layout

  Debug to make three parts of page consistent in different size of screen. Some casuing by flawed coding. Same to textsize of the page.

  This might take a long time to fix completely due to the cause might not be a CSS flaw but some other causes. The fixing process should be long and persistent.

## 2. About mobile platform

Some personal thoughts from @Jiaming Zhang:

As we all knew, the conflict between mobile display and desktop display is unavoidable sometimes. For example, Google page in phone browser is specially designed and there is a button for you to switch between mobile mode and desktop mode, where desktop mode is not as promising as mobile mode. That is why I bring React-Native again into this project. If applicable, I wish we can build a mobile mode either through react native or based on what we have right now. 

THIS IS A PROCESS AFTER 1.A AND 1.B COMPLETED 