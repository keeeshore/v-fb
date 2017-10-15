/**
 * Created by balank on 8/09/2017.
 */
import { Component,  ViewChildren, QueryList, ContentChildren, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ApiService} from './../ApiService';
import { Subject, Observable} from "rxjs";
import { ENV} from '../environments/environment';
import { Location} from '@angular/common';
import { Router} from '@angular/router'

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'error-component',
	templateUrl: './error.html',
	styleUrls: ['./error.css'],
	providers: [ ApiService ]
})

export class ErrorComponent implements AfterViewInit {

	constructor(
		private apiService: ApiService, 
		private router:ActivatedRoute,
		private route:Router,
		private location:Location) {
		console.log('Exhbition component init');
	}

	private routeChanged():void {
    	var path:string = this.location.path();
    	console.log("routeChanged::::" + path);
  	}

	public ngAfterViewInit(): void {
  	}


}