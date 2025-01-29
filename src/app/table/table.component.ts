import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Item } from '../interface/item';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  constructor(private dataService: DataService) {}

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

  // Filtra os itens com base no filtro
  filteredItems() {
    return this.items.filter(item =>
      item.nome.toLowerCase().includes(this.filter.toLowerCase()) ||
      item.data.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  // Toggle do estado de loading para o item (exibe o spinner)
  toggleLoading(item: Item, index: number) {
    if (item.loading) {
      return;  // Evita que o loading seja alternado se já estiver em carregamento
    }

    item.loading = true;

    // Simula uma ação após um tempo
    setTimeout(() => {
      item.loading = false;  // Finaliza o loading após 2 segundos
      this.removeItem(index);  // Realiza a remoção do item
    }, 2000);  // Ajuste o tempo conforme necessário
  }

  // Remove um item da lista
  removeItem(index: number) {
    const filtered = this.filteredItems(); // Aplica o filtro antes
    const actualIndex = (this.currentPage - 1) * this.itemsPerPage + index;

    // Remove o item apenas se ele estiver visível na página atual
    if (actualIndex < filtered.length) {
      this.items.splice(actualIndex, 1);
    }
  }

  // Total de páginas com base no número de itens filtrados
  get totalPages() {
    const filtered = this.filteredItems();  // Aplica o filtro
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  // Páginas visíveis para navegação
  get visiblePages() {
    const total = this.totalPages;
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(total, this.currentPage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // Navegar entre as páginas
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Exibir intervalo de itens na página atual
  get itemsDisplayRange(): string {
    const filtered = this.filteredItems();  // Aplica o filtro
    const firstItemIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const lastItemIndex = Math.min(firstItemIndex + this.itemsPerPage - 1, filtered.length);
    return `Exibindo ${firstItemIndex} a ${lastItemIndex} de ${filtered.length} itens`;
  }

  // Itens para exibir na página atual (com filtro e paginação)
  get paginatedItems() {
    const filtered = this.filteredItems();  // Aplica o filtro
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(start + this.itemsPerPage, filtered.length);
    return filtered.slice(start, end);
  }
}
