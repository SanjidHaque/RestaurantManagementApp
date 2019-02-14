import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, filterString: string, itemName: string): any {
    if (filterString === '' ) {
      return value;
    }

    const resultArray = [];
    for (const item of value) {
     if (item[itemName] === filterString) {
        resultArray.push(item);
     }
   }
    return resultArray;
  }

}
