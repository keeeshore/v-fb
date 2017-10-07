import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable()
export class ScrollerService {

	public scrollerSubject: Subject<number> =  new Subject<number>();

	constructor () {
		let self = this;
		window.addEventListener('scroll', function(event:any) {
		  self.scrollerSubject.next(event.currentTarget.pageYOffset);
		});
	}

    onScrollBroadcast():Observable<number> {
        return this.scrollerSubject.asObservable();
    }

}