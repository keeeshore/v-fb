import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppController } from './controller/AppController';
import { CarouselComponent } from "./carousel/CarouselComponent";
import { Home } from "./home/Home";
import { ErrorComponent } from "./errors/Error";
import { Exhibition } from "./exhibition/Exhibition";
import { MainHeader } from "./header/Header";
import { About } from "./about/About";
import { Footer } from "./footer/Footer";
import { Slider } from "./slider/Slider";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {trigger,state,style,animate,transition}from '@angular/animations';

import { CarouselItem } from "./carousel/CarouselItem";
import { DialogComponent} from "./dialog/DialogComponent";
import { ScrollerService} from "./services/ScrollerService";
import { ScrollerComponent} from "./common/ScrollerComponent";
import { AutoPositionDirective} from "./directives/AutoPositionDirective";
import { ApiService} from "./ApiService";

const appRoutes: Routes = [    
    {
        path: 'home',
        component: Home
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
    },
    {
        path: '**',
        component: ErrorComponent
    },
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
        MainHeader,
        ScrollerComponent,
        CarouselItem,
        CarouselComponent,
        DialogComponent,
        AutoPositionDirective,
        Home,
        Exhibition,
        About,
        Footer,
        Slider,
        ErrorComponent
	],
	bootstrap: [ AppController ],
	providers: [ApiService, ScrollerService]
})

export class AppModule { }