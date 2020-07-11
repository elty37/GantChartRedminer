import {RedmineConnection} from "../Connection/RedmineConnection";
import {StringUtil} from "../Util/StringUtil";
import {SpreadSheetUtil} from "../Util/SpreadSheetUtil";
import {TicketDao} from "../Dao/TicketDao";

export class RedmineReferenceLogic {

  /**
   * メインチケット（フォームから入力したチケット）を取得
   *  @param ticketNumber チケット番号
   *  @return Array 検索結果(JSON)
   */
  public getMainTicketInfo(ticketNumber: number) {
    //ルートチケットの取得
    const ticketDao = new TicketDao();
    return ticketDao.getById(ticketNumber);
  }

  /**
   * 子チケットを取得
   *  @param parentNumber チケット番号
   *  @return Array<Object> 検索結果(JSON)
   */
  public getChildrenTicketInfo(parentNumber: number) {
    const ticketDao = new TicketDao();
    return ticketDao.getChildren(parentNumber);
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
    const ticketDao = new TicketDao();
    const res = [];
    for (var i = 0; i < childrenJson.issues.length; i++){
      res.push(ticketDao.getChildren(parseInt(childrenJson.issues[i].id)));
      Utilities.sleep(100);
    }
    return res;
  }

  /**
   *  スプレッドシートのハイパーリンク(チケットURL)を作成
   *
   *  @param url redmineのURL
   *  @param id チケットID
   *  @param sentence リンク表示文字列(未指定の場合はチケットID)
   *  @return String 生成したハイパーリンク関数
   */
  public createHyperLink(url:string, id:string, sentence:string = null) {
    if (!StringUtil.isset(url)) {
      throw new Error("url is empty!");
    }
    if (!StringUtil.isset(id)) {
      throw new Error("id is empty!");
    }
    if (!StringUtil.isset(sentence)) {
      sentence = id;
    }
    return '=HYPERLINK("' + url + id + '", "' + sentence + '")'
  }

  public createNewGuntChart(ticketNumber:string) {
    return SpreadSheetUtil.copySheet('#' + ticketNumber,"ガントチャート");
  }
}
