
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as yup from "yup";
import { PageEntity } from "@kis/wb-data/dist/entities";
import { ProjectEntity } from "@kis/wb-data/dist/entities";

const schema = yup.object().shape({
  url_alias: yup
    .string()
    .required("URL alias is required.")
    .matches(/^[a-z0-9-_]+$/, "Alias should be lowercase and hyphen-separated"),
  title: yup.string().optional(),
  metaTags: yup.string().optional(),
  sections: yup.string().optional(),
  thumbnail_page: yup.string().optional(),
});

export const createPage: APIGatewayProxyHandler = async (event) => {

  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);
    
    const body = JSON.parse(event.body ?? '{}');

    try {
      await schema.validate(body, { abortEarly: false });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Validation failed',
            details: error.errors,
          }),
        };
      }

      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Unexpected error occurred',
        }),
      };
    }


    const projectAlias = event.pathParameters?.alias;
    if (!projectAlias) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Project alias is required in path parameters' }),
      };
    }


    const project = await appDataSource.manager.findOne(ProjectEntity, {
      where: { alias: projectAlias },
    });

    if (!project) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    const existingPage = await appDataSource.manager.findOne(PageEntity, {
      where: { url_alias: body.url_alias },
    });

    if (existingPage) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'URL alias already exists' }),
      };
    }

    const page = new PageEntity();
    page.url_alias = body.url_alias;
    page.title = body.title;
    page.metaTags = body.metaTags;
    page.sections = body.sections ;
    page.project = project;
    page.thumbnail_page = body.thumbnail_page;
    await appDataSource.manager.save(page);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Page created successfully',
        pageId: page.id,
        url_alias: page.url_alias,
      }),
    };
  } catch (error: any) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};