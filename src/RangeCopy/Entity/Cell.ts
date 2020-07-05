import { PositionType } from "./PositionType";

/**
 * シートのセルの基本クラス
 * 位置情報として、相対参照と絶対参照を持つ
 * 相対参照の場合は、相対元となる値が必須.
 * 相対元の値がシート状で複数回現れる場合は、何番目に現れるのかをindexに指定.
 * 相対元の値の検索は行ごとに1行目から行う.
 * @class Cell
 */
export class Cell {
    public x: number;
    public y: number;
    public positionType: PositionType;
    public label: string;
    public index: number;
    constructor(
        x: number,
        y: number,
        position?: string,
        label?: string,
        index?: number
    ) {
        this.x = x;
        this.y = y;
        this.positionType = new PositionType(position);
        if (this.positionType.isAbsolute() === true) {
            this.label = "CAN'T USE";
            this.index = -1;
        } else {
            if (label === undefined || label.length === 0) {
                throw new Error(
                    "You must set the label of this value if you want to define the position relatively."
                );
            } else {
                this.label = label;
                this.index = index === undefined ? 0 : index;
            }
        }
    }
}