# Data Management Suite

Welcome to Data Management Suite, an integrative platform for managing and searching your metadata efficiently.

## Features

- Web application interface for easy data handling
- Python SDK for programmatic access
- Docker containerization for consistent development and deployment
- Continuous integration and deployment pipelines
- Prisma ORM for robust database operations
- Remix framework for reactive UI components
- Tailwind CSS for a modern and responsive design
- TypeScript for type-safe code

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Docker and Docker Compose installed
- Node.js and npm installed

## Setup

To set up the project for local development:

1. Clone the repository to your local machine.

   ```
   git clone https://github.com/Deltares-research/data-management-suite.git
   cd data-management-suite
   ```

2. Install the project dependencies.

   ```
   npm install
   ```

3. Start the postgres database in the Docker environment.

   ```
   docker compose up postgres -d
   ```

4. Run the development server.
   ```
   npm run dev
   ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

It is also possible to run the remix server in a docker container, then we only need 1 step to start a development server:

```
docker compose up
```

When running the server in a docker container for the first time, you might have to set up the database initially:
```
docker compose exec web npm run e2e:setupdb
```

## Tests

To run the tests:

```bash
npx playwright install --with-deps
npx remix-serve ./build/index.js & npx playwright test
```

## Deployment

For deployment instructions, refer to the `deployment` directory which should contain the necessary scripts and configuration files.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

Please ensure you update tests as appropriate.

## License

This project is licensed under the [GPL v3.0 License](./LICENSE) - see the LICENSE file for details.

## Contact

For any additional questions or comments, reach out through [issue tracker](https://github.com/Deltares-research/data-management-suite/issues) or directly to the maintainers.
