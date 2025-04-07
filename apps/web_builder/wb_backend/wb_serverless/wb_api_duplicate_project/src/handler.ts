import { APIGatewayProxyHandler } from "aws-lambda";
import { ProjectEntity } from "@kis/wb-data/dist/entities";
import { Like } from "typeorm";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { UserEntity } from "@kis/wb-data/dist/entities";

export const duplicateProject: APIGatewayProxyHandler = async (event) => {
    try {
        // Verify user and initialize DB connection
        const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);

        const projectId = event.pathParameters?.projectId;

        if (!projectId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Project ID is required" }),
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

        // Generate a unique alias for the new project copy
        const newAlias = await generateUniqueAlias(projectRepo, project.alias);

        // Prepare the data for the new duplicated project
        const newProjectData = {
            name: `Copy of ${project.name}`,
            alias: newAlias,
            description: project.description,
            thumbnail: project.thumbnail,
            owner: project.owner,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create the duplicated project
        const createProjectResponse = await createProjectInternal(newProjectData, decoded.userId, appDataSource);

        return {
            statusCode: createProjectResponse.statusCode,
            body: createProjectResponse.body,
        };
    } catch (error: any) {
        console.error("Error duplicating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not duplicate project" }),
        };
    }
};

// Helper function to generate a unique alias
const generateUniqueAlias = async (projectRepo: any, baseAlias: string) => {
    const allProjects = await projectRepo.find({
        where: { alias: Like(`${baseAlias}-copy%`) },
    });

    let highestCopy = 0;

    // Find the highest copy number
    allProjects.forEach((project: any) => {
        const match = project.alias.match(/-copy-(\d+)$/);
        if (match) {
            const copyNumber = parseInt(match[1], 10);
            if (copyNumber > highestCopy) {
                highestCopy = copyNumber;
            }
        }
    });

    // Return the next alias with incremented number
    return `${baseAlias}-copy-${highestCopy + 1}`;
};

const createProjectInternal = async (projectData: any, userId: number, appDataSource: any) => {
    try {
        const projectRepo = appDataSource.getRepository(ProjectEntity);
        const userRepo = appDataSource.getRepository(UserEntity);

        // Check if project alias already exists before saving
        const existingProject = await projectRepo.findOne({
            where: { alias: projectData.alias },
        });
        if (existingProject) {
            throw new Error(`Alias ${projectData.alias} already exists`);
        }

        // Get the full UserEntity for the owner
        const owner = await userRepo.findOne({
            where: { id: userId },
        });

        if (!owner) {
            throw new Error("User not found");
        }

        const project = new ProjectEntity();

        project.name = projectData.name;
        project.alias = projectData.alias;
        project.description = projectData.description;
        project.owner = owner;
        project.thumbnail = projectData.thumbnail;
        project.createdAt = new Date();
        project.updatedAt = new Date();

        await projectRepo.save(project);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Project duplicated successfully',
                projectId: project.id,
                alias: project.alias,
            }),
        };
    } catch (error: any) {
        console.error("Error creating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not create duplicated project" }),
        };
    }
};