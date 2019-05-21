export class Table {
  public Id: number;
  public Name: string;
  public CurrentState: string;

  constructor(id: number,
              name: string,
              currentState: string
  ) {
    this.Id = id;
    this.Name = name;
    this.CurrentState = currentState;
  }
 }
