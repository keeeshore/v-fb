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

	public phone:String = '';

	public email:String = '';

	public comments:String = '';

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

	    this.router.queryParams.subscribe((params:any) =>{ 
	       console.log('ngOnInit::val------------------:', params);
	       	if (!isNaN(params.id)) {
	       		console.log('ngOnInit::val------------------:Valid param id', params);
	       	}
	    });

  	}

  	public onFormSubmit(): void {
		console.log('Registration onFormSubmit::');
		let url1 = 'https://www.google.com/recaptcha/api/siteverify';
		let url = ENV.HOST_API_URL + 'registration.php';
		let data = {
			name: this.name,
			phone: this.phone,
			email: this.email,
			comments: this.comments
		}
		if (this.name && this.phone && this.email && this.comments) {

			this.apiService.post(url, data).subscribe((res:any)=>{
				console.log('post response:', res);
			});

		} else {
			console.log('all fields are mandatory')
		}
		
  	}

  	


}