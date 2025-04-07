const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Đường dẫn gốc của bạn (wb_serverless)
const baseDir = path.resolve(__dirname, '../');
const targetDir = path.resolve(baseDir, 'swagger');

// Chạy hàm để sao chép file và tạo Swagger definitions
copyAndBuildSwagger();

// --------functions
// Hàm sao chép file từ thư mục gốc sang thư mục đích
function copyFile(source, destination) {
  const destinationDir = path.dirname(destination);

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  fs.copyFileSync(source, destination);
  console.log(`Copied: ${source} to ${destination}`);
}

// Hàm tạo Swagger definitions từ các file .dao.d.ts
function generateSwaggerDefinitions(onDone) {
  const swaggerDefinitions = {};

  // Tìm tất cả các file .dao.d.ts trong thư mục con có tên bắt đầu bằng 'wb_api_'
  glob(`${baseDir}/wb_api_*/dist/types/**/*.dao.d.ts`, (err, files) => {
    if (err) {
      console.error('Error finding .dao.d.ts files:', err);
      return;
    }

    console.log('Found files:', files);  // In ra danh sách các file tìm được

    if (files.length === 0) {
      console.error("No .dao.d.ts files found.");
      return;
    }

    // Đọc và tạo các Swagger models từ các file .dao.d.ts
    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');  // Đọc nội dung file .dao.d.ts

      console.log(`Reading file: ${file}`);  // Debugging: Hiển thị tên file
      console.log(`File content: \n${fileContent}`);  // Debugging: Hiển thị nội dung file

      // Parse the types inside the file content
      const typeDefinitions = parseDAOContent(fileContent);

      // Add the parsed types to the swaggerDefinitions object
      Object.keys(typeDefinitions).forEach((typeName) => {
        swaggerDefinitions[typeName] = typeDefinitions[typeName];
      });

      console.log(`Swagger definitions updated with types from ${file}`);
    });

    // Kiểm tra nếu swaggerDefinitions không trống
    if (Object.keys(swaggerDefinitions).length === 0) {
      console.error("No definitions were generated.");
    } else {
      // Lưu các definitions vào file swagger-definitions.json
      fs.writeFileSync(path.resolve(targetDir, 'swagger-definitions.json'), JSON.stringify({ definitions: swaggerDefinitions }, null, 2));
      console.log('Swagger definitions generated.');

      onDone && onDone();
    }
  });
}

// Hàm phân tích các properties trong nội dung file .dao.d.ts
function parseDAOContent(content) {
  const properties = {};
  const regex = /export\s+type\s+(\w+)\s*=\s*{\s*([\s\S]*?)\s*}\s*;/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const typeName = match[1]; // This will capture the name of the type (e.g., LoginDAO)
    const typeProperties = match[2]; // This will capture the properties of the type (e.g., username: string)

    // Create an object for this type definition
    const typeDefinition = { type: 'object', properties: {} };

    // Split the properties and parse them
    typeProperties.split(';').forEach((property) => {
      const [key, value] = property.split(':').map(str => str.trim());
      if (key && value) {
        typeDefinition.properties[key] = { type: value };
      }
    });

    // Log for debugging to see type and properties
    console.log(`Type name: ${typeName}`);
    console.log(`Type definition:`, typeDefinition);

    // Add the generated type to the swaggerDefinitions object
    properties[typeName] = typeDefinition;
  }

  console.log("Parsed properties:", properties);  // Debugging: Show the parsed properties
  return properties;
}

// Hàm chính để sao chép file và tạo Swagger definitions
function copyAndBuildSwagger() {
  // Bước 1: Sao chép các file .dao.d.ts vào thư mục đích
  glob(`${baseDir}/wb_api_*/dist/types/**/*.dao.d.ts`, (err, files) => {
    if (err) {
      console.error('Error finding .dao.d.ts files:', err);
      return;
    }

    files.forEach((file) => {
      const targetFilePath = path.join(targetDir, path.relative(baseDir, file));
      copyFile(file, targetFilePath);  // Sao chép từng file
    });

    // Bước 2: Tạo Swagger definitions từ các file .dao.d.ts
    generateSwaggerDefinitions(() => {
      cleanTypes();
    });
  });
}

function cleanTypes() {
  const folderNames = fs.readdirSync(targetDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  folderNames.forEach(folderName => {
    try {
      const folderPath = path.join(targetDir, folderName);
      if (!fs.existsSync(folderPath)) return;
      //
      fs.rmSync(folderPath, { recursive: true });
    } catch (err) {
      console.error(err);
    }
  })
}