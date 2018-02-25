/**
 * Created by balank on 8/09/2017.
 */
import { Component,  ViewChildren, QueryList, ContentChildren, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService} from './../ApiService';
import { ScrollerService} from './../services/ScrollerService';
import * as moment from 'moment';
import { Subject, Observable} from "rxjs";
import { ENV} from '../environments/environment';
import { Location} from '@angular/common';
import { Router} from '@angular/router'
import { State } from "../Enums";
import { PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../../admin/photos/PhotoCollection';
import { EventsCollection, EventModel} from '../../admin/events/EventsCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'registration-component',
	templateUrl: './registration.html',
	styleUrls: ['./registration.css'],
	providers: []
})

export class Registration implements AfterViewInit {

	public name:String = '';
	public nameError:String = '';

	public phone:String = '';
	public phoneError:String = '';

	public email:String = '';
	public emailError:String = '';

	public comments:String = '';
	public commentsError:String = '';

	public recaptha:String = '';
	public recapthaError:String = '';

	public eventName:String = '';

	public _ERROR_MSG:String = 'Missing Required fields';

	public _SUCCESS_MSG:String = 'SUCCESS';

	public _EVENT_NAME:String = 'General Enquiry';

	public msg:String = '';

	constructor(
		private apiService: ApiService, 
		private scrollerService: ScrollerService,
		private router:ActivatedRoute,
		private route:Router,
		private location:Location) {
		console.log('Registration component init');
	}

	private routeChanged():void {
    	var path:string = this.location.path();
    	console.log("Path:;:::" + path);
  	}

	public ngAfterViewInit(): void {
		console.log('Registration AfterViewInit::');
		document.body.style.overflowY = 'auto';
		this.apiService.insertGoogleCaptha();

	    this.router.queryParams.subscribe((params:any) =>{ 
	       console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val------------------:Valid param id', params);
	       		this.getEventById(params.id).subscribe((eventModel:EventModel)=>{
	       			this.eventName = eventModel.name || this._EVENT_NAME;
	       		});
	       	} else {
	       		this.eventName = '';
	       	}
	    });
  	}

  	public getEventById(eventId:number):Observable<any> {
  		let url = ENV.HOST_API_URL + '/events_get.php';
		return this.apiService.fetch(url).flatMap((response: any) => {
				if (response && response.events) {
					let eventModel:EventModel;
					response.events.map((eModel:EventModel)=>{
						if (eModel.id === eventId) {
							eventModel = eModel;
						}
					});
					return new Observable((observer:any) => {
						observer.next(eventModel);
					});
				}
			}
		);
  	}

  	public onFormSubmit(): void {
		console.log('Registration onFormSubmit:');
		let url_back = ENV.HOST_API_URL + 'registration.php';
		let url = 'https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/contact';
		let elem:any = document.forms[0].elements['g-recaptcha-response'];
		let error = false;
		let errors = [];
		let hasErrorClass = 'has-error';
		let mandatoryFields = ['name', 'phone', 'email', 'comments'];
		let self = this;

		this.recaptha = elem.value;
		this.msg = 'Processing...';
		
		let data = {
			name: this.name,
			phone: this.phone,
			email: this.email,
			comments: this.comments,
			recaptha: this.recaptha,
			eventName: this.eventName
		}

		mandatoryFields.forEach((fieldName, indexId)=>{
			console.log(fieldName, ':fieldName ==', self[fieldName]);
			self[fieldName + 'Error'] = '';
			if (!self[fieldName] || self[fieldName] == '') {
				console.log( fieldName, ':fieldName: has error');
				error = true;
				self[fieldName + 'Error'] = 'has-error';
			}			
		});

		if (data.email !== '') {
			if (!this.validateEmail(data.email)) {
				this.emailError = 'has-error';
				error = true;
			}
		}

		if (data.phone !== '') {
			if (!(data.phone.toString().match(/\d/g).length===10)) {
				this.phoneError = 'has-error';
				error = true;
			}
		}

		if (!error) {
			this.msg = 'In progress...';
			this.apiService.post(url, data).subscribe((res:any)=>{
				console.log('post response:', res);
				if (res && res.success) {
					this.msg = this._SUCCESS_MSG;
				} else {
					this.msg = this._ERROR_MSG;
				}
			}, (err:any) => {
				this.msg = 'Unknown error!';
			});
		} else {
			console.log('Missing or Invalid fields');
			this.msg = this._ERROR_MSG;
		}
		
  	}

  	public validateEmail(email:any) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(String(email).toLowerCase());
	}

  	


}