import {RedmineConnection} from "../Connection/RedmineConnection";
import {StringUtil} from "../Util/StringUtil";
import {SpreadSheetUtil} from "../Util/SpreadSheetUtil";
import {TicketDao} from "../Dao/TicketDao";
import {SuperLogic} from "./SuperLogic";
import {Messages} from "../Config/lang/ja";
import {RedmineTicket} from "../Entity/RedmineTicket";

export class RedmineUpdateLogic extends SuperLogic {

  /**
   * チケットを登録する
   * @param ticket チケット情報
   */
  public createTicket(ticket: RedmineTicket) {
    if (!ticket) {
      throw new Error(Messages.util_error_ticket_is_empty);
    }
    const ticketDao = new TicketDao();
    return ticketDao.postCreate(ticket);

  }
}
