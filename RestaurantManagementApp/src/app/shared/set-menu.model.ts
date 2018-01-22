import {SetMenuItems} from './set-menu-items.model';
import {FoodItems} from './food-item.model';

export class SetMenus {
  public Id: string;
  public Name: string;
  public Price: number;
  public SetMenuItems: SetMenuItems;
  public SetMenuImage: string;

  constructor(id: string, name: string, price: number,  setMenuItems: SetMenuItems, setMenuImage: string) {
    this.Id = id;
    this.Name = name;
    this.Price = price;
    this.SetMenuItems = setMenuItems;
    this.SetMenuImage = setMenuImage;
  }
}


