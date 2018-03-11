/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, ContentChildren, OnInit, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location} from '@angular/common';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import {Slider} from './../slider/Slider';
import {Direction} from '../Enums';
import {ScrollerService} from './../services/ScrollerService';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';
import {CarouselComponent} from "../carousel/CarouselComponent";
import {DialogComponent} from "../dialog/DialogComponent";
import {AlbumComponent} from "../album/AlbumComponent";
import { State } from "../Enums";
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from '../../admin/photos/PhotoCollection';
import { CarouselItem } from '../carousel/CarouselItem';
import {EventsCollection, EventModel} from '../../admin/events/EventsCollection';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
	selector: 'press-component',
	templateUrl: './press.html',
	styleUrls: ['./press.css'],
	providers: []
})

export class Press {

	@ViewChildren(DialogComponent) dialogComponents:QueryList<DialogComponent> =  new QueryList<DialogComponent>();

	public albumCollection:AlbumCollection = new AlbumCollection();

	public selectedAlbum:AlbumModel;

	public selectedPhoto:PhotoModel = new PhotoModel({});

	public albumPhotos:Array<PhotoModel> = new Array<PhotoModel>();

	public photoIndexId:number = 0;

	public albumId:number = 808322362620389;

	public imageHostPath:string = ENV.HOST_URL;

	constructor(
		private apiService: ApiService, 
		private router: ActivatedRoute,
		private scrollerService: ScrollerService,
		private route:Router,
		private location:Location) {
		console.log('Gallery component init');
	}

	public ngOnInit(): void {
		console.log('Gallery Component ngOnInit::');
  	}

  	public ngAfterViewInit(): void {
		console.log('void AfterViewInit::');		

		this.selectedAlbum = this.albumCollection.albums.filter((albumModel:AlbumModel, indexId:number) => {
			return parseInt(albumModel.id, 8) === this.albumId;
		})[0];

		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + this.albumId;
		
		this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getPhotos response ->', response);	
				this.albumPhotos = response.photos;
			},
			(err) => { 
				console.log('getPhotos ERR ->', err);
			}
		);

  	}


  	public openDialog(photoModel:PhotoModel, indexId:number):void {
  		console.log('openDialog::indexId:', indexId);
  		this.photoIndexId = indexId;
  		this.selectedPhoto = photoModel;
  		this.dialogComponents.first.open();
  	}

}