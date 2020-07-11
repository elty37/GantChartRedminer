/**
 * Redmineアクセス用基底クラス
 * 2020-07-03作成
 */

import {SuperDaoInterface} from "./SuperDaoInterface";
import {RedmineConnection} from "../Connection/RedmineConnection";

export class RedmineSuperDao implements SuperDaoInterface{

    public connection: RedmineConnection;

    constructor(connection?: RedmineConnection) {
        this.connection = connection === undefined ? new RedmineConnection() : connection;
    }
}

