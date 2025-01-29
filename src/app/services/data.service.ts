import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getItems() {
    const items = Array.from({ length: 10000 }, (_, i) => ({
      nome: `Item ${i + 1}`,
      data: `2025-01-${(i % 31 + 1).toString().padStart(2, '0')}`,
      loading: false
    }));
    return of(items).pipe(delay(5000)); // Simula carregamento de 5 segundos
  }
}
