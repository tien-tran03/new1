// Hướng dẫn sử dụng Minio
B1: Viết docker-compose.yml
services:
  minio:
    image: minio/minio:latest
    container_name: minio
    ports:
      - "9000:9000"     # API port S3-compatible
      - "9001:9001"     # Web UI
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    command: server /data --console-address ":9001"
    volumes:
      - ./minio-data:/data  # Volume to store as

B2: Config trong .env
AWS_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
S3_BUCKET=sample-bucket

B3: Chạy http://localhost:9000
Username (Access Key): minioadmin
Password (Secret Key): minioadmin123

B4: Vào Bucket sửa Access Policy thành custom rồi thêm phần code bên dưới vào:

        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::sample-bucket/*"
            ]
        }
        
B5: Lưu r bú thôi.