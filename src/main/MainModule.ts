import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AdminModule } from '../admin/AdminModule';
import { AppModule } from '../app/AppModule';

import { AppComponent } from '../app/component/AppComponent';
import { AdminComponent } from "../admin/component/AdminComponent";

import { MainComponent } from './component/MainComponent';
import { CarouselComponent } from "../app/carousel/CarouselComponent";
import { Home } from "../app/home/Home";
import { ErrorComponent } from "../app/errors/Error";
import { Exhibition } from "../app/exhibition/Exhibition";
/*import { MainHeader } from "../app/header/Header";*/
import { About } from "../app/about/About";
import { Footer } from "../app/footer/Footer";
import { Slider } from "../app/slider/Slider";

import { Login } from "../admin/login/Login";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {trigger,state,style,animate,transition}from '@angular/animations';

import { CarouselItem } from "../app/carousel/CarouselItem";
import { DialogComponent} from "../app/dialog/DialogComponent";
import { ScrollerService} from "../app/services/ScrollerService";
import { ScrollerComponent} from "../app/common/ScrollerComponent";
import { AutoPositionDirective} from "../app/directives/AutoPositionDirective";
import { ApiService} from "../app/ApiService";

const mainRoutes: Routes = [
    /*{
       path: '', redirectTo: 'home', pathMatch: 'full'
    },  */ 
   /* {
        path: '',
        component: AppComponent,
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: AppComponent,
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: AppComponent,
    },
    {
        path: '**',
        component: ErrorComponent
    }*/
];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
    	JsonpModule,
    	FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppModule,
        AdminModule,
        RouterModule.forRoot(mainRoutes/*, { useHash: true }*/ ) 
	],
	declarations: [
        MainComponent,
        /*AppComponent,
        AdminComponent,*/
        /*MainHeader,*/
        /*ScrollerComponent,
        CarouselItem,
        CarouselComponent,
        DialogComponent,*/
        AutoPositionDirective,
        /*Home,
        Exhibition,
        About,
        Footer,
        Slider,*/
        ErrorComponent
	],
	bootstrap: [ MainComponent ],
	providers: [ApiService, ScrollerService]
})

export class MainModule { }