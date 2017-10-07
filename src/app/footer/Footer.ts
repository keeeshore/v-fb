import {Component,  ViewChildren, QueryList, ContentChildren} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';


@Component({
	selector: 'footer-component',
	templateUrl: './footer.html',
	styleUrls: ['./footer.css'],
	providers: []
})

export class Footer {

	constructor() {
		console.log('Footer us component init');
	}

}