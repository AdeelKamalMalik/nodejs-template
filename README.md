
# Blog Site

This is a Node.js-based blog site project built with TypeScript and PostgreSQL, using TypeORM for database management. It supports environment-specific configuration and includes features for running migrations and seeding the database.

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- TypeORM

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   
   Create `.env.local` and `.env.prod` files for local development and production, respectively. Ensure they include the necessary PostgreSQL connection details, such as:
   
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   ```

4. Create the database:

   Run the following script to create the database (make sure your PostgreSQL server is running):
   
   ```bash
   npm run create-database
   ```

## Running the Project

To run the project in development mode:

```bash
npm run dev
```

To run the project in production mode:

```bash
npm run start
```

## Running Migrations

To generate a new migration:

```bash
npm run typeorm:generate -- NameOfMigration
```

To run migrations:

```bash
npm run typeorm:migrate
```

To revert the last migration:

```bash
npm run typeorm:revert
```

To drop the database schema:

```bash
npm run typeorm:drop
```

## Seeding Data

To seed the database with initial data:

```bash
npm run seed
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.