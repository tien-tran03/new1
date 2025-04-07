import { APIGatewayProxyHandler } from "aws-lambda";
import { ProjectEntity } from "@kis/wb-data/dist/entities";
import { Like } from "typeorm";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const projects: APIGatewayProxyHandler = async (event) => {

  const queryParams = event.queryStringParameters ?? {};
  const page = parseInt(queryParams.page ?? "1", 10);
  const limit = parseInt(queryParams.limit ?? "10", 10);
  const offset = (page - 1) * limit;
  const projectName = queryParams.name ?? ""; // Tên dự án để tìm kiếm
  const sortBy = queryParams.sortBy ?? "createdAt";
  const sortOrder = "DESC";

  try {
    const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);

    const whereCondition = projectName
      ? {
        owner: { id: decoded.userId },
        name: Like(`%${projectName}%`), // Tìm kiếm theo tên dự án
      }
      : { owner: { id: decoded.userId } };

    const [projects, total] = await appDataSource.manager.findAndCount(ProjectEntity, {
      where: whereCondition,
      take: limit,
      skip: offset,
      order: { [sortBy]: sortOrder },
    });

    function formatDateforStartTime(date: Date): string | null {
      if (!(date instanceof Date) || isNaN(date.getTime())) return null;
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours;
      return ` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${String(minutes).padStart(2, '0')} ${period}`;
    }
    // Sử dụng map để xử lý từng dự án (item)
    const mappedProjects = projects.map(project => {
      return {
        ...project,
        // Bạn có thể thêm các trường hoặc thay đổi thông tin nếu cần
        updatedAtFormatted: formatDateforStartTime(new Date(project.updatedAt)), // Ví dụ: định dạng lại ngày
        createdAtFormatted: formatDateforStartTime(new Date(project.createdAt)), // Định dạng lại ngày tạo
      };
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        totalPages: Math.ceil(total / limit),
        projects: mappedProjects,
        count_item_projects: total,
        message: "Danh sách dự án của người dùng",
      }),
    };
  } catch (error: any) {
    console.error("Error fetching projects:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Không thể lấy danh sách project",
      }),
    };
  }
};
