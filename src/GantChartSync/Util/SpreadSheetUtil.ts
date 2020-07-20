import {StringUtil} from "./StringUtil";
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
/**
 * SpreadSheetUtil.ts
 * 2020-03-20作成
 */
export class SpreadSheetUtil {
  /**
   * シートをコピー
   * @param {String} newSheetName コピーしたシートの名前　名前がないときは「元のシート名のコピー」に
   * @param {String} targetSheetName コピーするシートの名前　名前がないときは現在選択されているシート名
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadSheet 対象スプレッドシート 指定がない場合は現在のスプレッドシート
   * @return {Sheet} コピーしたシート
   */
  static copySheet(
      newSheetName: string = null,
      targetSheetName: string = null,
      spreadSheet: Spreadsheet = null
  )
  {
    if (!StringUtil.isset(newSheetName)) {
      newSheetName = targetSheetName + "のコピー";
    }

    if (!StringUtil.isset(targetSheetName)) {
      targetSheetName = SpreadsheetApp.getActiveSheet().getSheetName();
    }

    if (!spreadSheet) {
      spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    }

    const sheetTemp = spreadSheet.getSheetByName(targetSheetName);
    const copiedSheet = sheetTemp.copyTo(spreadSheet);
    copiedSheet.setName(newSheetName);
    return copiedSheet;
  }
}
