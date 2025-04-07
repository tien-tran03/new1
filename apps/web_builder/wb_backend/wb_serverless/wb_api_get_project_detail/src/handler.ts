import { APIGatewayProxyHandler } from "aws-lambda";
import { ProjectEntity } from "@kis/wb-data/dist/entities";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const getProjectDetails: APIGatewayProxyHandler = async (event) => {

  try {
    const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);

    const projectId = event.pathParameters?.projectId;
    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Project ID is required" }),
      };
    }

    const project = await appDataSource.getRepository(ProjectEntity).findOne({
      where: {
        id: parseInt(projectId, 10),
        owner: { id: decoded.userId },
      },
    });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    console.log("Fetched project:", project);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Chi tiết dự án",
        project: project,
      }),
    };
  } catch (error: any) {
    console.error("Error fetching project detail:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Không thể lấy thông tin dự án",
      }),
    };
  }
};
