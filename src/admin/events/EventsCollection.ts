/**
 * Created by balank on 8/09/2017.
 */
import {PagingData} from '../model/PagingData';
import {PhotoModel} from '../photos/PhotoCollection';
import * as moment from 'moment';
import {ENV} from '../../app/environments/environment';
import { GraphParams } from '../services/GraphParams';

export class EventParams implements GraphParams  {

    public fields1:string = 'cover{source},name,description,start_time,end_time,id,photos{images{source},created_time,id}';
    
    public fields:string = 'cover{source},name,description,start_time,end_time,id';

    public limit:string = '2';

    public pretty:string = '0';
    
    public before:string = '';

    public after:string = '';

    public type:string = 'events';

    public id:string = '';

    constructor () { }

}

export class Cover  {

    public source:string;

    public id:string;

    constructor (source:string, id:string) {
        this.source = source || '';
        this.id = id || '';
    }

}


export class DataObj  {

    public url:string;

    constructor (dataObj:DataObj) {
        this.url = dataObj.url;
    }

}


export class EventModel  {

    public name:string;

    public description:string;

    public id:number;

    public uid:number;

    public cover:Cover;

    public startTime:string;

    public photoStartTime:string;

    public endTime:string;

    public photoEndTime:string;

    public photos:Array<PhotoModel>;

    public totalPhotos:string = 'NONE';

    public status:string = '-';

    constructor (eventModel:any) {
        let desc = '';
        this.name = eventModel.name;
        this.id = eventModel.id;       
        this.uid = eventModel.uid;
        this.photos = new Array<PhotoModel>();

        if (eventModel.description) {
            desc = eventModel.description.replace(/'/g, "");
        }

         this.description = desc;

        this.startTime = moment(eventModel.startTime || '').format(ENV.DATE_TIME_FORMAT);
        this.endTime = moment(eventModel.endTime || '').format(ENV.DATE_TIME_FORMAT);

        if (eventModel.cover) {
            this.cover = new Cover(eventModel.cover.source, eventModel.cover.id);
        } else {
            this.cover = new Cover('', '');
        }
    }

}

export class EventsCollection {

    public events:Array<EventModel> = new Array<EventModel>();

    public id:string;

    public paging:PagingData;

    constructor () {}

}