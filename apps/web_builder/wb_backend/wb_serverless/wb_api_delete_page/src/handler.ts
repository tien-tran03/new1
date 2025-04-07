import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { PageEntity } from "@kis/wb-data/dist/entities";
import { ProjectEntity } from "@kis/wb-data/dist/entities";

export const deletePage: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);

    const pathParameters = event.pathParameters;
    if (!pathParameters || !pathParameters.alias || !pathParameters.urlAlias) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Project alias and URL alias are required!" }),
      };
    }

    const { alias, url_alias } = pathParameters;

    // Fetch project by alias
    const projectRepo = appDataSource.getRepository(ProjectEntity);
    const project = await projectRepo.findOne({
      where: { alias },
    });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Project not found",
          alias,
        }),
      };
    }

    // Fetch page by URL alias and project
    const pageRepo = appDataSource.getRepository(PageEntity);
    const page = await pageRepo.findOne({
      where: {
        url_alias,
        project: { id: project.id },
      },
    });

    if (!page) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Page not found",
          url_alias,
        }),
      };
    }

    // Delete the page
    await pageRepo.remove(page);

    console.log("Deleted page:", page);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Page deleted successfully",
        page,
      }),
    };
  } catch (error: any) {
    console.error("Error deleting page:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not delete page" }),
    };
  }
};