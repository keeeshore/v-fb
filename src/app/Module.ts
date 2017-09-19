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
import { Photos } from "./photos/Photos";
import { Albums } from "./albums/Albums";
import { Login } from "./login/Login";
import { CarouselItem } from "./carousel/CarouselItem";
import {DialogComponent} from "./dialog/DialogComponent";
import {DialogService} from "./dialog/DialogService";
import {ApiService} from "./ApiService";


/*declare var __IN_DEBUG__: boolean;
declare var __VERSION__: string;
declare var API_URL: string;


export default function(app) {
  app.constant('config', {apiUrl: API_URL});
};
*/
const appRoutes: Routes = [
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
        component: Login
    },
    {
        path: '**',
        component: Login
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
        Photos,
        Albums,
        Events,
        Login
	],
	bootstrap: [ AppComponent ],
	providers: [ApiService, DialogService]
})

export class AppModule { }