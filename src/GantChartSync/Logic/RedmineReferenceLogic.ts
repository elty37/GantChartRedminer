import {RedmineConnection} from "../Connection/RedmineConnection";

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
    let redmineConnection = new RedmineConnection();
    return redmineConnection.getRedmineTickets(conditions);
  }

  /**
   * 子チケットを取得
   *  @param Int|String parentNumber チケット番号
   *  @return Array<Object> 検索結果(JSON)
   */
  public getChildrensChicketInfo(parentNumber) {
    if (("" + parentNumber).length < 1) {
      return [];
    }
    //ルートチケットの取得
    var conditions = {"parent_id": parentNumber};
    return getRedmineTickets(conditions);
  }

  /**
   * 子チケットから孫チケットを取得
   *  @param  Array<Object> childrenJson 子チケット
   *  @return Array<Object> 検索結果(JSON)
   */
  public getGrandchildrensChicketInfoFromChildrensId(childrenJson) {
    if (childrenJson.issues.length < 1) {
      return [];
    }
    var res = [];
    for (var i = 0; i < childrenJson.issues.length; i++){
      res.push(getChildrensChicketInfo(childrenJson.issues[i].parent.id));
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
  public createHyperLink(url, id, sentence = null) {
    if (!isset(sentence)) {
      sentence = id;
    }
    return '=HYPERLINK("' + url + id + '", "' + sentence + '")'
  }

  public createNewGuntChart(ticketNumber) {
    return copySheet('#' + ticketNumber,"ガントチャート");
  }
}
