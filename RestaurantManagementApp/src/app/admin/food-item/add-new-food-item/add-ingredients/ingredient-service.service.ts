import { Injectable } from '@angular/core';
import { Uuid } from 'ng2-uuid';

@Injectable()
export class IngredientServiceService {

  uuidCodeOne = '';

  constructor(private uuid: Uuid,
  ) { this.uuidCodeOne = this.uuid.v1(); }

}
