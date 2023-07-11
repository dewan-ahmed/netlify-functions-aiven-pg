import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Client } from "pg";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URI,
    ssl: true, // Enable SSL if required by your PostgreSQL instance
  });

  try {
    await client.connect();
    const result = await client.query("SELECT version();");
    const postgresVersion = result.rows[0].version;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Your PG version is: ${postgresVersion}.` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error connecting to PostgreSQL" }),
    };
  } finally {
    await client.end();
  }
};

export { handler };
