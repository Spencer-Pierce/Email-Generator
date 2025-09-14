# API Gateway Documentation

## Overview
This project implements a backend API gateway using Node.js and Express. It serves as an intermediary between the client and a Python microservice, facilitating the generation and refinement of data, as well as maintaining a history of requests.

## Project Structure
The project is organized as follows:

```
api-gateway
├── src
│   ├── app.ts                # Entry point of the application
│   ├── routes                 # Contains route definitions
│   │   ├── generate.ts        # Route for generating data
│   │   ├── refine.ts          # Route for refining data
│   │   └── history.ts         # Route for retrieving historical data
│   ├── controllers            # Contains request handling logic
│   │   ├── generateController.ts # Handles /generate requests
│   │   ├── refineController.ts   # Handles /refine requests
│   │   └── historyController.ts  # Handles /history requests
│   ├── services               # Contains service logic
│   │   ├── mongoService.ts     # MongoDB integration
│   │   └── proxyService.ts     # Proxying requests to Python service
│   └── types                  # Type definitions
│       └── index.ts           # TypeScript interfaces
├── package.json               # NPM configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## Installation
To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd api-gateway
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your MongoDB database and update the connection string in `src/services/mongoService.ts`.

## Running the Application
To run the application, use the following command:
```
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints
- **POST /generate**: Generates data by proxying requests to the Python service.
- **POST /refine**: Refines existing data based on provided parameters.
- **GET /history**: Retrieves the history of requests made to the API.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.