import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'admin-component',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class AdminComponent implements OnInit {

    constructor (
    	private router:ActivatedRoute,
		  private route:Router,
		  private location:Location) {
        console.log('< AdminComponent > Component called...');
    }

    ngOnInit () {
       console.log('AdminComponent ::::');
       this.router.queryParams.subscribe((params:any) => {
	       console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val------------------:Valid param id', params);
	       	}
	    });
    }



}
