import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router'

import '../../../public/css/styles.css';

@Component({
  selector: 'app-main',
  templateUrl: './controller.html',
  styleUrls: ['./controller.css']
})

export class AppController implements OnInit {

    constructor (
    	private router:ActivatedRoute,
		private route:Router,
		private location:Location) {
        console.log('< my-app > Component called...');
    }

    ngOnInit () {
       console.log('App Controller::::');
       this.router.queryParams.subscribe((params:any) => {
	       console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val------------------:Valid param id', params);
	       	}
	    });
    }



}
