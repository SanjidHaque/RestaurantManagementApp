import {SetMenuItems} from './set-menu-items.model';
import {FoodItems} from './food-item.model';

export class SetMenus {
  public Name: string;
  public Price: number;
  public Id: number;
  public SetMenuItems: SetMenuItems;
  public SetMenuImage: string;

  constructor(name: string, price: number, id: number, setMenuItems: SetMenuItems, setMenuImage: string) {
    this.Name = name;
    this.Price = price;
    this.Id = id;
    this.SetMenuItems = setMenuItems;
    this.SetMenuImage = setMenuImage;
  }
}


