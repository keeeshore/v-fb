/**
 * Created by balank on 8/09/2017.
 */
import { Component, ViewChildren, QueryList, ContentChildren, AfterViewInit, Input, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService} from './../ApiService';
import { ScrollerService} from './../services/ScrollerService';
import { Observable} from "rxjs";
import { Subject} from "rxjs/Subject";
import { ENV } from '../environments/environment';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

@Component({
	selector: 'auto-scroller',
	templateUrl: './scroller.html',
	providers: [ApiService, ScrollerService],
	animations: [
	    trigger('scrollerState', [
	      state('move-x', style({  })),
	      state('move-1', style({ margin: '10px 0px 0px 0px'})),
	      state('move-2', style({ margin: '20px 0px 0px 0px'})),
	      state('move-3', style({ margin: '30px 0px 0px 0px'})),
	      state('move-4', style({ margin: '40px 0px 0px 0px'})),
	      state('move-5', style({ margin: '50px 0px 0px 0px'})),
	      state('move-6', style({ margin: '60px 0px 0px 0px'})),
	      state('move-7', style({ margin: '70px 0px 0px 0px'})),
	      state('move-8', style({ margin: '80px 0px 0px 0px'})),
	      state('move-9', style({ margin: '90px 0px 0px 0px'})),
	      state('move-0', style({ margin: '0px'})),
	      state('void', style({ top: '*' })),
	      transition('* => *', animate('500ms ease-out'))
	    ])
  	]
})

export class ScrollerComponent {

	public state:string = 'closed';

	public scrollerService:ScrollerService;

	public newPosY:number = 0;

	@ViewChild('scrollerElem') elem: ElementRef;

   	constructor(apiService: ApiService, scrollerService: ScrollerService) {
		this.scrollerService = scrollerService; 
	}

	ngAfterViewInit () {
        console.log('Scroller component ngAfterViewInit >> window.innerHeight:', window.innerHeight);
        console.log('Scroller component elem.offsetTop >> :', this.elem.nativeElement.offsetTop); 

		this.scrollerService.onScrollBroadcast().subscribe(
            (startY:number) => {

            	let offsetTop:number = this.elem.nativeElement.offsetTop;
            	//console.log('Scroller component elem.offsetTop >> :', offsetTop);
            	this.newPosY =  10 - Math.round((startY/offsetTop * 100)/10);
            	
                //console.log('onScrollBroadcast>---------------------------scrollY:', startY , '-----newPosY:', this.newPosY);                
                this.state = 'move-' + this.newPosY;

            },
            (e:any) => console.log('onError: scrollerService %s', e),
            () => console.log('onCompleted scrollerService')
        );
    }

}