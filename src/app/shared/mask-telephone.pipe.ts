import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskTelephone',
    standalone: true,
})
export class MaskTelephonePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      let telephone = value.replace(/[-.*+?^${}()|[\]\\]/g, '');
      telephone = telephone.replaceAll(' ', '');

      if (telephone.length === 10) {
        return value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      }

      if (telephone.length === 11) {
        return value.replace(/^(\d\d)(\d{1})(\d{0,4})(\d{0,4}).*/, '($1) $2 $3-$4');
      }
    }

    return value;
  }
}
