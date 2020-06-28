import {RedmineConnection} from "../Connection/RedmineConnection";
import {StringUtil} from "../Util/StringUtil";
import {SpreadSheetUtil} from "../Util/SpreadSheetUtil";

export class RedmineReferenceLogic {

  /**
   * メインチケット（フォームから入力したチケット）を取得
   *  @param ticketNumber チケット番号
   *  @return Array 検索結果(JSON)
   */
  public getMainChicketInfo(ticketNumber: string) {
    if (ticketNumber.length < 1) {
      return null;
    }
    //ルートチケットの取得
    let conditions = {"issue_id": ticketNumber};
    const redmineConnection = new RedmineConnection();
    return redmineConnection.getRedmineTickets(conditions);
  }

  /**
   * 子チケットを取得
   *  @param parentNumber チケット番号
   *  @return Array<Object> 検索結果(JSON)
   */
  public getChildrenTicketInfo(parentNumber: number) {
    //ルートチケットの取得
    const conditions = {"parent_id": parentNumber};
    const redmineConnection = new RedmineConnection();
    return redmineConnection.getRedmineTickets(conditions);
  }

  /**
   * 子チケットから孫チケットを取得
   *  @param  childrenJson 子チケット
   *  @return Array<Object> 検索結果(JSON)
   */
  public getGrandchildrenTicketInfoFromChildrenId(childrenJson: any) {
    if (childrenJson.issues.length < 1) {
      return [];
    }
    const res = [];
    for (var i = 0; i < childrenJson.issues.length; i++){
      res.push(this.getChildrenTicketInfo(childrenJson.issues[i].id));
      Utilities.sleep(100);
    }
    return res;
  }

  /**
   *  スプレッドシートのハイパーリンク(チケットURL)を作成
   *
   *  @param String url redmineのURL
   *  @param String id チケットID
   *  @param String sentence リンク表示文字列(未指定の場合はチケットID)
   *  @return String 生成したハイパーリンク関数
   */
  public createHyperLink(url:string, id:string, sentence:string = null) {
    if (!StringUtil.isset(sentence)) {
      sentence = id;
    }
    return '=HYPERLINK("' + url + id + '", "' + sentence + '")'
  }

  public createNewGuntChart(ticketNumber:string) {
    return SpreadSheetUtil.copySheet('#' + ticketNumber,"ガントチャート");
  }
}
