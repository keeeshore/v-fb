import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable()
export class ApiService {

	constructor (private http: Http,
		private route: ActivatedRoute,
    	private router: Router) {
		console.log('APISERVICE CONSTRUCTOR---------------------------------------------------------');
	}

	public accessToken:string = '';

	public fetch (url: string):Observable<any> {
		console.log('ApiService.fetch');
		return this.http.get(url)
			.map(res => {
				console.log('this.http.get::res from get service:');
				return res.json();
			})
			.catch(this.handleError.bind(this));
	}

	public post (url: string, data: any) {
		return this.http.post(url, data)
			.map(res => {
				//console.log('res from post service:' + JSON.stringify(res.json()));
				return res.json();
			})
			.catch(this.handleError.bind(this));
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
		console.log('handleError:::Error caught', error);
		if (error.status === 403) {
			console.log('Error caught and redirecting to Login page');
			this.router.navigate(['/admin/login', 'expired']);
		}
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error('handleError:::', errMsg);
		return Observable.throw(errMsg);
	}

	public insertGoogleCaptha(): void {
  		let head:any = document.getElementsByTagName('head')[0];		
		let scriptElem:any = document.getElementById('google-captcha');

		if (scriptElem) {
			head.removeChild(scriptElem);
		}
		let script:any = document.createElement('script');
			script.type = 'text/javascript';
			script.id = 'google-captcha';
			script.src = 'https://www.google.com/recaptcha/api.js';
		head.appendChild(script);
  	}

}
