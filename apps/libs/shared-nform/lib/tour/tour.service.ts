import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import Shepherd from 'shepherd.js';
import { Injectable, isDevMode } from '@angular/core';

function loadJs(): Promise<typeof Shepherd> {
  return import('shepherd.js').then( Shepherd => Shepherd.default );
}

function loadCss(): Promise<void> {
  if (loadCss['_CSS']) {
    return Promise.resolve();
  }
  loadCss['_CSS'] = true;
  return new Promise<void>( (res, rej) => {
    if (isDevMode()) {
      const scriptEl = document.createElement('script');
      scriptEl.setAttribute('type', 'text/javascript')
      document.body.appendChild(scriptEl);
      scriptEl.onload = e => res();
      scriptEl.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => rej();
      scriptEl.setAttribute('src', 'shepherd.css.js');
    } else {
      const linkEl = document.createElement('link');
      linkEl.setAttribute('type', 'text/css');
      linkEl.setAttribute('rel', 'stylesheet');

      document.body.appendChild(linkEl);
      document.getElementsByTagName('head')[0].appendChild(linkEl);
      linkEl.onload = e => res();
      linkEl.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => rej();
      linkEl.setAttribute('href', 'shepherd.css.js.css');
    }
  });
}

@Injectable({ providedIn: 'root' })
export class TourService {

  readonly ready: Observable<typeof Shepherd>;

  constructor() {
    const r = new ReplaySubject<typeof Shepherd>(1);
    this.ready = r.pipe(take(1));

    Promise.all([ loadJs().then( Shepherd => this.Shepherd = Shepherd ),  loadCss() ])
      .then( () => r.next(this.Shepherd) )
      .catch( e => r.error(e) );
  }

  public Shepherd: typeof Shepherd;
}
