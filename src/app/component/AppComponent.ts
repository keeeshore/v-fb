
import {Component,  ViewChildren, QueryList, ContentChildren, OnInit, AfterViewInit} from '@angular/core';
import { Location} from '@angular/common';
import {MainHeader} from "../header/Header";
import { Router, ActivatedRoute} from '@angular/router'

import '../../../public/css/styles.css';

@Component({
  selector: 'app-component',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class AppComponent implements OnInit {

    @ViewChildren(MainHeader) mainHeaders:QueryList<MainHeader> =  new QueryList<MainHeader>();

    constructor (
    	private router:ActivatedRoute,
  		private route:Router,
  		private location:Location) {
          console.log('< APP > Component ----------------- 1');
    }

    isMenuActive:boolean = false;

    ngOnInit () {
       console.log('< APP > Component ----------------- 2');
       this.router.queryParams.subscribe((params:any) => {
	       //console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		//console.log('ngOnInit::val------------------:Valid param id', params);
	       	}
	    });
    }

    toggleMenu ():void {
      this.isMenuActive = !this.isMenuActive;
      this.mainHeaders.first.setActive(this.isMenuActive);
    }



}
