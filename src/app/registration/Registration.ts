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

	public _ERROR_MSG:String = 'Missing Required fields';

	public _SUCCESS_MSG:String = 'Form submitted successfully!';

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
		this.apiService.insertGoogleCaptha();

	    this.router.queryParams.subscribe((params:any) =>{ 
	       console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val------------------:Valid param id', params);
	       	}
	    });
  	}

  	public onFormSubmit(): void {
		console.log('Registration onFormSubmit:');
		let url_back = ENV.HOST_API_URL + 'registration.php';
		let url = 'https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/contact';
		let elem:any = document.getElementById('g-recaptcha-response');
		let error = false;
		let errors = [];
		let hasErrorClass = 'has-error';
		let mandatoryFields = [ 'name', 'phone', 'email', 'comments'];
		let self = this;

		this.recaptha = elem.value;
		this.msg = 'Processing...';
		
		let data = {
			name: this.name,
			phone: this.phone,
			email: this.email,
			comments: this.comments,
			recaptha: this.recaptha
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

		if (!error) {
			this.msg = '';
			this.apiService.post(url, data).subscribe((res:any)=>{
				console.log('post response:', res);
				if (res && res.success) {
					this.msg = this._SUCCESS_MSG;
				} else {
					this.msg = this._ERROR_MSG;
				}
			});
		} else {
			console.log('all fields are mandatory');
			this.msg = this._ERROR_MSG;
		}
		
  	}

  	


}