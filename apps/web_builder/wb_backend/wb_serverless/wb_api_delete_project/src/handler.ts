import { APIGatewayProxyHandler } from "aws-lambda";
import { ProjectEntity } from "@kis/wb-data/dist/entities";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const deleteProject: APIGatewayProxyHandler = async (event) => {

  try {

    const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);
    
    const projectId = event.pathParameters?.projectId;

    if (!projectId) {
      console.log("Thiếu project ID");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Project ID is required" }),
      };
    }

    const projectRepo = appDataSource.getRepository(ProjectEntity);
    console.log(`Tìm kiếm project ID: ${projectId} của user ID: ${decoded.userId}`);

    const project = await projectRepo.findOne({
      where: {
        id: parseInt(projectId, 10),
        owner: { id: decoded.userId },
      },
    });

    if (!project) {
      console.log("Không tìm thấy project hoặc không có quyền xóa.");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Project not found or no permission" }),
      };
    }

    await projectRepo.delete({ id: parseInt(projectId, 10) });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Project deleted successfully" }),
    };
  } catch (error: any) {
    console.error("Lỗi khi xóa project:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Không thể xóa project", details: error.message }),
    };
  }
};