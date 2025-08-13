export class User {
  constructor(
    public id: string | undefined,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date
  ) {}
}
