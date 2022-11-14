export default {
    type: "object",
    properties: {
        id: {type: 'string'},
        title: {type: 'string'},
        description: {type: 'string'},
        dueDate: {type: 'number'},
        done: {type: 'boolean'},
        author: {type: 'string'}
    },
    required: []
} as const;
