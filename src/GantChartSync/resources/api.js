/**
 * チケット番号を取得
 * @param ticketNumber
 * @return {boolean}
 */
function receiveTicketNumber(ticketNumber) {
    Logger.log(ticketNumber);
    if (typeof ticketNumber !== "string") {
        // 文字列型でない場合はエラー
        return false;
    }

    const reg = new RegExp(/^[0-9]*$/);
    if (!reg.test(ticketNumber)) {
        // 数字でないものもエラー
        return false;
    }

    const ticketNumberInteger = Number(ticketNumber);
    if (ticketNumberInteger < 1) {
        // チケット番号は1以上なので1未満はエラー
        return false;
    }

    // 値をプロパティサービスに登録
    PropertiesService.getScriptProperties().setProperties({"ticketNumber":ticketNumber,"action":"1"});
    GantChartSync();
    return true;
}