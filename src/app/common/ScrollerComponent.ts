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
	providers: [ScrollerService],
	animations: [
	    trigger('scrollerState', [
	      state('move-0', style({ margin: '0px'})),
	      state('move-1', style({ margin: '10px 0px 0px 0px'})),
	      state('move-1.1', style({ margin: '11px 0px 0px 0px'})),
	      state('move-1.2', style({ margin: '12px 0px 0px 0px'})),
	      state('move-1.3', style({ margin: '13px 0px 0px 0px'})),
	      state('move-1.4', style({ margin: '14px 0px 0px 0px'})),
	      state('move-1.5', style({ margin: '15px 0px 0px 0px'})),
	      state('move-1.6', style({ margin: '16px 0px 0px 0px'})),
	      state('move-1.7', style({ margin: '17px 0px 0px 0px'})),
	      state('move-1.8', style({ margin: '18px 0px 0px 0px'})),
	      state('move-1.9', style({ margin: '19px 0px 0px 0px'})),
	      state('move-2', style({ margin: '20px 0px 0px 0px'})),
	      state('move-2.1', style({ margin: '21px 0px 0px 0px'})),
	      state('move-2.2', style({ margin: '22px 0px 0px 0px'})),
	      state('move-2.3', style({ margin: '23px 0px 0px 0px'})),
	      state('move-2.4', style({ margin: '24px 0px 0px 0px'})),
	      state('move-2.5', style({ margin: '25px 0px 0px 0px'})),
	      state('move-2.6', style({ margin: '26px 0px 0px 0px'})),
	      state('move-2.7', style({ margin: '27px 0px 0px 0px'})),
	      state('move-2.8', style({ margin: '28px 0px 0px 0px'})),
	      state('move-2.9', style({ margin: '29px 0px 0px 0px'})),
	      state('move-3', style({ margin: '30px 0px 0px 0px'})),
	      state('move-3.1', style({ margin: '31px 0px 0px 0px'})),
	      state('move-3.2', style({ margin: '32px 0px 0px 0px'})),
	      state('move-3.3', style({ margin: '33px 0px 0px 0px'})),
	      state('move-3.4', style({ margin: '34px 0px 0px 0px'})),
	      state('move-3.5', style({ margin: '35px 0px 0px 0px'})),
	      state('move-3.6', style({ margin: '36px 0px 0px 0px'})),
	      state('move-3.7', style({ margin: '37px 0px 0px 0px'})),
	      state('move-3.8', style({ margin: '38px 0px 0px 0px'})),
	      state('move-3.9', style({ margin: '39px 0px 0px 0px'})),
	      state('move-4', style({ margin: '40px 0px 0px 0px'})),
	      state('move-4.1', style({ margin: '41px 0px 0px 0px'})),
	      state('move-4.2', style({ margin: '42px 0px 0px 0px'})),
	      state('move-4.3', style({ margin: '43px 0px 0px 0px'})),
	      state('move-4.4', style({ margin: '44px 0px 0px 0px'})),
	      state('move-4.5', style({ margin: '45px 0px 0px 0px'})),
	      state('move-4.6', style({ margin: '46px 0px 0px 0px'})),
	      state('move-4.7', style({ margin: '47px 0px 0px 0px'})),
	      state('move-4.8', style({ margin: '48px 0px 0px 0px'})),
	      state('move-4.9', style({ margin: '49px 0px 0px 0px'})),
	      state('move-5', style({ margin: '50px 0px 0px 0px'})),
	      state('move-5.1', style({ margin: '51px 0px 0px 0px'})),
	      state('move-5.2', style({ margin: '52px 0px 0px 0px'})),
	      state('move-5.3', style({ margin: '53px 0px 0px 0px'})),
	      state('move-5.4', style({ margin: '54px 0px 0px 0px'})),
	      state('move-5.5', style({ margin: '55px 0px 0px 0px'})),
	      state('move-5.6', style({ margin: '56px 0px 0px 0px'})),
	      state('move-5.7', style({ margin: '57px 0px 0px 0px'})),
	      state('move-5.8', style({ margin: '58px 0px 0px 0px'})),
	      state('move-5.9', style({ margin: '59px 0px 0px 0px'})),
	      state('move-6', style({ margin: '60px 0px 0px 0px'})),
	      state('move-6.1', style({ margin: '61px 0px 0px 0px'})),
	      state('move-6.2', style({ margin: '62px 0px 0px 0px'})),
	      state('move-6.3', style({ margin: '63px 0px 0px 0px'})),
	      state('move-6.4', style({ margin: '64px 0px 0px 0px'})),
	      state('move-6.5', style({ margin: '65px 0px 0px 0px'})),
	      state('move-6.6', style({ margin: '66px 0px 0px 0px'})),
	      state('move-6.7', style({ margin: '67px 0px 0px 0px'})),
	      state('move-6.8', style({ margin: '68px 0px 0px 0px'})),
	      state('move-6.9', style({ margin: '69px 0px 0px 0px'})),
	      state('move-7', style({ margin: '70px 0px 0px 0px'})),
	      state('move-7.1', style({ margin: '71px 0px 0px 0px'})),
	      state('move-7.2', style({ margin: '72px 0px 0px 0px'})),
	      state('move-7.3', style({ margin: '73px 0px 0px 0px'})),
	      state('move-7.4', style({ margin: '74px 0px 0px 0px'})),
	      state('move-7.5', style({ margin: '75px 0px 0px 0px'})),
	      state('move-7.6', style({ margin: '76px 0px 0px 0px'})),
	      state('move-7.7', style({ margin: '77px 0px 0px 0px'})),
	      state('move-7.8', style({ margin: '78px 0px 0px 0px'})),
	      state('move-7.9', style({ margin: '79px 0px 0px 0px'})),
	      state('move-8', style({ margin: '80px 0px 0px 0px'})),
	      state('move-8.1', style({ margin: '81px 0px 0px 0px'})),
	      state('move-8.2', style({ margin: '82px 0px 0px 0px'})),
	      state('move-8.3', style({ margin: '83px 0px 0px 0px'})),
	      state('move-8.4', style({ margin: '84px 0px 0px 0px'})),
	      state('move-8.5', style({ margin: '85px 0px 0px 0px'})),
	      state('move-8.6', style({ margin: '86px 0px 0px 0px'})),
	      state('move-8.7', style({ margin: '87px 0px 0px 0px'})),
	      state('move-8.8', style({ margin: '88px 0px 0px 0px'})),
	      state('move-8.9', style({ margin: '89px 0px 0px 0px'})),
	      state('move-9', style({ margin: '90px 0px 0px 0px'})),
	      state('move-9.1', style({ margin: '91px 0px 0px 0px'})),
	      state('move-9.2', style({ margin: '92px 0px 0px 0px'})),
	      state('move-9.3', style({ margin: '93px 0px 0px 0px'})),
	      state('move-9.4', style({ margin: '94px 0px 0px 0px'})),
	      state('move-9.5', style({ margin: '95px 0px 0px 0px'})),
	      state('move-9.6', style({ margin: '96px 0px 0px 0px'})),
	      state('move-9.7', style({ margin: '97px 0px 0px 0px'})),
	      state('move-9.8', style({ margin: '98px 0px 0px 0px'})),
	      state('move-9.9', style({ margin: '99px 0px 0px 0px'})),	      
	      state('move-9.9', style({ margin: '99px 0px 0px 0px'})),
	      state('move-10', style({ margin: '100px 0px 0px 0px'})),
	      state('void', style({ margin: '100px 0px 0px 0px'})),
	      transition('* => *', animate('500ms ease-out'))
	    ])
  	]
})

