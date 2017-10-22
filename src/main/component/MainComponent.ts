import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'main-component',
  templateUrl: './component.html'
})

export class MainComponent implements OnInit {

    constructor (
    	private router:ActivatedRoute,
		  private route:Router,
		  private location:Location) {
        console.log('< MAIN > Component ----------------- 1');
    }

    ngOnInit () {
       console.log('< MAIN > Component ----------------- 2');
    }

}
