# Generate API Client

Follow these steps to generate and use the API client:

## Step 1: Start Serverless to Get `swagger.json`
1. Open the terminal in the `wb_serverless` directory.
2. Run the following command to start the serverless offline service:
   ```bash
   serverless offline start

## Step 2: Generate the API Client
1. Open the terminal in the `wb_api_services` directory.
2. Run the following command to generate the API client:
   ```bash
   npm run generate:api-client

3.	After the API client is generated, run the build command:
   ```bash
   npm run build

## Step 3: Use the API Client
Once the API client is generated:
1. Import the client into your application where needed.
2. Use the generated methods and objects to interact with the API endpoints.

### Example usage:
   ```typescript
   // Import the generated API client
   import { getApiClient } from "../../api_utils";

   async function exampleToUseApiClient() {
     try {
       // Get the API client instance
       const apiClient = getApiClient();
       
       // Call a method from the API client (replace `nameMethod` with the actual method name)
       const response = await apiClient.nameMethod({});
       
       // Handle the response
       console.log('API Response:', response);
     } catch (error) {
       // Handle any errors
       console.error('API Error:', error);
     }
   }