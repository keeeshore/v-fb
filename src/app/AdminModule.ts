import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AdminController } from './admin/controller/AdminController';
import { AdminHeader } from './admin/header/Header';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger,state,style,animate,transition }from '@angular/animations';
import { Login } from "./admin/login/Login";
import { Events } from "./admin/events/Events";
import { Albums } from "./admin/albums/Albums";
import { Posts } from "./admin/posts/Posts";
import { Photos } from "./admin/photos/Photos";
import { AuthGuard } from "./admin/AuthGuard";
import { ApiService } from "./ApiService";
import { AdminComponent } from "./admin/component/AdminComponent";

const adminRoutes: Routes = [ 
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            canActivateChild: [AuthGuard],
            children: [
              { path: 'events', component: Events },
              { path: 'albums', component: Albums },
              { 
                  path: 'posts',
                  component: Posts
              },
              { 
                  path: 'photos/:albumId',
                  component: Photos,
                  data: { albumId: 'albumId' }
              },
              { path: 'logout', component: Login },
              { path: '', component: Login },
              { path: '**', component: Login }
            ]
          }
        ]
    },
    /*{
        path: 'login',
        component: Login
    },
    {
        path: 'login/:reason',
        component: Login
    },
    {
        path: 'events',
        component: Events
    },
    {
        path: 'albums',
        component: Albums
    },
    {
        path: 'photos/:albumId',
        component: Photos,
        data: { albumId: 'albumId' }
    },
    {
        path: 'posts',
        component: Posts
    },
    {
        path: '*',
        component: Login
    },
    {
        path: '**',
        component: Login
    }*/];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
    	JsonpModule,
    	FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(adminRoutes)
	],
	declarations: [
        AdminController,
        AdminComponent,
        AdminHeader,
        Events,
        Albums,
        Photos,
        Posts,
        Login
	],
    exports: [
        RouterModule
    ],
	bootstrap: [ AdminController ],
	providers: [ApiService, AuthGuard]
})

export class AdminModule { }