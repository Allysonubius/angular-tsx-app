import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Item } from '../interface/item';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private dataService: DataService) { }

  items: Item[] = [];
  filter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 15;
  loading: boolean = true;

  ngOnInit(): void {
    this.dataService.getItems().subscribe(data => {
      this.items = data;
      this.loading = false;
    });
  }

  filteredItems() {
    const filtered = this.items.filter(item =>
      item.nome.toLowerCase().includes(this.filter.toLowerCase()) ||
      item.data.toLowerCase().includes(this.filter.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  removeItem(index: number) {
    const actualIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    this.items[actualIndex].loading = true;
    setTimeout(() => {
      this.items.splice(actualIndex, 1);
    }, 2000); // Simula remoção após 2 segundos
  }

  get totalPages() {
    return Math.ceil(
      this.items.filter(item =>
        item.nome.toLowerCase().includes(this.filter.toLowerCase())
      ).length / this.itemsPerPage
    );
  }

  get visiblePages() {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
