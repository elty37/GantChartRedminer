function showMenu() {
    let html = HtmlService.createHtmlOutputFromFile("GantChartSync_Menu");
    SpreadsheetApp.getUi().showModalDialog(html, "redmine同期");
}
showMenu();