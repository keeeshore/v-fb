/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';

@Component({
	selector: 'main-header',
	templateUrl: './header.html',
	styleUrls: ['./header.css'],
	providers: []
})

export class MainHeader {

    private toDate: string = moment().format(ENV.DATE_TIME_FORMAT);

    public imageHostPath:string = ENV.HOST_API_URL;

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		console.log('<home-header> component init');
	}

	public ngOnInit(): void {}

}