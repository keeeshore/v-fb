import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class ApiService {

	public hostUrl:string = 'http://kishorebalan.com/';

	constructor (private http: Http) {
		
	}

	public fetch (url: string) {
		return this.http.get(url)
			.map(res => {
				//console.log('res from get service:' + JSON.stringify(res.json()));
				return res.json();
			})
			.catch(this.handleError);
	}

	public post (url: string, data: any) {
		return this.http.post(url, data)
			.map(res => {
				//console.log('res from post service:' + JSON.stringify(res.json()));
				return res.json();
			})
			.catch(this.handleError);
	}

	private fromQueryParams (obj: any) {
	    let params:string = '';
	    for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                params += '' + i + '=' + obj[i].toString();
            }
        }
        return params;
    }

	private extractData(res: Response) {
		let body = res.json();
		return body.data || { };
	}

	private handleError (error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		console.log('Error caught', error);
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

}
