export class HistoryEntry {
  constructor(
    public id: string | undefined,
    public userId: string,
    public word: string,
    public added: Date
  ) {}
}
