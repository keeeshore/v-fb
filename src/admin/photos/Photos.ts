/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../../app/ApiService';
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from './PhotoCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../../app/environments/environment';
import { GraphService } from '../services/GraphService';

@Component({
	selector: 'app-photos',
	templateUrl: './photos.html',
	providers: [GraphService]
})

export class Photos implements OnInit {

	//VimonishaExhibitions?fields=events.since(1486984200).until(1504960500).limit(100);
	//VimonishaExhibitions?fields=albums.id(178838325568799){photos}
	//178838325568799?fields=photos{id, source,name}

	public message:string = '';

	public albumId:string;

	public albumName:string = 'NOT KNOWN';

	public photoCollection:PhotoCollection;	

	public fbCollection:PhotoCollection;

	public albumsCollection:AlbumCollection = new AlbumCollection();

	public photoParams:PhotoParams;

	public fromDate: string = 'NONE';

	public accessToken: string = '';

    public toDate: string = moment().format(ENV.DATE_TIME_FORMAT);

    public imageHostPath:string = ENV.HOST_URL;

	constructor(private apiService: ApiService, private graphService: GraphService,  private router: ActivatedRoute) {
		this.accessToken = this.apiService.accessToken;
	}

	public ngOnInit(): void {
		console.log('Photos component init');
		this.accessToken = this.apiService.accessToken;
		let albumId:string = '';
	    this.router.params.forEach((params: Params) => {
	      	this.albumId = params['albumId'];
	    });
	    this.albumsCollection.albums.forEach((album:AlbumModel)=> {
	    	if (album.id === this.albumId) {
	    		this.albumName = album.name;
	    	}
	    });
 		this.photoCollection = new PhotoCollection(this.albumId);
		this.fbCollection = new PhotoCollection(this.albumId);
		this.getPhotosFromTable(this.albumId).subscribe();		
	}
	
	public setPhotosFromFB (dataArray:Array<any>):Array<PhotoModel> {
		console.log('setPhotos:::-------------------------------------------------------------------------------------', dataArray);
		let photos:Array<PhotoModel> = dataArray.map((model:any) => {
			model.createdTime = model.created_time;
			let photoModel = new PhotoModel(model);
			return photoModel;
		});
		return photos;
	}

	public setPhotos (photosArr:Array<PhotoModel>, dataArray:Array<any>):Boolean {
		//console.log('setPhotos:::-------------------------------------------------------------------------------------');
		let photos:Array<PhotoModel> = dataArray.map((model:any) => {
			if (model.created_time)	{
				model.createdTime = model.created_time;
				delete model.created_time;
			}
			let photoModel = new PhotoModel(model);
			//console.log(photosArr.length, ':setPhotos:::------------------NEW photoModel->', photoModel);
			photosArr.push(photoModel);
			return photoModel;
		});
		return photos.length > 0 ? true : false;
	}

	public setPhotosFromTable (photosArr:Array<PhotoModel>, dataArray:Array<any>):Boolean {
		let photos:Array<PhotoModel> = dataArray.map((model:any) => {
			model.images = [ {source: model.source }];
			let photoModel = new PhotoModel(model);
			photosArr.push(photoModel);
			return photoModel;
		});
		return photos.length > 0 ? true : false;
	}

