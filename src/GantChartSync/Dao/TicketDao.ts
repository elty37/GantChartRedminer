import {RedmineSuperDao} from "./RedmineSuperDao";
import {RedmineTicket} from "../Entity/RedmineTicket";

export class TicketDao extends RedmineSuperDao {
    /**
     * チケットIDを指定してチケットを取得
     * @param id チケットID
     * @return Array 指定したチケット
     */
    public getById(id: number) {
        let conditions:any = {"issue_id": id};
        return this.connection.getRedmineTickets(conditions);
    }

    /**
     * 指定したチケットIDの子チケットを取得
     * @param id 親チケットID
     * @param sort ソート順（なければソートなし）
     * @return Array 子チケット
     */
    public getChildren(id: number, sort: string="") {
        let conditions:any = {"parent_id": id};
        if (sort.length > 0) {
            conditions = {"parent_id": id, "sort": sort};
        }
        return this.connection.getRedmineTickets(conditions);
    }

    /**
     * チケットを登録する
     * @param ticket チケット情報
     * @return 登録したチケット情報
     */
    public postCreate(ticket: RedmineTicket) {
        if (!RedmineTicket) {
            return false;
        }
        return this.connection.createRedmineTicket(ticket);
    }
}
