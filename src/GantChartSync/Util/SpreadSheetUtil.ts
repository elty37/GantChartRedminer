/**
 * SpreadSheetUtil.ts
 * 2020-03-20作成
 */
export class SpreadSheetUtil {
  /**
   * シートをコピー
   * @param {String} newSheetName コピーしたシートの名前　名前がないときは「元のシート名のコピー」に
   * @param {String} targetSheetName コピーするシートの名前　名前がないときは現在選択されているシート名
   * @param {SpreadSheet} spreadSheet 対象スプレッドシート 指定がない場合は現在のスプレッドシート
   * @return {Sheet} コピーしたシート
   */
  static copySheet(
      newSheetName: string = null,
      targetSheetName: string = null,
      spreadSheet: any = null)
  {
    if (!isset(spreadSheet)) {
      spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    if (!isset(targetSheetName) || targetSheetName.length < 1) {
      targetSheetName = SpreadsheetApp.getActiveSheet().getSheetName();
    }
    if (!isset(newSheetName) || newSheetName.length < 1) {
      newSheetName = targetSheetName + "のコピー";
    }
    var sheetTemp = spreadSheet.getSheetByName(targetSheetName);
    var copiedSheet = sheetTemp.copyTo(spreadSheet);
    copiedSheet.setName(newSheetName);
    return copiedSheet;
  }
}