	public onGetPhotosClick():void {
		this.fbCollection = new PhotoCollection(this.albumId);
		let photos = new Array<PhotoModel>();
		this.photoParams = new PhotoParams(this.albumId);

		this.graphService.fromDate = this.fromDate;
		this.graphService.toDate = this.toDate;
		this.graphService.accessToken = this.accessToken;
		this.fbCollection.photos = photos;

		this.message = 'Get PHOTOS from FB in Progress!';
		this.graphService.getCollection(this.photoParams, photos).subscribe(
			(response) => {
				console.log('getPhotos success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
				this.fbCollection.photos = this.setPhotosFromFB(response.data);
				this.setLastEndTime(this.fbCollection.photos);
				this.message = 'Get PHOTOS from FB COMPLETE!';
			},
			(err) => { console.log('getPhotos err:::', err)},
			() => {console.log('getPhotos final:::')}
		);
	}

	public onGetPhotosFromTable (albumId:string) {
		this.getPhotosFromTable(albumId).subscribe(
			(response: any) => {
				console.log('getPhotosFromTable response ->', response);
				this.setPhotosFromTable(this.photoCollection.photos, response.photos);
				this.setLastEndTime(this.photoCollection.photos);
				return new Observable((observer:any) => {
                	observer.next(response);
            	});
			},
			(err:any) => {
				//console.log('ERR in gePhotosFromTable');
			}
		);
	}

	public getPhotosFromTable (albumId:string):Observable<any> {
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		this.photoCollection.photos = new Array<PhotoModel>();
		return this.apiService.fetch(url).flatMap(
			(response: any) => {
				this.setPhotosFromTable(this.photoCollection.photos, response.photos);
				this.setLastEndTime(this.photoCollection.photos);
				return new Observable((observer:any) => {
                	observer.next(response);
            	});
			}
		);
	}

	public onDeletePhotoModel(photoModel:PhotoModel):void {
		let url = ENV.HOST_API_URL + '/photos_delete.php';
		//console.log('onDeletePhotoModel POST ->', photoModel);
		this.apiService.post(url, photoModel).subscribe(
			(response: any) => {
				//console.log('onDeletePhotoModel response ->', response);
				this.getPhotosFromTable(this.photoCollection.albumId).subscribe();
			},
			(err) => { 
				//console.log('onDeletePhotoModel ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);
	}

	public onAddPhotoModel(photoModel:PhotoModel):void {
		let indexId = this.fbCollection.photos.indexOf(photoModel);
		this.fbCollection.photos.splice(indexId, 1);
		let collection = this.fbCollection;
		collection.photos = [photoModel];
		this.submitPhotos(collection).subscribe();
	}

	public doSubmitPhotos ():void {
		this.onSubmitPhotos(0, this.albumId).subscribe((response:any) => {
			console.log('FINAL SUCCESS-----------##############----------DONE for:', response);
			this.getPhotosFromTable(this.albumId).subscribe();        
    	},
    	(err:any)=>{
    		console.log('ERR-------------------#############--DONE for:', err);
    		this.message = JSON.stringify(err);
    	},
    	()=> {console.log('COMPELTE------------##################---------DONE for:');}
    	);
	}


	public onSubmitPhotos (indexId:number, albumId:string):Observable<any> {
		console.log('onSubmitPhotos--------------START----------------:indexId=', indexId);

		return new Observable((observer:any) => {
			if (!indexId) {
	            indexId = 0;
	        }

	        if (this.fbCollection.photos[indexId]) {
	            this.message = 'In Progress.....';

	            let photoModel:PhotoModel = this.fbCollection.photos[indexId];	 			
	 			//console.log('onSubmitPhotos--------------in PROGRESS');	            
	            //console.log('onSubmitPhotos--------------in Observable');

	            	this.submitPhoto(photoModel, albumId).subscribe(
	            		(response:any) => {
			                //console.log('response---------------------DONE for:', indexId);
			                indexId = indexId + 1;
			                this.onSubmitPhotos(indexId, albumId).subscribe(
			                	(response:any) => {
					                observer.next({success: response.success, data: response});
				            	},
			            		(err:any)=>{
									observer.next({success: false, data: err});
			                	});
		            	},
		            	(err:any)=>{
		            		//console.log('ERR---------------------DONE for:', err);
							observer.next({success: false, data: err});
	                });
	        } else {
	            this.message = 'POSTS UPDATE COMPLETE!!';
	            //console.log('NO MORE POST TO SUBMIT.....');            
	            observer.next({success: true});
	        }
        });
	}

	public submitPhotos (collection:PhotoCollection):Observable<any> {
		//console.log('SUBMIT PhotoCollection...', collection);
		let url = ENV.HOST_API_URL + '/photos_post.php';
		return this.apiService.post(url, collection).flatMap((response:any) => {
			//console.log('eventModel POST response recieved....', response);
			if (response && response.success) {
				return this.getPhotosFromTable(this.albumId).flatMap(()=>{
					return new Observable((observer:any) => {
		                observer.next(response);
		            });
				});
			}
		});
	}

	public submitPhoto (photoModel:PhotoModel, albumId:string):Observable<any> {
		let photoCollection = new PhotoCollection(albumId);
		photoCollection.photos.push(photoModel);
		let url = ENV.HOST_API_URL + '/photos_post.php';
		return this.apiService.post(url, photoCollection).flatMap((response:any) => {
			return new Observable((observer:any) => {
                observer.next({ success: response.success, data: response});
            });
		});
	}	

	public setLastEndTime (photos:Array<PhotoModel>) {
		let total = photos.length;
		if (total > 0) {
			let lastModel = photos[0];
			let fDate = moment(lastModel.createdTime, ENV.DATE_TIME_FORMAT).add(1, 'm');
			this.fromDate = fDate.format(ENV.DATE_TIME_FORMAT);
		}
	}

	public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            //console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
		return false;
	}

}


export interface DataEvent {

    data:any;

}