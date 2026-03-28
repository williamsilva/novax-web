import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskDocument',
  standalone: true,
})
export class MaskDocumentPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // Verifica se o valor não é nulo e é uma string
    if (value != null && typeof value === 'string') {
      const document = value.replace(/[-.*+?^${}()|[\]\\]/g, '');

      if (document.length === 11) {
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d)/g, '$1.$2.$3-$4');
      }

      if (document.length === 14) {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/g, '$1.$2.$3/$4-$5');
      }
    }
    // Retorna o valor original se não for uma string válida
    return value;
  }
}
