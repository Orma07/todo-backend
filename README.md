# TODO Demo backend

For the backed I decided to use AWS cdk, AWS Cloud Development Kit, allows to define cloud architecture as code infrastructure.

I decided to use it cause it allows me tu use node to write code and deploy it that means that the todo application written in Flutter will be testable without the need of local server. I think it's different from firebase cause give me the advantage of writing unit tests and allow me to decide the architecture. In this specific case I decided to build an api gateway that communicate to DynamoDB through lambda functions. In the lambda functions I implemented some data checks.

## Project structure

- bin -> todo-backend.ts: contains the cdk initialization
- lib -> todo-backend-stack.ts: contains the cloud infrastructure initialization through the resources constructors
- lib -> lambda: contains the lambda code, I've abstracted the db part implementation (lambda/core/db) creating the DbService interface. This solution allowed me to write testable and maintainable code if tomorrow we decide to not use DyanamoDB we will need to change only the DynamoDbImpl class
- lib -> lambda -> todo-data-source.ts: contains the actual implementation of our serverless application
- lib -> lambda -> index.ts: contains the handlers of my api:
  - POST /todo bound to put handler
  - GET /todo bound to getAll handler
  - PATCH /todo bound to update handler
  - DELETE /{todo-id} bound to delete handler\
as you can notice each handler perform a call to specific method of TodoDataSource where all the logic is implemented also the structure of the responses of our backend

In the project you can find also TODO.postman_collection.json a collection to perform the CRUD operation for our TODO
  
