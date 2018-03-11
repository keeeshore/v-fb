import {Component,  ViewChildren, QueryList, ContentChildren} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import {ENV} from '../environments/environment';


@Component({
	selector: 'footer-component',
	templateUrl: './footer.html',
	styleUrls: ['./footer.css'],
	providers: []
})

export class Footer {

	public adminUrlStr:string = ENV.ADMIN_URL;

	constructor() {
		console.log('Footer us component init', this.adminUrlStr);
	}

}