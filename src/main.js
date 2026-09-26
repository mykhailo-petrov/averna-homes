import '@scss/main.scss';
import * as myFunctions from '@js/modules/functions.js';
import * as myScroll from '@js/modules/scroll/scroll.js';
import '@js/site.js';

myFunctions.initBurgerMenu();
myFunctions.initRippleEffect();
myFunctions.initTouchClass();
myFunctions.initDropdownMenu();
myFunctions.initNavMenuActivate();
myFunctions.initForms();
myFunctions.initWatcher();

import '@js/modules/popup.js';
import '@js/modules/dynamic-adapt/dynamic-adapt.js';
import { initSliders } from '@js/modules/slider.js';

myScroll.pageNavigation();

window.addEventListener('load', initSliders);
