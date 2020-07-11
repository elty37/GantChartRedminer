import {RedmineSuperDao} from "./RedmineSuperDao";

export class TicketDao extends RedmineSuperDao {
    /**
     * チケットIDを指定してチケットを取得
     * @param id チケットID
     * @return Array 指定したチケット
     */
    public getById(id: number) {
        let conditions = {"issue_id": id};
        return this.connection.getRedmineTickets(conditions);
    }

    /**
     * 指定したチケットIDの子チケットを取得
     * @param id 親チケットID
     * @return Array 子チケット
     */
    public getChildren(id: number) {
        let conditions = {"parent_id": id};
        return this.connection.getRedmineTickets(conditions);
    }
}
