import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AdminHeader } from './header/Header';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger,state,style,animate,transition }from '@angular/animations';
import { Login } from "./login/Login";
import { Events } from "./events/Events";
import { Albums } from "./albums/Albums";
import { Posts } from "./posts/Posts";
import { Photos } from "./photos/Photos";
import { AuthGuard } from "./AuthGuard";
import { ApiService } from "../app/ApiService";
import { AdminComponent } from "./component/AdminComponent";

const adminRoutes: Routes = [ 
	{
		path: 'admin',
		component: AdminComponent,
		pathMatch: 'prefix',
		canActivate: [AuthGuard],
		children: [
			{ 
				path: '',
				component: Login
			},
			{ 
				path: 'login:error',
				component: Login
			},
			{
				path: 'logout',
				component: Login
			},
			{
				path: '',
				canActivateChild: [AuthGuard],
				children: [
					{ path: 'events', component: Events },
					{ path: 'albums', component: Albums},
					{ path: 'albums/:albumId', component: Photos, data: { albumId: 'albumId' } },
					{ path: 'posts', component: Posts },
					{ path: '**', component: Login }
				]
			}
		]
	}
];

@NgModule({
		imports: [
		BrowserModule,
		HttpModule,
		JsonpModule,
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forChild(adminRoutes/*, { useHash: true  }*/)
	],
	declarations: [
		AdminComponent,
		AdminHeader,  
		Events,
		Albums,
		Photos,
		Posts,
		Login
	],
	exports: [ RouterModule ],
	bootstrap: [ AdminComponent ],
	providers: [ApiService, AuthGuard]
})

export class AdminModule { }