import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';

import {ENV} from '../environments/environment';

@Injectable()
export class CommonService {

	constructor () {
        console.log('Common service');
    }
    
    public getDate (dateStr:string):string {
        debugger;
		let date:string = moment.parseZone(dateStr, ENV.DATE_TIME_FORMAT).subtract(5, 'hour').format(ENV.USER_DATE_FORMAT);
        //let dt:string = moment.parseZone(dateStr, ENV.DATE_TIME_FORMAT).utc();
        //let dtstr:string = '2018-04-07T20:00:00+0530';
		//let date:string = momentTimezone.tz(dtstr, 'Asia/Kolkata').format(ENV.USER_DATE_FORMAT);
		return date;
	}

}