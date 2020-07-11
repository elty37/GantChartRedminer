/**
 * RangeUtil.ts
 * 2020-07-02作成
 */
import {StringUtil} from "./StringUtil";
import Range = GoogleAppsScript.Spreadsheet.Range;

export class RangeUtil {

    /**
     * 指定したrangeに色を設定する
     *
     * @param range
     * @param colorCode
     */
    static setColor(range: Range, colorCode: string){
        if (!StringUtil.isColorCode(colorCode)) {
            throw new Error("カラーコードを指定してください。");
        }
        range.setBackground(colorCode);
    }
}

