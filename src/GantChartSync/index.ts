/**
 * redmineからチケット情報を取得し、プロジェクトのタスクに記載
 * @var {string} chicketNumber チケット番号
 * @var {bool} createAsNewSheet 新しいシートとして作成する
 */
function createTaskFromRedmine(chicketNumber:string, createAsNewSheet:boolean) {
    //ルートチケットの取得
    let resJson = getMainChicketInfo(chicketNumber);
    //子チケットの取得
    let childrenJson = getChildrensChicketInfo(chicketNumber);
    if (childrenJson.length < 1) {
        Browser.msgBox("子チケットがありませんでした。");
    }
    //孫チケットの取得
    let grandchildrenJson = getGrandchildrensChicketInfoFromChildrensId(childrenJson);
    if (grandchildrenJson.length < 1) {
        Browser.msgBox("孫チケットがありませんでした。");
    }
    try {
        let currentIssue = "";
        let redmineTicket = "";
        let sheet = SpreadsheetApp.getActiveSheet();
        if (createAsNewSheet) {
            let newSheetIndex = sheet.getIndex() + 1;
            sheet = createNewGuntChart(chicketNumber, newSheetIndex);
        } else {
            sheet = SpreadsheetApp.getActiveSheet();
        }
        setTitle(sheet, resJson.issues[0]);
        for (let i = 0; i < childrenJson.issues.length; i++) {
            currentIssue = childrenJson.issues[i];
            redmineTicket = createRedmineChicketFromRequest(currentIssue);
            setValueOfCellFromRequest(url, sheet, i + 11, redmineTicket);
        }

    } catch(e) {
        Browser.msgBox("エラー：" + e);
    }
}

/**
 *
 * @param url
 * @param sheet
 * @param rowNumber
 * @param redmineChicket
 */
function setValueOfCellFromRequest(url:string, sheet:any, rowNumber:number, redmineChicket:any) {
    var chicketUrl = url + "/issues/";
    var hyperLink = createHyperLink(chicketUrl, redmineChicket.id);
    sheet.getRange(rowNumber, 2).setFormula(hyperLink);
    sheet.getRange(rowNumber, 3).setValue(redmineChicket.subject);
    sheet.getRange(rowNumber, 4).setValue(redmineChicket.author.name);
    sheet.getRange(rowNumber, 5).setValue(redmineChicket.start_date);
    sheet.getRange(rowNumber, 6).setValue(redmineChicket.due_date);
    sheet.getRange(rowNumber, 7).setValue(redmineChicket.estimated_hours);
    sheet.getRange(rowNumber, 8).setValue(redmineChicket.done_ratio * 0.01);
}

/**
 * ガントチャート上のタスクごとにチケットのタイトル表示
 * @param sheet
 * @param titleTicket
 */
function setTitle(sheet:any, titleTicket:any) {
    let ticketUrl = getUrl() + "/issues/";
    let hyperLink = createHyperLink(ticketUrl, titleTicket.id, titleTicket.subject);
    sheet.getRange(2, 2).setFormula(hyperLink);
}

/**
 * ルートチケット指定
 */
function getRootChicket() {
    //入力するメッセージボックス
    var chicketNumber = Browser.inputBox("ルートチケット番号の入力", "表示したいチケット番号を入力してください。", Browser.Buttons.OK_CANCEL);
    if (chicketNumber != "cancel"){
        createTaskFromRedmine(chicketNumber, true);
    }
}

getRootChicket();