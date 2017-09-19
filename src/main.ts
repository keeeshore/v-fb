console.log('Main.ts 1:', process);

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/Module';

console.log('Main.ts 2:', process.env.ENV);

if (process && process.env.ENV === 'production') {
  enableProdMode();
} else {
	console.log('declaring Const ENV_CONFIG as dev---');
}

platformBrowserDynamic().bootstrapModule(AppModule);