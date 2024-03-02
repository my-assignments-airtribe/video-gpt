import {
  GenericContainer,
  Wait,
  StartedTestContainer,
  Network,
} from "testcontainers";
import axios from "axios";
import { Client } from "pg";
import path from "node:path";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

describe("User Service Integration Tests", () => {
  let userServiceContainer: StartedTestContainer;
  let dbContainer;
  let client: Client;

  beforeAll(async () => {
    const buildContext = path.resolve(__dirname, "../../"); // Ensure this points to the location of your Dockerfile
    const network = await new Network().start();

    dbContainer = await new PostgreSqlContainer()
      .withDatabase("test")
      .withUsername("test")
      .withPassword("testPassword")
      .withNetwork(network)
      .withNetworkAliases("postgres")
      .start();

    client = new Client({
      host: dbContainer.getHost(),
      port: dbContainer.getPort(),
      database: dbContainer.getDatabase(),
      user: dbContainer.getUsername(),
      password: dbContainer.getPassword(),
    });
    try {
      console.log("Connecting to the database");
      await client.connect();
      console.log("Connected to the database successfully.");
      // Create the users table in the test database
      console.log("Creating the users table");
      await client.query(
        `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`
      );
      console.log("Users table created successfully");
    } catch (error) {
      console.error(
        "Error during test setup",
        error.message,
        JSON.stringify(error, null, 2)
      );
      throw error; // Ensure the test fails in case of an error
    }

    // Build and start the User Service container from Dockerfile
    const userServiceImage = await GenericContainer.fromDockerfile(
      buildContext
    ).build();
    userServiceContainer = await userServiceImage
      .withExposedPorts(3000)
      .withEnvironment({
        DB_HOST: 'postgres',
        DB_PORT: '5432',
        DB_USER: dbContainer.getUsername(),
        DB_NAME: dbContainer.getDatabase(),
        DB_PASSWORD: dbContainer.getPassword(),
      })
      .withWaitStrategy(
        Wait.forLogMessage("Connected to database successfully.")
      )
      .withNetwork(network)
      .start();

    // Configure axios base URL to communicate with the User Service container
    const userServicePort = userServiceContainer.getMappedPort(3000);
    axios.defaults.baseURL = `http://${userServiceContainer.getHost()}:${userServicePort}`;
  });

  afterAll(async () => {
    // Cleanup: Drop the users table and close the database connection
    await client.query("DROP TABLE IF EXISTS users;");
    await client.end();

    // Stop the containers
    await dbContainer.stop();
    await userServiceContainer.stop();
  });

  it("should register a new user successfully", async () => {
    const userData = {
      username: "testuser",
      password: "password",
      email: "testuser@example.com",
    };

    try {
      const response = await axios.post("/api/user/register", userData);

      expect(response.status).toBe(201);
      expect(response.data.message).toBe("User registered successfully");

      // Verify the user was saved in the database
      const queryResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [userData.email]
      );
      expect(queryResult.rows).toHaveLength(1);
      expect(queryResult.rows[0].username).toBe(userData.username);
    } catch (error) {
      console.error("Error during test execution", error.message);
      throw error; // Ensure the test fails in case of an error
    }
  });

  it("should login a registered user successfully", async () => {
    const userData = {
      username: "testuser",
      password: "password",
    };

    try {
      const response = await axios.post("/api/user/login", userData);

      expect(response.status).toBe(200);
      expect(response.data.message).toBe("User logged in successfully");
    } catch (error) {
      console.error("Error during test execution", error.message);
      throw error; // Ensure the test fails in case of an error
    }
  });

  it("should not register a user with an existing username", async () => {
    const userData = {
      username: "testuser",
      password: "password",
      email: "testuser@example.com",
    };
  
    try {
      await axios.post("/api/user/register", userData); // Ensure this matches your actual endpoint
      // If Axios does not throw, the test should fail because a duplicate username/email should not be accepted.
      throw new Error("Test should have thrown an error for duplicate username/email, but it did not.");
    } catch (error) {
      if (error.response) {
        // Now correctly handling Axios error response
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toBe("Username or email is already taken");
      } else {
        // Rethrow if it's not an Axios error to ensure the test fails with useful debugging information.
        throw error;
      }
    }
  });
});
