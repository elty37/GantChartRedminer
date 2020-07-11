import { RedmineReferenceLogic } from '../../Logic/RedmineReferenceLogic';
import {Messages} from "../../Config/lang/ja";

describe('StringUtilのテスト', () => {
    it('createHyperLink正常系(sentenceあり)', () => {
        const redmineReferenceLogic = new RedmineReferenceLogic()
        const url = 'https://www.google.com/?hl=ja';
        const id = '120';
        const sentence = 'タスク01';
        const response = redmineReferenceLogic.createHyperLink(url, id, sentence);
        expect(response).toBe("=HYPERLINK(\"" + url + id + "\", \""+ sentence + "\")");
    })

    it('createHyperLink正常系(sentenceなし)', () => {
        const redmineReferenceLogic = new RedmineReferenceLogic()
        const url = 'https://www.google.com/?hl=ja';
        const id = '120';
        const response = redmineReferenceLogic.createHyperLink(url, id);
        expect(response).toBe("=HYPERLINK(\"" + url + id + "\", \""+ id + "\")");
    })

    it('createHyperLink異常系(url is null)', () => {
        const redmineReferenceLogic = new RedmineReferenceLogic()
        let url:string = null;
        let id = "120";
        expect(() => {
            redmineReferenceLogic.createHyperLink(url, id)
        }).toThrowError(Messages.util_error_url_is_empty);
    })

    it('createHyperLink異常系(id is null)', () => {
        const redmineReferenceLogic = new RedmineReferenceLogic()
        let url = 'https://www.google.com/?hl=ja';
        let id:string = null;
        expect(() => {
            redmineReferenceLogic.createHyperLink(url, id)
        }).toThrowError(Messages.util_error_id_is_empty);
    })

});