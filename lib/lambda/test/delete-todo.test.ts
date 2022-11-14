import {TodoDataSource} from "../core/domain/todo-data-source";

test('ok delete todo', async () => {
    let mockedDbService = {
        all: jest.fn(async () => [{
            id: "id",
            done: false,
            author: "Amro",
            dueDate: 1,
            title: "title"
        }]),
        update: jest.fn(async () => {
        }),
        get: jest.fn(async () => {
            return {
                id: "id",
                done: false,
                author: "Amro",
                dueDate: 1,
                title: "title"
            }
        }),
        put: jest.fn(async (todo) => todo),
        delete: jest.fn(async () => {
        }),
    }
    let dataSource = new TodoDataSource(mockedDbService)
    let amroTodos = await dataSource.delete("1")
    expect(amroTodos).toEqual({
        statusCode: 200,
        body: JSON.stringify(
            {statusCode: 201, message: "1 has been deleted"}
        )
    });
});

test('invalid id delete todo', async () => {
    let mockedDbService = {
        all: jest.fn(async () => [{
            id: "id",
            done: false,
            author: "Amro",
            dueDate: 1,
            title: "title"
        }]),
        update: jest.fn(async () => {
        }),
        get: jest.fn(async () => {
            return {
                id: "id",
                done: false,
                author: "Amro",
                dueDate: 1,
                title: "title"
            }
        }),
        put: jest.fn(async (todo) => todo),
        delete: jest.fn(async () => {
        }),
    }
    let dataSource = new TodoDataSource(mockedDbService)
    let amroTodos = await dataSource.delete(undefined)
    expect(amroTodos).toEqual({
        statusCode: 400,
        body: JSON.stringify(
            {
                statusCode: 400,
                message: "Id can't be null or empty"
            }
        )
    });
});

test('internal server error delete todo', async () => {
    let mockedDbService = {
        all: jest.fn(async () => [{
            id: "id",
            done: false,
            author: "Amro",
            dueDate: 1,
            title: "title"
        }]),
        update: jest.fn(async () => {
        }),
        get: jest.fn(async () => {
            return {
                id: "id",
                done: false,
                author: "Amro",
                dueDate: 1,
                title: "title"
            }
        }),
        put: jest.fn(async (todo) => todo),
        delete: jest.fn(async () => {
            throw Error("error message")
        }),
    }
    let dataSource = new TodoDataSource(mockedDbService)
    let amroTodos = await dataSource.delete("amro")
    expect(amroTodos).toEqual({
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            operation: "delete",
            message: "error message"
        })
    });
});
