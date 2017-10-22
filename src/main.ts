import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { MainModule } from './main/MainModule';

if (process && process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MainModule);