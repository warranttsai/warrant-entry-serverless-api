# warrant-entry-serverless-api

This is the AWS Lambda serverless project. It is used to access the services in Warrant TSAI's personal AWS account

Update on <b>1 October 2023</b>

Program Language: JavaScript
Runtime: nodejs14.x

## How To Install This Project

1. Clone this project.
2. Install NPM or Yarn(mac) in your terminal.
3. Move your terminal to the project folder.
4. Run "yarn install" or "npm install" to install the modules.
5. Run "yarn dev" or "npm run dev" to run the project on "localhost:5000"

## plugins

- serverless-offline
- aws-sdk

## APIs

- comment
- comments

## How To Execute This Project?

- yarn dev/npm run dev: "sls offline"
  This command is used to enable the api on local side.
- yarn deploy/npm run deploy: "sls deploy"
  The deploy command will deploy the project to AWS Lambda. You have to be authorized to use this command.
- yarn deployFunction <fileName>: "sls deploy function -f"
  You can specify the file which you wished to deploy instead of the whole project. It helps to deploy the new functions in a efficient manner.

## Under developing functions

none

## To-do List

None

## Contributors:

- Warrant TSAI
