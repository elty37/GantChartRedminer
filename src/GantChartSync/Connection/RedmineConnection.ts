import {Connection} from "./Connection";
import {StringUtil} from "../Util/StringUtil";

export class RedmineConnection extends Connection {
    /**
     * constructor
     * @param url
     */
    constructor(url?: string) {
        if (typeof url === "undefined") {
            url = "https://49.212.209.129";
        }
        super(url);
    }

    /**
     *  redmine APIで検索APIを実行
     *  @param conditions 検索条件
     *  @return Array 取得したチケット情報JSONの配列
     *  @throws Error 受信できないときや受信データにエラーがある場合はエラーを返す
     */
    public getRedmineTickets(conditions: any) {
        Logger.log("[検索条件]" + JSON.stringify(conditions));
        // URL生成
        let url = this.url + "/issues.json?";
        Object.keys(conditions).forEach( function(value) {
            url = url + value + '=' + this[value] + "&" ;
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
            Logger.log("[受信成功]" + resStr);
            resJson = JSON.parse(resStr);
            if (StringUtil.isset(resJson.errors)) {
                throw new Error("取得条件が不正です。");
            }
        } catch(e) {
            Browser.msgBox("エラー：" + e);
        }
        return resJson;
    }

    /**
     *  redmine APIでチケット作成APIを実行
     *  @param ticket チケット情報
     *  @return Array 取得したチケット情報JSONの配列
     *  @throws Error 受信できないときや受信データにエラーがある場合はエラーを返す
     */
    public createRedmineTicket(ticket: any) {
        Logger.log("[登録情報]" + JSON.stringify(ticket));
        // URL生成
        let url = this.url + "/issues.json?";
        Object.keys(ticket).forEach( function(value) {
            url = url + value + '=' + this[value] + "&" ;
        }, ticket);

        // header情報（とりあえず固定）
        let headers = { 'X-Redmine-API-Key' : '8b5f2357309c516ccc5b69e00032e083f0fe9d09' };

        // urlfetchappのオプション情報
        let options: any = {
            "method" : "POST",
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
            Logger.log("[受信成功]" + resStr);
            resJson = JSON.parse(resStr);
            if (StringUtil.isset(resJson.errors)) {
                throw new Error("取得条件が不正です。");
            }
        } catch(e) {
            Browser.msgBox("エラー：" + e);
        }
        return resJson;
    }

}
