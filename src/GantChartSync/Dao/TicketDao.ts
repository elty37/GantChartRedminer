import {SuperDao} from "./SuperDao";

export class TicketDao extends SuperDao {
    /**
     *  redmine APIで検索APIを実行
     *  @param conditions 検索条件
     *  @return Array 取得したチケット情報JSONの配列
     *  @throws Error 受信できないときや受信データにエラーがある場合はエラーを返す
     */
    public getRedmineTickets(conditions: any) {
        // URL生成
        let url = this.url + "/issues.json?";
        Object.keys(conditions).forEach( function(value) {
            url = url + value + '=' + this[value] ;
        }, conditions);

        // header情報（とりあえず固定）
        let headers = { 'X-Redmine-API-Key' : '8b5f2357309c516ccc5b69e00032e083f0fe9d09' };

        // urlfetchappのオプション情報
        let options: any = {
            "method" : "GET",
            "headers" : headers,     // header情報を追加
            "muteHttpExceptions" : true,
            "validateHttpsCertificates" : false // SSLエラー回避
        };

        let resJson = null;
        try {
            // 外部へアクセスさせる
            let resStr = UrlFetchApp.fetch(url, options).getContentText();
            if (resStr.length === 0) {
                throw new Error("受信データがありませんでした。");
            }
            resJson = JSON.parse(resStr);
            if (isset(resJson.errors)) {
                throw new Error("取得条件が不正です。");
            }
        } catch(e) {
            Browser.msgBox("エラー：" + e);
        }
        return resJson;
    }
}

