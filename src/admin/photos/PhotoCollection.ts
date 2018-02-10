/**
 * Created by balank on 8/09/2017.
 */
import {PagingData} from '../model/PagingData';
import * as moment from 'moment';
import {ENV} from '../../app/environments/environment';

export class PhotoParams  {

    public fields:string = 'id,name,created_time,source';

    public limit:string = '100';

    public pretty:string = '1';
    
    public before:string = '';

    public after:string = '';

    public albumId:string = '';

    public nextUrl:string = '';

    constructor (albumId:string) {
        //VimonishaExhibitions?fields=albums.id(178838325568799){photos}
        //fields=albums.id(178838325568799){photos{source,name,id,created_time}}
        //178838325568799?fields=photos{id,name,created_time},count
        //https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=178838325568799%3Ffields%3Dphotos.limit(2)%7Bid%2Cname%2Ccreated_time%7D%2Ccount&version=v2.10#
        //178838325568799/photos?pretty=0&fields=id,name,created_time&limit=2&after=MTM1ODYzNTczNzU4OTA0NgZDZD
        //correct:178838325568799/photos?fields=id,name,created_time,source&limit=100&since=1500221700&until=1505578500

        this.albumId = albumId;
    }

}

export class Cover  {

    public source:string;

    public id:string;

    constructor (source:string, id:string) {
        this.source = source || '';
        this.id = id || '';
    }

}


export class PhotoModel  {

    public name:string;

    public id:number;

    public uid:number;

    public createdTime:string;

    public source:string;

    constructor (photoModel:any) {
        this.name = photoModel.name || '';      
        this.uid = photoModel.uid || '';
        this.id = photoModel.id;
        this.source = photoModel.source;
        this.createdTime = moment(photoModel.createdTime || '').format(ENV.DATE_TIME_FORMAT);
    }

}


export class PhotoCollection {

    public photos:Array<PhotoModel>;

    public albumId:string;

    public albumName:string;

    public uid:string;

    constructor (albumId:string) {
        this.photos = new Array<PhotoModel>();
        this.albumId = albumId;
    }    

}


export class AlbumModel {

    public id:string;

    public name:string;

    public createdTime:string;

    constructor () {}

}

export class AlbumCollection {

    public albums:Array<AlbumModel> = [    
    {
        "createdTime": "2012-05-12T07:34:21+0000",
        "name": "Cover Photos",
        "id": "213393798779918"
      },

      {
        "createdTime": "2015-07-31T14:12:59+0000",
        "name": "Press & Media Coverage",
        "id": "808322362620389"
      },
      {
        "createdTime": "2012-03-17T05:30:45+0000",
        "name": "Profile Pictures",
        "id": "175166482602650"
      },      
      {
        "createdTime": "2014-11-03T06:57:37+0000",
        "name": "Vimonisha Mega style souk at Hyatt on 17th 18th Dec 2014",
        "id": "663445600441400"
      },
      {
        "createdTime": "2013-08-07T15:38:52+0000",
        "name": "75th Edition of Vimonisha Exhibition",
        "id": "420955814690381"
      },
      {
        "createdTime": "2013-07-30T08:28:04+0000",
        "name": "Vimonisha - Past Exhibitions",
        "id": "416935778425718"
      },
      {
        "createdTime": "2012-03-23T06:05:36+0000",
        "name": "Timeline Photos",
        "id": "178838325568799"
      },
      {
        "createdTime": "2014-03-29T12:29:40+0000",
        "name": "Mobile Uploads",
        "id": "541765672609394"
      }
    ]
}