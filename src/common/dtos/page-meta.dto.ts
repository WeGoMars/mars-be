// common/dto/page-meta.dto.ts
export class PageMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;

  constructor(partial: Partial<PageMeta>) {
    Object.assign(this, partial);
  }
}
