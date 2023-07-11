import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Client } from "pg";

var errorMessage = "";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const config = {
        connectionString: process.env.POSTGRES_URI,
        ssl: {
            rejectUnauthorized: true,
            ca: process.env.CA,
        },
    };
    
    const client = new Client(config);

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
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    await client.end();
  }
};

export { handler };
