import { APIGatewayProxyHandler } from "aws-lambda";
import * as yup from "yup";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { PageEntity } from "@kis/wb-data/dist/entities";
import { ProjectEntity } from "@kis/wb-data/dist/entities";

const schema = yup.object().shape({
  url_alias: yup
    .string()
    .optional()
    .matches(/^[a-z0-9-_]+$/, "Alias should be lowercase and hyphen-separated"),
  title: yup.string().optional(),
  metaTags: yup.string().optional(),
  thumbnail_page: yup.string().optional(), 
  sections: yup.string().optional(),
});

export const updatePage: APIGatewayProxyHandler = async (event) => {

  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);

    const pathParameters = event.pathParameters;
    if (!pathParameters || !pathParameters.alias || !pathParameters.url_alias) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Project alias and URL alias are required" }),
      };
    }

    console.log('Path Parameters:', pathParameters);

    const { alias, url_alias } = pathParameters;

    let body: any = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid request body" }),
        };
      }
    }

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
          error: "Unexpected error occurred during validation",
        }),
      };
    }

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

    if (body.url_alias !== undefined) page.url_alias = body.url_alias;
    if (body.title !== undefined) page.title = body.title;
    if (body.metaTags !== undefined) page.metaTags = body.metaTags;
    if (body.thumbnail_page !== undefined) page.thumbnail_page = body.thumbnail_page;
    if (body.sections !== undefined) page.sections = body.sections;

    await pageRepo.save(page);

    console.log("Updated page:", page);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Page updated successfully",
        page,
      }),
    };
  } catch (error: any) {
    console.error("Error updating page:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not update page",
        details: error.message,
      }),
    };
  }
};