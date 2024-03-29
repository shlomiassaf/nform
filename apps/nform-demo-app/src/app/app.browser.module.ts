
import { NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { AppComponent } from './app.component';
import { AppModule, REQ_KEY } from './app.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    AppModule
  ],
  providers: [
    {
      provide: REQUEST,
      useFactory: (transferState: TransferState) => transferState.get<any>(REQ_KEY, {}),
      deps: [TransferState]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {}
