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
    static isset(data: any){
        if(data === "" || data === null || data === undefined){
            return false;
        }else{
            return true;
        }
    }
}

