import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { PageEntity } from "@kis/wb-data/dist/entities";
import { ProjectEntity } from "@kis/wb-data/dist/entities";

export const getPageDetails: APIGatewayProxyHandler = async (event) => {
  try {
    const { decoded, appDataSource } = await verifyUserAndInitializeDB(event); 

    // Lấy alias và urlAlias từ pathParameters
    const alias = event.pathParameters?.alias;
    const url_alias = event.pathParameters?.url_alias;

    if (!alias || !url_alias) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Alias and URL alias are required" }),
      };
    }

    const project = await appDataSource.getRepository(ProjectEntity).findOne({
      where: { alias, owner: { id: decoded.userId } },
    });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const page = await appDataSource.getRepository(PageEntity).findOne({
      where: { url_alias, project: { id: project.id } },
    });

    if (!page) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }

    console.log("Fetched page details:", page);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Page details",
        project:project,
        page: page,
      }),
    };
  } catch (error: any) {
    console.error("Error fetching page detail:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Không thể lấy thông tin trang",
      }),
    };
  }
};