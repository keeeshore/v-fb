/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import {Direction} from '../Enums';
import {ScrollerService} from './../services/ScrollerService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'contact-component',
	templateUrl: './contact.html',
	styleUrls: ['./contact.css'],
	providers: []
})

export class Contact {


	constructor(
		private apiService: ApiService, 
		private router: ActivatedRoute,
		private scrollerService: ScrollerService) {
		console.log('Contact us component init');
	}
	
	public ngOnInit(): void {
		console.log('Contact Component ngOnInit::');
  	}

}