/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import {ApiService} from './../../ApiService';
import {AlbumCollection} from './../photos/PhotoCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";

@Component({
	selector: 'app-albums',
	templateUrl: './albums.html',
	providers: []
})

export class Albums {

	public albumCollection:AlbumCollection = new AlbumCollection();

	constructor(private apiService: ApiService) {
		console.log('Albums component init');
	}
	

}