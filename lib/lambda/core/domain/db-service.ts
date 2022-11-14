import {Todo} from "./model/todo";

export interface DbService {
    put(todo: Todo): Promise<Todo>

    update(todo: Todo): Promise<void>

    get(id: string): Promise<Todo>

    delete(id: string): Promise<void>

    all(author: string): Promise<Todo[]>
}
