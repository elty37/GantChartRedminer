export class Parent {
  public id: string;

  constructor(id?: string) {
    this.id = id === undefined ? null : id;
  }
}