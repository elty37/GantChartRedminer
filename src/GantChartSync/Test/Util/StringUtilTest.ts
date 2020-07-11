import { StringUtil } from '../../Util/StringUtil';

describe('StringUtilのテスト', () => {
    it('isset正常系', () => {
        const response = StringUtil.isset("hoge");
        expect(response).toBe(true);
    })
    it('isset正常系(NULLの場合)', () => {
        const response = StringUtil.isset(null);
        expect(response).toBe(false);
    })
    it('isset正常系(undefinedの場合)', () => {
        let a;
        const response = StringUtil.isset(a);
        expect(response).toBe(false);
    })
    it('isset正常系(空文字の場合)', () => {
        const a = "";
        const response = StringUtil.isset(a);
        expect(response).toBe(false);
    })
});