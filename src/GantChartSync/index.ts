import {RedmineReferenceLogic} from "./Logic/RedmineReferenceLogic";
import {RedmineTicket} from "./Entity/RedmineTicket";
import {RedmineConnection} from "./Connection/RedmineConnection";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {RangeUtil} from "./Util/RangeUtil";

/**
 * redmineからチケット情報を取得し、プロジェクトのタスクに記載
 *
 * @param {string} chicketNumber
 * @param {boolean} createAsNewSheet
 */
function createTaskFromRedmine(chicketNumber:string, createAsNewSheet:boolean) {
    //ルートチケットの取得
    const redmineReferenceLogic = new RedmineReferenceLogic();
    let resJson = redmineReferenceLogic.getMainTicketInfo(parseInt(chicketNumber));
    //子チケットの取得
    let childrenJson = redmineReferenceLogic.getChildrenTicketInfo(parseInt(chicketNumber));
    if (childrenJson.length < 1) {
        Browser.msgBox("子チケットがありませんでした。");
    }
    //孫チケットの取得
    let grandchildrenJson = redmineReferenceLogic.getGrandchildrenTicketInfoFromChildrenId(childrenJson);
    if (grandchildrenJson.length < 1) {
        Browser.msgBox("孫チケットがありませんでした。");
    }
    try {
        let currentIssue = null;
        let currentChildrenIssues = [];
        let sheet = SpreadsheetApp.getActiveSheet();
        const redmineConnection = new RedmineConnection();
        if (createAsNewSheet) {
            sheet = redmineReferenceLogic.createNewGuntChart(chicketNumber);
        } else {
            sheet = SpreadsheetApp.getActiveSheet();
        }

        setTitle(sheet, resJson.issues[0], redmineConnection.url);
        let ticket: RedmineTicket = new RedmineTicket();
        let currentChildTicket: RedmineTicket = new RedmineTicket();
        let rowNumber = 11;
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
 *
 * @param {string} url
 * @param {Object} sheet
 * @param {number} rowNumber
 * @param {RedmineTicket} redmineTicket
 */
function setValueOfCellFromRequest(url:string, sheet:any, rowNumber:number, redmineTicket:any) {
    const redmineReferenceLogic = new RedmineReferenceLogic();
    var chicketUrl = url + "/issues/";
    var hyperLink = redmineReferenceLogic.createHyperLink(chicketUrl, redmineTicket.id);
    sheet.getRange(rowNumber, 2).setFormula(hyperLink);
    sheet.getRange(rowNumber, 3).setValue(redmineTicket.subject);
    sheet.getRange(rowNumber, 4).setValue(redmineTicket.author.name);
    sheet.getRange(rowNumber, 5).setValue(redmineTicket.startDate);
    sheet.getRange(rowNumber, 6).setValue(redmineTicket.dueDate);
    sheet.getRange(rowNumber, 7).setValue(redmineTicket.estimatedHours);
    sheet.getRange(rowNumber, 8).setValue(redmineTicket.doneRatio * 0.01);
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
    RangeUtil.setColor(range, "#AAAAAA");
}

/**
 * ガントチャート上のタスクごとにチケットのタイトル表示
 *
 * @param {Object} sheet
 * @param {RedmineTicket} titleTicket
 * @param {string} url
 */
function setTitle(sheet:any, titleTicket:any, url:string) {
    let ticketUrl = url + "/issues/";
    const logic = new RedmineReferenceLogic();
    let hyperLink = logic.createHyperLink(ticketUrl, titleTicket.id, titleTicket.subject);
    sheet.getRange(2, 2).setFormula(hyperLink);
}

/**
 * ルートチケット指定
 */
function getRootTicket() {
    //入力するメッセージボックス
    var chicketNumber = Browser.inputBox("ルートチケット番号の入力", "表示したいチケット番号を入力してください。", Browser.Buttons.OK_CANCEL);
    if (chicketNumber != "cancel"){
        createTaskFromRedmine(chicketNumber, true);
    }
}

getRootTicket();
