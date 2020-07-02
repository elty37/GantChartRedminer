import {RedmineSuperDao} from "./RedmineSuperDao";

export class TicketDao extends RedmineSuperDao {
    public getById(id: string) {
        let conditions = {"issue_id": id};
        return this.connection.getRedmineTickets(conditions);
    }
}
