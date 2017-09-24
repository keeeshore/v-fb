import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './component/Component';
import { AdminHeader } from './admin/header/Header';
import { Posts } from './admin/posts/Posts';
import { CarouselComponent } from "./carousel/CarouselComponent";

import { Home } from "./home/Home";
import { MainHeader } from "./header/Header";


import { Events } from "./admin/events/Events";
import { Photos } from "./admin/photos/Photos";
import { Albums } from "./admin/albums/Albums";
import { Login } from "./admin/login/Login";
import { CarouselItem } from "./carousel/CarouselItem";
import {DialogComponent} from "./dialog/DialogComponent";
import {DialogService} from "./dialog/DialogService";
import {ApiService} from "./ApiService";

const appRoutes: Routes = [
    {
        path: 'admin/events',
        component: Events
    },
    {
        path: 'admin/albums',
        component: Albums
    },
    {
        path: 'admin/photos/:albumId',
        component: Photos,
        data: { albumId: 'albumId' }
    },
    {
        path: 'admin/posts',
        component: Posts
    },
    {
        path: 'admin/school',
        component: Posts,
        data: { title: 'Heroes List' }
    },
    {
        path: 'carousel',
        component: CarouselComponent,
        data: {
            id: 111,
            items: [
                {'itemId': '1', 'itemStr': 'test 1'},
                {'itemId': '2', 'itemStr': 'test 2'},
                {'itemId': '3', 'itemStr': 'test 3'},
                {'itemId': '4', 'itemStr': 'test 4'}
            ]
        }
    },
    {
        path: 'admin/login',
        component: Login
    },
    {
        path: 'admin/login/:reason',
        component: Login
    },
    {
        path: '',
        component: Home
    },
    {
        path: '**',
        component: Home
    }
];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
    	JsonpModule,
    	FormsModule,
        RouterModule.forRoot(appRoutes)
	],
	declarations: [
		AppComponent,
        AdminHeader,
        MainHeader,
        Posts,
        CarouselItem,
        CarouselComponent,
        DialogComponent,
        Photos,
        Albums,
        Events,
        Login,
        Home
	],
	bootstrap: [ AppComponent ],
	providers: [ApiService, DialogService]
})

export class AppModule { }