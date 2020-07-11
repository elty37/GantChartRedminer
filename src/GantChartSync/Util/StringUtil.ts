/**
 * StringUtil.ts
 * 2020-03-20作成
 */

export class StringUtil {
    /**
     *  値の有無をチェック
     *  phpのisset()に相当
     *  @ref https://qiita.com/Evolutor_web/items/ffe5af0454f3743b4e43
     *  @param  data    値
     *  @return         true / false
     *
     */
    static isset(data: string){
        if(data === "" || data === null || data === undefined){
            return false;
        }else{
            return true;
        }
    }

    /**
     * カラーコードチェック
     * @param colorCode
     * @return boolean カラーコードならtrue,違うならfalse
     */
    static isColorCode(colorCode: string) {
        const re = new RegExp('^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$');
        return re.test(colorCode);
    }

    /**
     * セルのレンジ指定チェック
     * @param rangeCode
     * @return boolean セルのレンジ表現ならtrue,違うならfalse
     */
    static isRange(rangeCode: string) {
        const rangeArray = rangeCode.split(":");
        if (rangeArray.length !== 2) {
            return false;
        }
        const isNum = new RegExp('[0-9]+');
        const isAlpha = new RegExp('[A-Z]+');
        const isAlphaAndNum = new RegExp('^[A-Z]+[0-9]+');

        if (isAlphaAndNum.test(rangeArray[0]) && isAlphaAndNum.test(rangeArray[1])) {
            return true;
        }
        if (isAlpha.test(rangeArray[0]) && isAlpha.test(rangeArray[1])) {
            return true;
        }
        return isNum.test(rangeArray[0]) && isNum.test(rangeArray[1]);
    }
}

