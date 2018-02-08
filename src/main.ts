import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { Piano } from './classes/piano';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

(function(){
  document.addEventListener("DOMContentLoaded", function(){
    //var note = new Notes();
    //var hand = new HandlerFunctionality(note);
    var piano = new Piano();
  });
})();