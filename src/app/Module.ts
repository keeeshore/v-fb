import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppController } from './controller/AppController';
import { AdminHeader } from './admin/header/Header';
import { Posts } from './admin/posts/Posts';
import { CarouselComponent } from "./carousel/CarouselComponent";

import { Home } from "./home/Home";
import { Exhibition } from "./exhibition/Exhibition";
import { MainHeader } from "./header/Header";
import { About } from "./about/About";
import { Footer } from "./footer/Footer";
import { Slider } from "./slider/Slider";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {trigger,state,style,animate,transition}from '@angular/animations';

import { Events } from "./admin/events/Events";
import { Photos } from "./admin/photos/Photos";
import { Albums } from "./admin/albums/Albums";
import { Login } from "./admin/login/Login";
import { CarouselItem } from "./carousel/CarouselItem";
import {DialogComponent} from "./dialog/DialogComponent";
import {ScrollerService} from "./services/ScrollerService";
import {ScrollerComponent} from "./common/ScrollerComponent";
import {AutoPositionDirective} from "./directives/AutoPositionDirective";
import {ApiService} from "./ApiService";

const appRoutes: Routes = [
    {
        path: 'home',
        component: Home
    },    
    {
        path: '',
        component: Home
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
        path: 'about',
        component: About
    },
    {
        path: 'shows',
        component: Exhibition
    },
    {
        path: 'shows/:id',
        component: Exhibition
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
        RouterModule.forRoot(appRoutes)
	],
	declarations: [
        AppController,
        AdminHeader,
        MainHeader,
        Posts,
        ScrollerComponent,
        CarouselItem,
        CarouselComponent,
        DialogComponent,
        AutoPositionDirective,
        Photos,
        Albums,
        Events,
        Login,
        Home,
        Exhibition,
        About,
        Footer,
        Slider
	],
	bootstrap: [ AppController ],
	providers: [ApiService, ScrollerService]
})

export class AppModule { }