export class ScrollerComponent {

	public state:string = 'move-0';

	public scrollerService:ScrollerService;

	public newPosY:number = 0;

	public limitY:number = 5;

	@ViewChild('scrollerElem') elem: ElementRef;

   	constructor(apiService: ApiService, scrollerService: ScrollerService) {
		this.scrollerService = scrollerService; 
	}

	ngAfterViewInit () {
        //console.log('Scroller component ngAfterViewInit >> window.innerHeight:', window.innerHeight);
        //console.log('Scroller component elem.offsetTop >> :', this.elem.nativeElement.offsetTop); 

		this.scrollerService.onScrollBroadcast().subscribe(
            (startY:number) => {

            	let rect = this.elem.nativeElement.getBoundingClientRect();
				//console.log('rect.top ->', rect.top);

            	//let offsetTop:number = this.elem.nativeElement.offsetTop;
            	let offsetTop:number = rect.top;
            	//console.log('Scroller:rect.top/window.innerHeight>> ', rect.top, '/',window.innerHeight);
            	//this.newPosY =  10 - Math.round((startY/rect.top * 100)/10);
            	this.newPosY =  Math.round((rect.top/(window.innerHeight) * 100))/10;
            	//console.log('onScrollBroadcast>---- -----newPosY-', this.newPosY);

            	if (!isNaN(this.newPosY)) {
            		if (this.newPosY >= 10) {
						this.newPosY = 10;
            		} else if (this.newPosY <= 5) {
        				this.newPosY = 0;
            		} 
            		this.state = 'move-' + this.newPosY;
            		            	
            	} else {
            		//console.log('onScrollBroadcast>---------------------------isNaN:'); 
            	}

            },
            (e:any) => console.log('onError: scrollerService %s', e),
            () => console.log('onCompleted scrollerService')
        );
    }

}