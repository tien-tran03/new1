import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { ProjectEntity } from "@kis/wb-data/dist/entities";

export const getPages: APIGatewayProxyHandler = async (event) => {

  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);
    
    const alias = event.pathParameters?.alias;
    if (!alias) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Alias is required" }),
      };
    }

    const limit = parseInt(event.queryStringParameters?.limit ?? "10", 10); 
    const offset = parseInt(event.queryStringParameters?.offset ?? "0", 10); 

    const project = await appDataSource.getRepository(ProjectEntity).findOne({
      where: { alias },
      relations: ['pages'], 
    });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const pages = project.pages.slice(offset, offset + limit);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "List of pages",
        pages,
        totalPages: Math.ceil(project.pages.length / limit),
        currentPage: Math.floor(offset / limit) + 1, 
      }),
    };
  } catch (error: any) {
    console.error("Error fetching project and pages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to fetch project data",
      }),
    };
  }
};