/**
 * 位置種別クラス
 * relativeかabsoluteの二値のみ保持する。
 * Cellクラスで位置判定をするためのValue object
 * @class PositionType
 */
export class PositionType {
    public position: string;
    public static readonly RELATIVE: string = "relative";
    public static readonly ABSOLUTE: string = "absolute";

    constructor(position?: string) {
        if (
            position === PositionType.RELATIVE ||
            position === PositionType.ABSOLUTE
        ) {
            this.position = position;
        } else {
            this.position = PositionType.ABSOLUTE;
        }
    }
    isRelative() {
        return this.position === PositionType.RELATIVE;
    }
    isAbsolute() {
        return this.position === PositionType.ABSOLUTE;
    }
}