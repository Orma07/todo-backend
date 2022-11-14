import {dataSource} from "./core/domain/todo-data-source";
import {Todo} from "./core/domain/model/todo";
import {APIGatewayProxyEvent} from "aws-lambda";


export const deleteById = async (event: APIGatewayProxyEvent)=> {
    return dataSource.delete(event.pathParameters?.id)
}

export const getAll = async (event: APIGatewayProxyEvent) => {
    return dataSource.all(event.queryStringParameters?.author)
}

export const put = async (event: APIGatewayProxyEvent) => {
    return dataSource.put(JSON.parse(event.body ?? '{}') as Todo)
}

export const update = async (event: APIGatewayProxyEvent) => {
    return dataSource.update(JSON.parse(event.body ?? '{}') as Todo)
}
