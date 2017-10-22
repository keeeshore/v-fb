import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router'

import '../../../public/css/styles.css';

@Component({
  selector: 'app-component',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class AppComponent implements OnInit {

    constructor (
    	private router:ActivatedRoute,
  		private route:Router,
  		private location:Location) {
          console.log('< APP > Component ----------------- 1');
    }

    ngOnInit () {
       console.log('< APP > Component ----------------- 2');
       this.router.queryParams.subscribe((params:any) => {
	       //console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		//console.log('ngOnInit::val------------------:Valid param id', params);
	       	}
	    });
    }



}
