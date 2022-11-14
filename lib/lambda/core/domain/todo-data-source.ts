import {DbService} from "./db-service";
import {isUndefinedOrEmpty} from "../utils/string-extension";
import {Todo} from "./model/todo";
import {dbService} from "../db/db-service-impl";

export class TodoDataSource {
    protected dbService: DbService;

    constructor(service: DbService) {
        this.dbService = service;
    }

    async all(author?: string) {
        if (author == undefined || isUndefinedOrEmpty(author)) {
            return this.badRequestResponse("Author can't be null")
        } else {
            try {
                let todos = await this.dbService.all(author)
                return this.okResponse(todos)
            } catch (error) {
                return this.internalServerError("all", error.message)
            }
        }
    }

    async update(request: Todo) {
        if (request?.author != undefined) {
            return this.badRequestResponse("Author can't be edited")
        } else if (request.id == undefined || isUndefinedOrEmpty(request?.id)) {
            return this.badRequestResponse("Id can't be null or empty")
        } else {
            try {
                await this.dbService.update(request)
                let updatedTodo = await this.dbService.get(request.id)
                if (updatedTodo.done == request.done && updatedTodo.title == request.title
                    && updatedTodo.description == request.description && request.dueDate == updatedTodo.dueDate)
                    return this.okResponse(updatedTodo)
                else {
                    return this.internalServerError("update", "not able to update the element")
                }
            } catch (error) {
                return this.internalServerError("update", error.message)
            }
        }
    }

    async put(request: Todo) {
        if (request?.author == undefined || isUndefinedOrEmpty(request?.author)) {
            return this.badRequestResponse("Author can't be null or empty")
        } else if (request.title == undefined || isUndefinedOrEmpty(request?.title)) {
            return this.badRequestResponse("Title can't be null or empty")
        } else {
            try {
                let createdTodo = await this.dbService.put(request)
                if (createdTodo.id != undefined && !isUndefinedOrEmpty(createdTodo.id))
                    return this.okResponse(createdTodo)
                else {
                    return this.internalServerError("put", "not able to create the element")
                }
            } catch (error) {
                return this.internalServerError("put", error.message)
            }
        }
    }

    async delete(id?: string) {
        if (id == undefined || isUndefinedOrEmpty(id)) {
            return this.badRequestResponse("Id can't be null or empty")
        } else {
            try {
                await this.dbService.delete(id)
                return this.okResponse({statusCode: 201, message: id + " has been deleted"})
            } catch (error) {
                return this.internalServerError("delete", error.message)
            }
        }
    }

    protected okResponse(body: any) {
        return {
            statusCode: 200,
            body: JSON.stringify(body)
        }
    }

    protected badRequestResponse(message: String) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                statusCode: 400,
                message: message
            })
        }
    }

    protected internalServerError(operation: string, message: String) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                statusCode: 500,
                operation: operation,
                message: message
            })
        }
    }

}

export const dataSource = new TodoDataSource(dbService);