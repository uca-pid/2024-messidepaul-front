export class Table {
    id: number;
    status: string = '';
    
    constructor(id: number, status: string) {
      this.id = id;
      this.status = status;
    }
}