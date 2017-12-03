import {SetMenuItems} from './set-menu-items.model';

export class SetMenus {
  public Name: string;
  public Price: number;
  public Id: number;
  public SetMenuItems: SetMenuItems

  constructor(name: string, price: number, id: number, setMenuItems: SetMenuItems) {
    this.Name = name;
    this.Price = price;
    this.Id = id;
    this.SetMenuItems = setMenuItems;
  }
}
