import { Observable, isObservable } from 'rxjs';
import { NFormRecordRef } from '../nform/nform-record-ref';

const asyncUsed = (done: Promise<void> | Observable<void>) => {
  throw new Error('async() was already called once.');
};

export class BeforeRenderEventHandler {
  /**
   * An object whose values are instances of [[NFormRecordRef]] and keys are the full static paths of the
   * [[NFormRecordRef]] instance they refer to.
   */
  readonly records: { [path: string]: NFormRecordRef };

  /**
   * When true, this event is the root update / redraw event.
   * When false, this event is the result of a root update event OR an update / redraw event was fired before the root
   * completed.
   */
  readonly isRoot: boolean;

  constructor(records: { [path: string]: NFormRecordRef }, private notify: (done: Promise<void>) => void, isRoot?: boolean) {
    this.records = records;
    this.isRoot = !!isRoot;
  }

  /**
   * Mark this render operation as asynchronous, providing a notifier to signal when the rendering can
   * proceed.
   *
   * For example, when a render record of type select requires the options of the select to be
   * fetched from a remote server.
   *
   * @param done
   */
  async(done: Promise<void> | Observable<void>): void {
    if (isObservable<void>(done)) {
      this.notify(done.toPromise());
    } else if (typeof done['then'] === 'function') {
      this.notify(done);
    } else {
      throw new Error('Invalid input');
    }
    Object.defineProperty(this, 'async', { value: asyncUsed });
  }
}
