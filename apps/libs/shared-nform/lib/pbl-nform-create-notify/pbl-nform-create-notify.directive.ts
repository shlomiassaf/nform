import { Directive, Injectable } from '@angular/core';
import { NFormComponent } from '@pebula/nform';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PblNformCreateNotifier {
  onCreate: Observable<NFormComponent>;
  private notify$ = new Subject<NFormComponent>();

  constructor() {
    this.onCreate = this.notify$.asObservable();
  }

  notify(nform: NFormComponent): void {
    this.notify$.next(nform);
  }
}

@Directive({selector: 'pbl-nform[model]'})
export class PblNformCreateNotify {
  constructor(private notifier: PblNformCreateNotifier, private nform: NFormComponent) {
  }

  ngOnInit() {
    this.notifier.notify(this.nform);
  }
}
