import {TodoDataSource} from "../core/domain/todo-data-source";

test('ok put todo', async () => {
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
        put: jest.fn(async () => {
            return {
                id: "id",
                done: false,
                author: "Amro",
                dueDate: 1,
                title: "title"
            }
        }),
        delete: jest.fn(async () => {
        }),
    }
    let dataSource = new TodoDataSource(mockedDbService)
    let amroTodos = await dataSource.put({
        done: false,
        author: "Amro",
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

test('invalid author put todo', async () => {
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
    let amroTodos = await dataSource.put({
        id: "id",
        done: false,
        dueDate: 1,
        title: "title"
    })
    expect(amroTodos).toEqual({
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: "Author can't be null or empty"
        })
    });
});

test('invalid title put todo', async () => {
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
    let amroTodos = await dataSource.put({
        id: "id",
        done: false,
        dueDate: 1,
        author: "Amro"
    })
    expect(amroTodos).toEqual({
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: "Title can't be null or empty"
        })
    });
});

test('invalid id put todo', async () => {
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
        put: jest.fn(async () => {
            return {
                done: false,
                author: "Amro",
                dueDate: 1,
                title: "title"
            }
        }),
        delete: jest.fn(async () => {
        }),
    }
    let dataSource = new TodoDataSource(mockedDbService)
    let amroTodos = await dataSource.put({
        done: false,
        dueDate: 1,
        title: "title",
        author: "Amro"
    })
    expect(amroTodos).toEqual({
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            operation: "put",
            message: "not able to create the element"
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
        put: jest.fn(async () => {
            throw Error("message")
        }),
        delete: jest.fn(async () => {
        }),
    }
    let dataSource = new TodoDataSource(mockedDbService)
    let amroTodos = await dataSource.put({
        id: "id",
        done: false,
        dueDate: 1,
        title: "title",
        author: "Amro"
    })
    expect(amroTodos).toEqual({
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            operation: "put",
            message: "message"
        })
    });
});


