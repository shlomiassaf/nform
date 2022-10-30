import { Observable, from, of } from 'rxjs';

import { SearchResults } from '../models';
import { SearchAdapter } from './adapter';

export class WindowSearchAdapter implements SearchAdapter {
  private searchEngine: import('../search-engine').SearchEngine;

  loadIndex(searchContent: string): Observable<boolean> {
    const p = import('../search-engine')
      .then( searchEngine => {
        this.searchEngine = new searchEngine.SearchEngine(searchContent);
        return this.searchEngine.loadIndex();
      });
    return from(p);
  };

  queryIndex(query: string): Observable<SearchResults> { return of({ query, results: this.searchEngine.queryIndex(query) }); }

  dispose(): void { }
}

export default WindowSearchAdapter;
