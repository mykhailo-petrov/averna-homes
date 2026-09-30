import '@scss/main.scss';
import * as myFunctions from '@js/modules/functions.js';
import '@js/site.js';

myFunctions.initBurgerMenu();
myFunctions.initRippleEffect();
myFunctions.initTouchClass();
myFunctions.initDropdownMenu();
myFunctions.initNavMenuActivate();
myFunctions.initForms();
myFunctions.initWatcher();

import '@js/modules/dynamic-adapt/dynamic-adapt.js';
import { initSliders } from '@js/modules/slider.js';

window.addEventListener('load', initSliders);
