// Remove click delay
import fastclick from 'fastclick';

if(document && document.body) {
    fastclick.attach(document.body);
}

// Get Styles
import 'styles/index';

import Drone from 'core/init';
new Drone();