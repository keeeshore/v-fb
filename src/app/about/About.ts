/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import {ScrollerService} from './../services/ScrollerService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';
import {CarouselComponent} from "../carousel/CarouselComponent";
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../admin/photos/PhotoCollection';
import {EventsCollection, EventModel} from '../admin/events/EventsCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'about-component',
	templateUrl: './about.html',
	styleUrls: ['./about.css'],
	providers: [ApiService]
})

export class About {


	constructor(
		private apiService: ApiService, 
		private router: ActivatedRoute,
		private scrollerService: ScrollerService) {
		console.log('About us component init');
	}

	public ngOnInit(): void {
		console.log('ngOnInit::');
  	}

}