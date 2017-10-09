import { Component, ViewChildren, QueryList, ContentChildren, AfterViewInit, Input, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService} from './../ApiService';
import { Observable} from "rxjs";
import { Subject} from "rxjs/Subject";
import { Direction } from "../Enums";
import { ENV } from '../environments/environment';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';


@Component({
	selector: 'slider',
	templateUrl: './slider.html',
	styleUrls: ['./slider.css'],
	providers: [ApiService],
	animations: [
	trigger('btnState', [
	      state('show', style({ top: '0px', opacity: 1})),
	      state('hide', style({ top: '100px',  opacity: 1})),
	      transition('show => hide', animate('500ms ease-out')),
	      transition('hide => show', animate('500ms ease-out'))
	    ]),
	    trigger('directionState', [
	      state('open', style({  height: '100%', display: 'block', bottom: '0'})),
	      state('close', style({ height: '0px', display: 'none', bottom: '0'})),
	      transition('close => open', animate('500ms ease-out')),
	      transition('open => close', animate('500ms ease-out'))
	    ])
  	]
})

export class Slider {

	@Input() direction:string = Direction.UP.toString();

	@Input() id:string = '';

	public state:string = 'close';

	public btnState:string = 'hide';

	public openObserver:Observable<Direction>;

	public stateSubject:Subject<Direction> = new Subject<Direction>();

	constructor (private apiService:ApiService) {
		console.log('Slider constructor');
	}

	public _open():void {
		console.log('Slider open..');
		this.state = 'open';
	}

	public open():Observable<Direction> {
		console.log('Slider open..');
		this._open();
		this.openObserver = Observable.create((observer:Subject<Direction>) => {
		  	this.stateSubject.next(Direction.UP);
		});
		return this.openObserver;
	}

	public close():Observable<Direction> {
		console.log('Slider close..');
		this._close();
		this.openObserver = Observable.create((observer:Subject<Direction>) => {
		  	this.stateSubject.next(Direction.UP);
		});
		return this.openObserver;
	}

	public _close():void {
		console.log('Slider close..');
		this.state = 'close';
		this.btnState = 'hide';
	}

	public animationStarted(event:Event):void {
		console.log('Slider anim started..');
		if (this.state === 'close') {
			this.btnState = 'hide';
		}
	}

	public animationDone(event:Event):void {
		console.log('Slider anim done..', this.state);
		if (this.state === 'open') {
			this.btnState = 'show';
		}	
	}

	
}