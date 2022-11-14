import {TodoDataSource} from "../core/domain/todo-data-source";

test('ok update todo', async () => {
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
    let amroTodos = await dataSource.update({
        id: "id",
        done: false,
        dueDate: 1,
        title: "title"
    })
    expect(amroTodos).toEqual({
        statusCode: 200,
        body: JSON.stringify({
            id: "id",
            done: false,
            author: "Amro",
            dueDate: 1,
            title: "title"
        })
    });
});

test('author update todo', async () => {
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
    let amroTodos = await dataSource.update({
        id: "id",
        done: false,
        author: "Amro",
        dueDate: 1,
        title: "title"
    })
    expect(amroTodos).toEqual({
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: "Author can't be edited"
        })
    });
});

test('invalid id update todo', async () => {
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
    let amroTodos = await dataSource.update({
        done: false,
        dueDate: 1,
        title: "title"
    })
    expect(amroTodos).toEqual({
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: "Id can't be null or empty"
        })
    });
});

test('invalid update todo', async () => {
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
                done: true,
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
    let amroTodos = await dataSource.update({
        id: "id",
        done: false,
        dueDate: 1,
        title: "title"
    })
    expect(amroTodos).toEqual({
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            operation: "update",
            message: "not able to update the element"
        })
    });
});

test('internal server error update todo', async () => {
    let mockedDbService = {
        all: jest.fn(async () => [{
            id: "id",
            done: false,
            author: "Amro",
            dueDate: 1,
            title: "title"
        }]),
        update: jest.fn(async () => {
            throw Error("message")
        }),
        get: jest.fn(async () => {
            return {
                id: "id",
                done: true,
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
    let amroTodos = await dataSource.update({
        id: "id",
        done: false,
        dueDate: 1,
        title: "title"
    })
    expect(amroTodos).toEqual({
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            operation: "update",
            message: "message"
        })
    });
});


