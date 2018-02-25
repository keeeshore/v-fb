import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../AuthGuard';

@Component({
  selector: 'admin-header',
  templateUrl: './header.html'
})

export class AdminHeader {

	public loggedIn:boolean = false;

	constructor(private authGuard:AuthGuard) {
		
	}

	public ngOnInit () {
		//console.log('ADMIN HEADER ngOnint, isLoggedIn:', this.authGuard.isLoggedIn);
		//this.loggedIn = this.authGuard.isLoggedIn;
	}

}