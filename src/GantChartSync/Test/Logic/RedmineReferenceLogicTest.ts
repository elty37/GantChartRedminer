import { RedmineReferenceLogic } from '../../Logic/RedmineReferenceLogic';

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
        expect(() => {redmineReferenceLogic.createHyperLink(url, id)}).toThrowError("url is empty!");
    })

    it('createHyperLink異常系(id is null)', () => {
        const redmineReferenceLogic = new RedmineReferenceLogic()
        let url = 'https://www.google.com/?hl=ja';
        let id = null;
        const response = redmineReferenceLogic.createHyperLink(url, id);
        expect(response).toBe("");
    })

});