import { Component } from '@angular/core';
import '../../../public/css/styles.css';

@Component({
  selector: 'my-app',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class AppComponent {

    constructor () {
        console.log('< my-app > Component called...');
    }

}
