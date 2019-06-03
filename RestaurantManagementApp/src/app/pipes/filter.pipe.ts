import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(foodItems: any, term: any): any {
    if (term === undefined) {
      return foodItems;
    }
    return foodItems.filter(function (foodItem) {
      return (foodItem.Name.toLowerCase() + foodItem.SerialNumber.toLowerCase() )
        .includes(term.toLowerCase());
    })
  }

}
