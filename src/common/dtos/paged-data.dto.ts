import { PageMeta } from './page-meta.dto';

export class PagedData<T> {
  items: T[];
  meta: PageMeta;

  constructor(items: T[], meta: PageMeta) {
    this.items = items;
    this.meta = meta;
  }
}