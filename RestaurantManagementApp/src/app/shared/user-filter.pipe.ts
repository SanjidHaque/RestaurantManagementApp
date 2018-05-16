import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(users: any, term: any): any {
    if (term === undefined) {
      return users;
    }
    return users.filter(function (user) {
      return user.UserName.toLowerCase()
        .includes(term.toLowerCase());
    })
  }

}
