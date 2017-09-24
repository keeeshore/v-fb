/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ApiService} from './../ApiService';
import {PhotoCollection, PhotoModel, PhotoParams, AlbumModel, AlbumCollection} from './PhotoCollection';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import {ENV} from '../environments/environment';

@Component({
	selector: 'app-photos',
	templateUrl: './photos.html',
	providers: [ApiService]
})

export class Photos {

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

	private fromDate: string = 'NONE';

	public accessToken: string = '';

    private toDate: string = moment().format(ENV.DATE_TIME_FORMAT);

    private dialogSubject: Subject<DataEvent> =  new Subject<DataEvent>();

    public imageHostPath:string = ENV.HOST_API_URL;

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		console.log('Photos component init');
	}

	public ngOnInit(): void {
		console.log('ngOnInit::');
		let albumId:string = '';
	    this.router.params.forEach((params: Params) => {
	    	console.log('ngOnInit::', params['albumId']);
	      	this.albumId = params['albumId'];
	    });
	    this.albumsCollection.albums.forEach((album:AlbumModel)=> {
	    	if (album.id === this.albumId) {
	    		this.albumName = album.name;
	    	}
	    });
 		this.photoCollection = new PhotoCollection(this.albumId);	
		this.fbCollection = new PhotoCollection(this.albumId);
		this.getPhotosFromTable(this.albumId);
  	}	

	public setPhotos (photosArr:Array<PhotoModel>, dataArray:Array<any>):Boolean {
		console.log('setPhotos:::-------------------------------------------------------------------------------------');
		let photos:Array<PhotoModel> = dataArray.map((model:any) => {
			if (model.created_time)	{
				model.createdTime = model.created_time;
				delete model.created_time;
			}
			let photoModel = new PhotoModel(model);
			console.log(photosArr.length, ':setPhotos:::------------------NEW photoModel->', photoModel);
			photosArr.push(photoModel);
			return photoModel;
		});
		return photos.length > 0 ? true : false;
	}

	public onGetPhotosClick():void {
		this.fbCollection = new PhotoCollection(this.albumId);
		let photos = new Array<PhotoModel>();
		this.photoParams = new PhotoParams(this.albumId);
		this.dialogSubject =  new Subject<DataEvent>();
		console.log('onGetPhotosClick:::::::', photos);

		this.getPhotos(this.photoParams, photos, false).subscribe(
			(response) => { 
				console.log('getPhotos success::::::::::::::::::::::::::::::::::::::::::::::::::::', response);
				this.setPhotos(this.fbCollection.photos, response.data);
			},
			(err) => { console.log('getPhotos err:::', err)},
			() => {console.log('getPhotos final:::')}
		);
	}


	public getPhotosFromTable (albumId:string) {
		console.log('getEventsFromTable...');
		let url = ENV.HOST_API_URL + '/photos_get.php?albumId=' + albumId;
		this.photoCollection.photos = new Array<PhotoModel>();
		return this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getPhotosFromTable response ->', response);
				this.setPhotos(this.photoCollection.photos, response.photos);
				this.setLastEndTime();
			},
			(err) => { 
				console.log('getPhotosFromTable ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);
	}

	public onDeletePhotoModel(photoModel:PhotoModel):void {
		let url = ENV.HOST_API_URL + '/photos_delete.php';
		console.log('onDeletePhotoModel POST ->', photoModel);
		this.apiService.post(url, photoModel).subscribe(
			(response: any) => {
				console.log('onDeletePhotoModel response ->', response);
				this.getPhotosFromTable(this.photoCollection.albumId);
			},
			(err) => { 
				console.log('onDeletePhotoModel ERR ->', err);
				this.message = JSON.stringify(err);
			}
		);
	}

	public onAddPhotoModel(photoModel:PhotoModel):void {
		let indexId = this.fbCollection.photos.indexOf(photoModel);
		this.fbCollection.photos.splice(indexId, 1);
		let collection = this.fbCollection;
		collection.photos = [photoModel];
		this.submitPhotos(collection);
	}


	public onSubmitPhotos ():void {
		console.log('onSubmitPhotos');
		this.submitPhotos(this.fbCollection);
	}

	public submitPhotos (collection:PhotoCollection) {
		console.log('SUBMIT PhotoCollection...', collection);
		let url = ENV.HOST_API_URL + '/photos_post.php';
		this.apiService.post(url, collection).subscribe((response:any) => {
			console.log('eventModel POST response recieved....', response);
			if (response && response.success) {
				this.getPhotosFromTable(this.albumId);
			}
		});
	}	

	public getPhotos (photoParams:PhotoParams, collection:Array<any>, isRepeat:boolean):Observable<DataEvent> {
		console.log('getPhotos....called with photoParams:', photoParams, 'COLLETION:::', collection);
		this.message = 'In progress...';
		
        if (!this.isValidDateRange(this.fromDate, this.toDate)) {
        	console.log('Invalid Date range!!!!');
            this.message = 'Invalid Date range......';
            return;
        }

        console.log('is valid date range', this.fromDate + ' : to : ' + this.toDate);
        let since = moment(this.fromDate, ENV.DATE_TIME_FORMAT).unix();
        let until = moment(this.toDate, ENV.DATE_TIME_FORMAT).unix();
		console.log('is valid date range', since + ' : to : ' + until);


		let url = ENV.FB_GRAPH_URL + photoParams.albumId + '/photos';
		let params  = new URLSearchParams(); //TODO: IE fix, polyfill
		
		params.append('access_token', this.accessToken);
		params.append('since', since.toString());
		params.append('until', until.toString());
		params.append('fields', photoParams.fields);
		params.append('limit', photoParams.limit);
		params.append('pretty', photoParams.pretty);

		if (photoParams.after !== '' && photoParams.nextUrl !== '') {
			console.log('after is present...ADDING after');
			params.append('after', photoParams.after);
		}
		url = url + '?' + params.toString();
		
		console.log('url->', url);		

		this.apiService.fetch(url).subscribe(
			(response: any) => {
				console.log('getEvents RESPONSE ->', response);
				let photos:any = response;
				
				if (photos && photos.data.length > 0) {
					let data = photos.data;
					let pagingData:PagingData = new PagingData(photos.paging);
					
					data.filter((dataModel:any)=>{ collection.push(dataModel)});
					
					if (pagingData.next !== 'none') {
						console.log(collection.length, ':::pagingData.NEXT PRESENT');
						this.photoParams.after = pagingData.cursors.after;
						this.photoParams.nextUrl = pagingData.next;
						return this.getPhotos(this.photoParams, collection, true);
					} else {
						this.photoParams.after = '';
						this.photoParams.nextUrl = '';
						console.log('---------------------------------------------------- pagingData complete--------ALL DONE!!', collection);
						this.dialogSubject.next({data: collection});
					}
				} else {
					this.message = 'Complete!';
					console.log('-------------------------------------------ALL DONE!!', collection);
					this.dialogSubject.next({data: collection});
				}
			},
			(err:any) => { 
				this.message = JSON.stringify(err);
			});

		return this.dialogSubject;
	}

	public setLastEndTime () {
		let total = this.photoCollection.photos.length;
		console.log('setLastEndTime', total);
		if (total > 0) {
			let lastModel = this.photoCollection.photos[0];
			this.fromDate = lastModel.createdTime;
		}
	}

	public isValidDateRange (fromDate:string, toDate:string):Boolean {		
        if (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isValid() && moment(this.toDate, ENV.DATE_TIME_FORMAT).isValid()
            && (moment(this.fromDate, ENV.DATE_TIME_FORMAT).isBefore(moment(this.toDate, ENV.DATE_TIME_FORMAT)))) {
            console.log('IS VALID DATE RANGE:', this.fromDate + ' : to : ' + this.toDate);
            return true;
        }
		return false;
	}

}


export interface DataEvent {

    data:any;

}