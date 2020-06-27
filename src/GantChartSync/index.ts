import {RedmineReferenceLogic} from "./Logic/RedmineReferenceLogic";
import {RedmineTicket} from "./Entity/RedmineTicket";
import {RedmineConnection} from "./Connection/RedmineConnection";

/**
 * redmineからチケット情報を取得し、プロジェクトのタスクに記載
 *
 * @param {string} chicketNumber
 * @param {boolean} createAsNewSheet
 */
function createTaskFromRedmine(chicketNumber:string, createAsNewSheet:boolean) {
    //ルートチケットの取得
    const redmineReferenceLogic = new RedmineReferenceLogic();
    let resJson = redmineReferenceLogic.getMainChicketInfo(chicketNumber);
    //子チケットの取得
    let childrenJson = redmineReferenceLogic.getChildrensChicketInfo(parseInt(chicketNumber));
    if (childrenJson.length < 1) {
        Browser.msgBox("子チケットがありませんでした。");
    }
    //孫チケットの取得
    let grandchildrenJson = redmineReferenceLogic.getGrandchildrensChicketInfoFromChildrensId(childrenJson);
    if (grandchildrenJson.length < 1) {
        Browser.msgBox("孫チケットがありませんでした。");
    }
    try {
        let currentIssue = "";
        let redmineTicket = "";
        let sheet = SpreadsheetApp.getActiveSheet();
        const redmineConnection = new RedmineConnection();
        if (createAsNewSheet) {
            let newSheetIndex = sheet.getIndex() + 1;
            sheet = redmineReferenceLogic.createNewGuntChart(chicketNumber);
        } else {
            sheet = SpreadsheetApp.getActiveSheet();
        }

        setTitle(sheet, resJson.issues[0], redmineConnection.url);
        let ticket: RedmineTicket = new RedmineTicket();
        for (let i = 0; i < childrenJson.issues.length; i++) {
            currentIssue = childrenJson.issues[i];
            ticket.createRedmineChicketFromRequest(currentIssue);
            setValueOfCellFromRequest(redmineConnection.url, sheet, i + 11, ticket);
            ticket = new RedmineTicket();
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
function getRootChicket() {
    //入力するメッセージボックス
    var chicketNumber = Browser.inputBox("ルートチケット番号の入力", "表示したいチケット番号を入力してください。", Browser.Buttons.OK_CANCEL);
    if (chicketNumber != "cancel"){
        createTaskFromRedmine(chicketNumber, true);
    }
}

getRootChicket();
