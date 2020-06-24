function onOpen(){

    SpreadsheetApp
        .getActiveSpreadsheet()
        .addMenu(
            "開発",
            JSON.parse('[{"name":"redmine同期","functionName":"GantChartSync"}]')); //メニューを追加

}