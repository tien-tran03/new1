# API Documentation Setup

## Overview

This document outlines the process of defining TypeScript types for an API endpoint, integrating these types into Swagger documentation, and configuring the endpoint in a serverless architecture. This setup ensures type safety, clear documentation, and a smooth integration process for your API.

---

## Steps

1. **Define TypeScript Types**
2. **Run the Build Script**
3. **Update the `serverless.yml` Configuration**

---

## 1. Define TypeScript Types

### Folder Structure

1. **Navigate** to the `src` directory inside your project folder.
2. **Create a folder** named `types` if it doesn't already exist.
3. Inside the `types` folder, create files to define the request and response types for the API endpoint.

For example:
- **Request Type File**: `request.dao.ts` 
- **Response Type File**: `response.dao.ts`

### Define the Request and Response Types

- **Request Type**: Represents the structure of the expected data in the API request body.
- **Response Type**: Defines the structure of the data returned in the API response.

These types help ensure proper validation and consistency for both incoming requests and outgoing responses.

### Export the Types

Create an `index.ts` file in the `types` folder to export the defined types. This allows you to easily import and use the types throughout your project.

---

## 2. Run the Build Script

Once the TypeScript types are defined, run the build script to generate the necessary Swagger definitions. The build process will compile the TypeScript files and output the relevant documentation.

### Steps:

1. Open the terminal in the `build_tools` folder.
2. Run the following command to generate the `swagger-definitions.json` file in the `swagger` folder.

   ```bash
   node copy-type-define-then-build-swagger.js

---

## 3. Update the `serverless.yml` Configuration

In this step, you will update the `serverless.yml` configuration file to link your TypeScript types to the serverless function and generate the necessary Swagger documentation.

This configuration ensures your API is well-documented, with proper request and response types, and that the endpoint is categorized within Swagger for better organization.

### Key Configuration Parameters

1. **`operationId`**:
   - Specifies a unique name for the operation in the Swagger documentation.
   - Format: `method + endpoint name` (e.g., `postCreateNewPage`).
   
2. **`bodyType`**:
   - Defines the TypeScript type for the request body. This should reference the request data type (e.g., `NewPageDAO`).
   
3. **`responseData`**:
   - Defines the expected responses for the endpoint. For each possible response status code (e.g., 200, 400, 500), specify the corresponding response body type (e.g., `PageDAO`).
   
4. **`swaggerTags`**:
   - Categorizes the endpoint within the Swagger documentation. This helps group related API endpoints for better organization and clarity.

---

### Example Configuration

Below is an example of how to configure an endpoint in the `serverless.yml` file:

```yml
create-new-page:
  handler: wb_api_create_new_page/src/handler.createPage
  events:
    - http:
        path: projects/{alias}/create-new-page
        method: post
        cors: true
        operationId: postCreateNewPage    # Unique operation ID for Swagger
        description: 'Create a new page'
        bodyType: "NewPageDAO"            # Reference to the request data type
        responseData:
          200:
            description: 'Page created successfully'
            bodyType: 'PageDAO'           # Reference to the response data type
          400:
            description: 'Invalid page data'
          500:
            description: 'Server error'
        swaggerTags: ['Page Management']  # Categorize endpoint in Swagger