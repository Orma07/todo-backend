import {TodoDataSource} from "../core/domain/todo-data-source";

test('ok all todo', async () => {
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
    let amroTodos = await dataSource.all("Amro")
    expect(amroTodos).toEqual({
        statusCode: 200,
        body: JSON.stringify([
            {
                id: "id",
                done: false,
                author: "Amro",
                dueDate: 1,
                title: "title"
            }
        ])
    });
});

test('invalid query parameters all todo', async () => {
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
    let amroTodos = await dataSource.all(undefined)
    expect(amroTodos).toEqual({
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: "Author can't be null"
        })
    });
});

test('internal server error all todo', async () => {
    let mockedDbService = {
        all: jest.fn(async () => {
            throw Error("error message")
        }),
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
    let amroTodos = await dataSource.all("amro")
    expect(amroTodos).toEqual({
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            operation: "all",
            message: "error message"
        })
    });
});
