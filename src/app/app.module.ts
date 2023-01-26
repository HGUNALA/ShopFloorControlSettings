import {
  APP_INITIALIZER,
  LOCALE_ID,
  NgModule,
  TRANSLATIONS,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Log } from '@infor-up/m3-odin';
import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule } from 'ids-enterprise-ng'; // TODO Consider only importing individual SoHo modules in production
import { AppComponent } from './app.component';
import { LoolupDataService } from './lookup-data.service';
import { ShopFloorSettingComponent } from './shop-floor-setting/shop-floor-setting.component';
import { Translations } from './translations';

@NgModule({
  declarations: [AppComponent, ShopFloorSettingComponent],
  imports: [BrowserModule, FormsModule, SohoComponentsModule, M3OdinModule],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en-US',
    },
    Translations,
    ShopFloorSettingComponent,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (locale: string) => () => {
        Soho.Locale.culturesPath = 'assets/ids-enterprise/js/cultures/';
        return Soho.Locale.set(locale).catch((err) => {
          Log.error('Failed to set IDS locale', err);
        });
      },
      deps: [LOCALE_ID],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
