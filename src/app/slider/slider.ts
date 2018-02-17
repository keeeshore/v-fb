import { OnInit, Component, ViewChildren, QueryList, ContentChildren, AfterViewInit, Input, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService} from './../ApiService';
import { Observable} from "rxjs";
import { Subject} from "rxjs/Subject";
import { State, Direction } from "../Enums";
import { ENV } from '../environments/environment';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';


@Component({
	selector: 'slider',
	templateUrl: './slider.html',
	styleUrls: ['./slider.css'],
	providers: [],
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

	public observer:Observable<State>;

	public sliderSubject:Subject<State> = new Subject<State>();

	constructor (private apiService:ApiService) {
	}

	ngOnInit ():void {
		this.observer = Observable.create((observer:Subject<State>) => {
		  	this.sliderSubject.next(State.NONE);
		});
	}

	public _open():void {
		this.state = 'open';
		document.body.style.overflowY = 'hidden';
	}

	public open():void {
		this._open();
		//this.observer = Observable.create((observer:Subject<Direction>) => {
		  	this.sliderSubject.next(State.OPEN);
		//});
		//return this.observer;
	}

	public close():void {
		this._close();
		//this.openObserver = Observable.create((observer:Subject<Direction>) => {
		  	this.sliderSubject.next(State.CLOSE);
		//});
		//return this.observer;
	}

	public _close():void {
		this.state = 'close';
		this.btnState = 'hide';
		document.body.style.overflowY = 'auto';
	}

	public animationStarted(event:Event):void {
		if (this.state === 'close') {
			this.btnState = 'hide';
		}
	}

	public animationDone(event:Event):void {
		if (this.state === 'open') {
			this.btnState = 'show';
		}	
	}
	
}