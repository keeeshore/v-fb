import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './component/Component';
import { AppHeaderComponent } from './header/Header';
import { AppPostsComponent } from './posts/Posts';
import { SchoolComponent } from "./school/SchoolComponent";
import { CarouselComponent } from "./carousel/CarouselComponent";
import { Events } from "./events/Events";
import { CarouselItem } from "./carousel/CarouselItem";
import {DialogComponent} from "./dialog/DialogComponent";
import {DialogService} from "./dialog/DialogService";
import {ApiService} from "./ApiService";

const appRoutes: Routes = [
    {
        path: 'events',
        component: Events
    },
    {
        path: 'posts',
        component: AppPostsComponent
    },
    {
        path: 'school',
        component: SchoolComponent,
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
        path: 'test',
        redirectTo: '/posts',
        pathMatch: 'full'
    },
    {
        path: '',
        component: CarouselComponent
    },
    {
        path: '**',
        component: AppComponent
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
        AppHeaderComponent,
        AppPostsComponent,
        SchoolComponent,
        CarouselItem,
        CarouselComponent,
        DialogComponent,
        Events
	],
	bootstrap: [ AppComponent ],
	providers: [ApiService, DialogService]
})

export class AppModule { }