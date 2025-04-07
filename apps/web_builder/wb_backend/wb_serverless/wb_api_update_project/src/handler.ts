import { APIGatewayProxyHandler } from "aws-lambda";
import * as yup from "yup";
import { ProjectEntity } from "@kis/wb-data/dist/entities";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

const schema = yup.object().shape({
  name: yup.string().optional(),
  alias: yup
    .string()
    .optional()
    .matches(/^[a-z0-9-_]+$/, "Alias should be lowercase and hyphen-separated"),
  description: yup.string().optional(),
  startDate: yup.date().optional(),
  endDate: yup.date().optional(),
  thumbnail: yup.string().optional(),
});

export const updateProject: APIGatewayProxyHandler = async (event) => {

  try {
    const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);
    
    const projectId = event.pathParameters?.projectId;

    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Project ID is required" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    try {
      await schema.validate(body, { abortEarly: false });
    } catch (validationError: unknown) {
      if (validationError instanceof yup.ValidationError) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Validation failed",
            details: validationError.errors,
          }),
        };
      }
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Unexpected error occurred",
        }),
      };
    }

    const projectRepo = appDataSource.getRepository(ProjectEntity);
    const project = await projectRepo.findOne({
      where: {
        id: parseInt(projectId, 10),
        owner: { id: decoded.userId },
      },
    });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Project not found",
          projectId: projectId,
        }),
      };
    }

    if (body.alias) {
      const existingAlias = await projectRepo.findOne({
        where: { alias: body.alias },
      });

      if (existingAlias && existingAlias.id !== project.id) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Alias already exists. Please choose a different alias.",
          }),
        };
      }
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        if (key === "thumbnail" && typeof body.thumbnail === "string") {
          project.thumbnail = body.thumbnail.split("?")[0];
        } else {
          (project as any)[key] = body[key];
        }
      }
    });

    await projectRepo.save(project);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Project updated successfully",
        project,
      }),
    };
  } catch (error: any) {
    console.error("Error updating project:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update project" }),
    };
  }
};

