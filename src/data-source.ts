import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from './config';

export const AppDataSource = new DataSource({
	type: "postgres",
	host: config.db.host || 'localhost',
	port: config.db.port || 5432,
	username: config.db.username || 'postgres',
	password: config.db.password || '1234',
	database: config.db.database || 'blog_post_db',
	synchronize: false,
	logging: false,
	migrationsRun: true,
	entities: ["src/entity/*.ts"],
	migrations: ["src/migration/*.ts"],
	subscribers: ["src/subscriber/**/*.ts"],
	extra: {
		connectionLimit: 10,
},
});

let dataSourceInitialized = false;

export const initializeDataSource = async () => {
	if (!dataSourceInitialized) {
		await AppDataSource.initialize();
		dataSourceInitialized = true;
	}
};

export const closeDataSource = async () => {
	if (dataSourceInitialized) {
		await AppDataSource.destroy();
		dataSourceInitialized = false;
	}
};

