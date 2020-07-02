/**
 * CellUtil.ts
 * 2020-07-02作成
 */
import {StringUtil} from "./StringUtil";

export class CellUtil {
    static setColor(colorCode: string){
        if (!StringUtil.isColorCode(colorCode)) {
            throw new Error("カラーコードを指定してください。");
        }

    }
}

