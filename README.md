# Node.js Application Setup

This document provides instructions to run the Node.js application located in the `/application` folder.

## Prerequisites

Ensure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)

## Installation

1. Clone the repository:
	```sh
	git clone https://github.com/golanguzb70/mongo-replica-set.git
	```
2. Navigate to the application directory:
	```sh
	cd mongo-replica-set/application
	```
3. Install the dependencies:
	```sh
	npm install
	```

## Environment Variables

Create a `.env` file in the `/application` directory and add the necessary environment variables. Example:
```
MONGODB_URI=mongodb://localhost:27017,localhost:27018,localhost:27019/your_database_name?replicaSet=rs0&readPreference=secondaryPreferred
PORT=3000
```

## Running the Application

1. Start the application:
	```sh
	node app.js
	```
2. Open your browser and navigate to `http://localhost:3000/api-docs` to see the application api documents.
3. Run the CRUD operations to check if the application is working or not.


