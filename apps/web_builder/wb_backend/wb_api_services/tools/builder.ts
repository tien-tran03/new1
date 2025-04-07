import * as fs from 'fs';
import path from 'path';
import { CodeGen } from 'swagger-typescript-codegen';
import { execSync } from 'child_process';

const swaggerFilePath = './tools/swagger.json';
const swaggerUrl = 'http://localhost:4000/dev/swagger.json';

try {
  console.log('Downloading Swagger JSON from', swaggerUrl);
  execSync(`curl -X GET ${swaggerUrl} -o ${swaggerFilePath}`, { stdio: 'inherit' });
  console.log('Swagger JSON downloaded successfully.');
} catch (error: any) {
  console.error('Error downloading Swagger JSON:', error.message);
  console.error('stderr:', error.stderr);
  process.exit(1);
}

if (fs.existsSync(swaggerFilePath)) {
  const swaggerJson = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));

  const tsSourceCode = CodeGen.getTypescriptCode({
    className: 'ApiClient',       // The name of the TypeScript class you want to generate
    swagger: swaggerJson,         // Your Swagger JSON object
    imports: [],                  // If you have additional imports (e.g., typings), add them here
    beautify: true,               // Beautify the generated code
    template: {
      class: fs.readFileSync(path.join(__dirname, "templates/class.mustache"), "utf-8"),
      method: fs.readFileSync(path.join(__dirname, "templates/method.mustache"), "utf-8"),
      type: fs.readFileSync(path.join(__dirname, "templates/type.mustache"), "utf-8")
    }
  });

  console.log(tsSourceCode);

  fs.writeFileSync('./src/generated-api-client.ts', tsSourceCode);
  console.log('TypeScript code written to ./src/generated-api-client.ts');
} else {
  console.error('Swagger file not found at:', swaggerFilePath);
  process.exit(1);
}