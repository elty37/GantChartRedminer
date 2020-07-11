import {Cell} from "./Entity/Cell";
import {PositionType} from "./Entity/PositionType";

function read(cell: Cell) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("copy_sheet");
    let dataList = sheet.getRange("A1:Z100").getValues();
    if (cell.positionType.isAbsolute()) {
        return dataList[cell.y][cell.x] + cell.index.toString();
    }
    let index = 0;
    let currentY = 0;
    let currentX = 0;
    for (const line of dataList) {
        for (const value of line) {
            if (value === cell.label) {
                if (index === cell.index) {
                    return (
                        dataList[currentY + cell.y][currentX + cell.x]
                    );
                }
                index++;
            }
            currentX++;
        }
        currentX = 0;
        currentY++;
    }
    throw new Error(cell.label + "is not found.");
}

/**
 * 縦列で取得
 * @param cell
 */
function readCol(cell: Cell) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("copy_sheet");
    let dataList = sheet.getRange("A1:Z100").getValues();
    if (cell.positionType.isAbsolute()) {
        return dataList[cell.y][cell.x] + cell.index.toString();
    }
    let index = 0;
    let x = cell.x;
    let y = cell.y;
    const res: string[] = [];
    if (cell.positionType.isRelative()) {
        const relativePosition = getRelativePosition(cell, dataList);
        if (relativePosition === false) {
            throw new Error(cell.label + " is not found.")
        }
        y = relativePosition.y;
        x = relativePosition.x;
    }

    for (let i = y; i < dataList.length; i++) {
        if (typeof dataList[i][x] !== "undefined") {
            res[i - y] = dataList[i][x];
        } else {
            res[i - y] = "";
        }
    }
    return res;
}

function getRelativePosition(cell: Cell, dataList: any) {
    let index = 0;
    let currentY = 0;
    let currentX = 0;
    const res: Cell = new Cell(-1, -1);
    for (const line of dataList) {
        for (const value of line) {
            if (value === cell.label) {
                if (index === cell.index) {
                    res.x = currentX + cell.x;
                    res.y = currentY + cell.y;
                    return res;
                }
                index++;
            }
            currentX++;
        }
        currentX = 0;
        currentY++;
    }
    return false;
}

/**
 * main
 */
function getSheetInfo() {
    const fromCol = readCol(new Cell(0,1, PositionType.RELATIVE, "from"));
    const fromSheet = SpreadsheetApp.getActiveSheet();

    let toCol:any = readCol(new Cell(0,1, PositionType.RELATIVE, "to"));
    const toSheetId = read(new Cell(1,0, PositionType.RELATIVE, "sheetId"));
    const toSheetName = read(new Cell(1,0, PositionType.RELATIVE, "シート名"));
    const toBook = SpreadsheetApp.openById(toSheetId);
    const toSheet = toBook.getSheetByName(toSheetName);

    let tmpRange:string = "";
    for (let i = 0; i < toCol.length; i++) {
        if (toCol[i] === "same") {
            toCol[i] = fromCol[i];
        }
        toSheet.getRange(toCol[i]).setValues(fromSheet.getRange(fromCol[i]).getValues());
    }
}

getSheetInfo();
