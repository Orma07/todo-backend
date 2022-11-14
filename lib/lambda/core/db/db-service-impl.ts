import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Todo } from "../domain/model/todo";
import {v4 as uuidv4} from "uuid";
import {ScanInput} from "aws-sdk/clients/dynamodb";
import {DbService} from "../domain/db-service";

class DbServiceImpl implements DbService {
    protected db: DocumentClient;
    protected tableName: string;

    constructor(db: DocumentClient, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    async put(todo: Todo) {
        let item = {
            id: uuidv4(),
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            author: todo.author,
            done: todo.done
        }
        const params = {
            TableName: this.tableName,
            Item: item,
        };
        const result = await this.db.put(params).promise()
        if (result.$response.error) {
            throw Error(result.$response.error.code + ": " + result.$response.error.message)
        } else {
            return item
        }
    };

    async update(todo: Todo) {
        const params = {
            TableName: this.tableName,
            Key: {
                id: todo.id,
            },
            UpdateExpression: "set #t=:t, #de=:de, #duda=:duda, #do=:do",
            ExpressionAttributeNames: {
                "#t": "title",
                "#de": "description",
                "#duda": "dueDate",
                "#do": "done",
            },
            ExpressionAttributeValues: {
                ":t": todo.title,
                ":de": todo.description,
                ":duda": todo.dueDate,
                ":do": todo.done,
            },
        };
        const result = await this.db.update(params).promise();
        if (result.$response.error) {
            throw Error(result.$response.error.code + ": " + result.$response.error.message)
        }
        return
    }

    async get(id: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                id,
            },
        };

        const result = await this.db.get(params).promise();
        return result.Item as Todo;
    }

    async delete(id: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                id,
            },
            ReturnValues: "ALL_OLD",
        };

        const result = await this.db.delete(params).promise();
        if (result.$response.error) {
            throw Error(result.$response.error.code + ": " + result.$response.error.message)
        }
        return
    }

    async all(author: string) {
        const params: ScanInput = {
            TableName: this.tableName,
        };

        const data = await this.db.scan(params).promise();
        if (data.Items != undefined)
            return data.Items.map((item) => item as Todo).filter((item) => item.author == author);
        else
            return []
    }
}

function initDynamoDB() {
    const region = process.env.REGION;
    config.update({region});
    return new DynamoDB.DocumentClient({apiVersion: "2022-11-09"});
}

import {config, DynamoDB} from "aws-sdk";

const dynamo = initDynamoDB();

export let dbService: DbService = new DbServiceImpl(dynamo, process.env.TODO_TABLE_NAME!);