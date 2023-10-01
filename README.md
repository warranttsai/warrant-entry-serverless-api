# warrant-entry-serverless-api

This project is created for serving the front-end project "warrant-entry". It includes the APIs for comment-related functions.

Update on <b>1 October 2023</b>
Program Language: JavaScript
Runtime: nodejs14.x

# plugins

- serverless-offline
- aws-sdk

# APIs

- comment
- comments

# How To Execute This Project?

- yarn dev/npm run dev: "sls offline"
  This command is used to enable the api on local side.
- yarn deploy/npm run deploy: "sls deploy"
  The deploy command will deploy the project to AWS Lambda. You have to be authorized to use this command.
- yarn deployFunction <fileName>: "sls deploy function -f"
  You can specify the file which you wished to deploy instead of the whole project. It helps to deploy the new functions in a efficient manner.

# Under developing functions

none

# To-do List

None

# Contributors:

- Warrant TSAI
