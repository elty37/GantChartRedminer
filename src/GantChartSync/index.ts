import {RedmineReferenceLogic} from "./Logic/RedmineReferenceLogic";
import {RedmineTicket} from "./Entity/RedmineTicket";
import {RedmineConnection} from "./Connection/RedmineConnection";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {RangeUtil} from "./Util/RangeUtil";

/**
 * redmineからチケット情報を取得し、プロジェクトのタスクに記載
 *
 * @param {string} ticketNumber
 * @param {boolean} createAsNewSheet
 */
function createTaskFromRedmine(ticketNumber:string, createAsNewSheet:boolean) {
    const redmineReferenceLogic = new RedmineReferenceLogic();
    let sheet;
    if (createAsNewSheet) {
        sheet = redmineReferenceLogic.createNewGuntChart(ticketNumber);
    } else {
        sheet = SpreadsheetApp.getActiveSheet();
    }

    //ルートチケットの取得
    let resJson = redmineReferenceLogic.getMainTicketInfo(parseInt(ticketNumber));
    //子チケットの取得
    let childrenJson = redmineReferenceLogic.getChildrenTicketInfo(parseInt(ticketNumber));
    if (childrenJson.length < 1) {
        Browser.msgBox("子チケットがありませんでした。");
    }
    //孫チケットの取得
    let grandchildrenJson = redmineReferenceLogic.getGrandchildrenTicketInfoFromChildrenId(childrenJson);
    if (grandchildrenJson.length < 1) {
        Browser.msgBox("孫チケットがありませんでした。");
        return;
    }
    try {
        let currentIssue = null;
        let currentChildrenIssues = [];
        const redmineConnection = new RedmineConnection();
        const baseTicket = new RedmineTicket();
        baseTicket.createRedmineTicketFromRequest(resJson.issues[0]);

        setTitle(sheet, baseTicket, redmineConnection.url);
        setDate(sheet, baseTicket);
        let ticket: RedmineTicket = new RedmineTicket();
        let currentChildTicket: RedmineTicket = new RedmineTicket();
        let rowNumber = 11;
        if (!("issues" in childrenJson)) {
            Browser.msgBox("孫チケットがありませんでした。");
            return;
        }
        for (let i = 0; i < childrenJson.issues.length; i++) {
            currentIssue = childrenJson.issues[i];
            currentChildrenIssues = grandchildrenJson[i].issues;
            ticket.createRedmineTicketFromRequest(currentIssue);
            setChildStyle(sheet,rowNumber);
            setValueOfCellFromRequest(redmineConnection.url, sheet, rowNumber, ticket);
            rowNumber++;
            Logger.log("[debug]" + JSON.stringify(currentChildrenIssues));
            for (let j = 0; j < currentChildrenIssues.length; j++) {
                if (currentChildrenIssues[j].parent.id === ticket.id) {
                    currentChildTicket.createRedmineTicketFromRequest(currentChildrenIssues[j]);
                    Logger.log(JSON.stringify(currentChildTicket));
                    setValueOfCellFromRequest(redmineConnection.url, sheet, rowNumber, currentChildTicket);
                    rowNumber++;
                    currentChildTicket = new RedmineTicket();
                }
            }
            ticket = new RedmineTicket();
            currentChildTicket = new RedmineTicket();
        }

    } catch(e) {
        Browser.msgBox("エラー：" + e);
    }
}

/**
 * ガントチャート情報を元にチケットを更新する
 */
function updateTicketFromGantChart() {

}


/**
 * 引数を元に、タスク行を生成する
 *
 * @param {string} url redmineのurl
 * @param {Sheet} sheet 出力するシート
 * @param {number} rowNumber 出力する行
 * @param {RedmineTicket} redmineTicket 出力するタスクに対応するRedmineチケット
 */
function setValueOfCellFromRequest(url:string, sheet:Sheet, rowNumber:number, redmineTicket:RedmineTicket) {
    const redmineReferenceLogic = new RedmineReferenceLogic();
    var chicketUrl = url + "/issues/";
    var hyperLink = redmineReferenceLogic.createHyperLink(chicketUrl, redmineTicket.id);
    sheet.getRange(rowNumber, 2).setFormula(hyperLink);
    sheet.getRange(rowNumber, 3).setValue(redmineTicket.subject);
    sheet.getRange(rowNumber, 4).setValue(redmineTicket.author.name);
    sheet.getRange(rowNumber, 5).setValue(redmineTicket.startDate);
    sheet.getRange(rowNumber, 6).setValue(redmineTicket.dueDate);
    sheet.getRange(rowNumber, 7).setValue(redmineTicket.estimatedHours);
    sheet.getRange(rowNumber, 8).setValue(Number(redmineTicket.doneRatio) * 0.01);
}

/**
 * 中タスクのスタイルをセルに適応
 * @param sheet
 * @param rowNumber
 */
function setChildStyle(sheet: Sheet, rowNumber: number) {
    const rangeStart="B";
    const rangeEnd="BP";
    const range = sheet.getRange(rangeStart + rowNumber.toString() + ":" + rangeEnd + rowNumber.toString());
    RangeUtil.setColor(range, "#cccccc");
}

/**
 * ガントチャート上の日付セルを設定
 *
 * @param {Object} sheet
 * @param {RedmineTicket} titleTicket
 */
function setDate(sheet:any, titleTicket:RedmineTicket) {
    const startDate = new Date(titleTicket.startDate);
    const endDate = new Date(titleTicket.dueDate);
    let day = startDate.getDate();
    let month = startDate.getMonth() + 1;
    let dayOfWeek = startDate.getDay() - 1;	// 曜日(数値)
    let cellOfWeekDay = 0;
    const termDay = (+(endDate) - +(startDate)) / 86400000;
    for (let i = 0; i <= termDay; i++) {
        dayOfWeek++;
        day = startDate.getDate();
        startDate.setDate(startDate.getDate() + 1);
        if (dayOfWeek % 7 < 1 || dayOfWeek % 7 > 5) {
            continue;
        }
        if (startDate.getMonth() === month) {
            month = startDate.getMonth() + 1;
        }
        sheet.getRange(8, 9 + cellOfWeekDay).setValue(month);
        sheet.getRange(9, 9 + cellOfWeekDay).setValue(day);
        sheet.getRange(10, 9 + cellOfWeekDay).setValue([ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek % 7]);
        cellOfWeekDay++;
    }
}

/**
 * ガントチャート上のタスクごとにチケットのタイトル表示
 *
 * @param {Object} sheet
 * @param {RedmineTicket} titleTicket
 * @param {string} url
 */
function setTitle(sheet:any, titleTicket:RedmineTicket, url:string) {
    let ticketUrl = url + "/issues/";
    const logic = new RedmineReferenceLogic();
    let hyperLink = logic.createHyperLink(ticketUrl, titleTicket.id, titleTicket.subject);
    sheet.getRange(2, 2).setFormula(hyperLink);
}

function frontController() {
    const actionId = PropertiesService.getScriptProperties().getProperty("action");
    switch (actionId) {
        case "1":
            const ticketNumber = PropertiesService.getScriptProperties().getProperty("ticketNumber");
            createTaskFromRedmine(ticketNumber, true);
            break;
        case "2":
            break;
        default:
            Logger.log("invalid actionId -" + actionId);
    }
}

frontController();