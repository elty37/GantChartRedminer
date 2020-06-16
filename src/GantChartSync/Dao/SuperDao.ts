import {Connection} from "../Connection/Connection";

export class SuperDao {

    public connection: Connection;

    constructor(connection?: any) {
        this.connection = connection === undefined ? null : connection;
    }

}

