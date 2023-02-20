// import { join } from "path";

import { writeFileSync } from "fs";
import path from "path";
// const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
import { MongoMemoryServer } from "mongodb-memory-server";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const globalConfigPath = path.join(__dirname, "globalConfigMongo.json");

const mongod = new MongoMemoryServer({ autoStart: false });

export default async () => {
	if (!mongod.runningInstance) {
		await mongod.ensureInstance();
	}

	const mongoConfig = {
		mongoDBName: "jest",
		mongoUri: mongod.getUri(),
	};

	// Write global config to disk because all tests run in different contexts.
	writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

	// Set reference to mongod in order to close the server during teardown.
	global.__MONGOD__ = mongod;
};
