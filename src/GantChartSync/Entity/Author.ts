export class Author {
  public id: string;
  public name: string;

  constructor(id?: string, name?: string) {
    this.id = id === undefined ? null : id;
    this.name = name === undefined ? null : name;
  }
}