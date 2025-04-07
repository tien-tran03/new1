import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { ProjectEntity } from "@kis/wb-data/dist/entities";

export const getProjectDetailsByAlias: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);

    const alias = event.pathParameters?.alias;
    if (!alias) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Alias is required" }),
      };
    }

    const project = await appDataSource.getRepository(ProjectEntity).findOne({
      where: {
        alias: alias, // Find project by alias
      },
    });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project not found" }),
      };3
    }

    console.log("Fetched project:", project);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Project details",
        project: project,
      }),
    };
  } catch (error: any) {
    console.error("Error fetching project details:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to fetch project details",
      }),
    };
  }
};