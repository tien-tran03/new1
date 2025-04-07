import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { callGetAPI, callPutAPI } from "../../../api_utils";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { getBaseApiUrl } from "../../../config_helper";
import { selectAccessToken, useAppSelector } from "../../../redux_logic";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const uploadFileToStorage = async (bucketName: string, file: File, token: string) => {
  try {
    const response = await axios.post(`${getBaseApiUrl()}/upload-image`, {
      bucketName,
      fileName: file.name,
      fileType: file.type,
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const signedUrl = response.data.body;

    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return signedUrl;
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    throw new Error('Failed to upload file to storage');
  }
};

const fetchImageAsFile = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const extension = url.split('.').pop() || 'jpg';
  const fileName = `${uuidv4()}.${extension}`;
  return new File([blob], fileName, { type: blob.type });
};

export const EditProject: React.FC = () => {
  const { t } = useTranslation('translation');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector(selectAccessToken);

  const [projectName, setProjectName] = useState<string>("");
  const [projectAlias, setProjectAlias] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (!projectId) {
      toast.error("Không có ID dự án.");
      navigate("/projects");
      return;
    }

    const fetchProjectData = async () => {
      try {
        const response = await callGetAPI(`/project-detail/${projectId}`);

        if (!response.data) {
          throw new Error("Dữ liệu không tồn tại.");
        }

        const { name, alias, description, thumbnail } = response.data.project || {};
        setProjectName(name || "");
        setProjectAlias(alias || "");
        setProjectDescription(description || "");
        if (thumbnail) {
          setUrlInput(thumbnail);
          setPreview(thumbnail);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Không thể tải thông tin dự án.");
        navigate("/projects");
      }
    };

    fetchProjectData();
  }, [projectId, navigate]);

  const mutation = useMutation({
    mutationFn: async (
      updatedProject:
        {
          name: string,
          alias: string,
          description: string,
          thumbnail: string
        }) => {
      const response = await callPutAPI(
        `/project-detail/${projectId}`,
        updatedProject,
      );
      return response.data.project;
    },
    onSuccess: () => {
      toast.success("Dự án đã được cập nhật thành công!");
      navigate("/projects");
    },
    onError: (error: any) => {
      console.error("Error saving project:", error.response || error.message);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Có lỗi xảy ra khi lưu dự án. Vui lòng thử lại.");
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setUrlInput(""); // Xóa URL khi chọn file
      }
    },
  });

  const handleSave = async () => {
    if (!projectId) {
      toast.error("Không có ID dự án. Không thể lưu.");
      return;
    }

    let finalThumbnail = "";

    try {
      if (selectedFile) {
        // Upload file đã chọn trực tiếp lên S3
        finalThumbnail = await uploadFileToStorage('abc', selectedFile, token);
      } else if (urlInput) {
        // Tải ảnh từ URL về và upload lên S3 với uuid
        const fileFromUrl = await fetchImageAsFile(urlInput);
        finalThumbnail = await uploadFileToStorage('abc', fileFromUrl, token);
      } else {
        toast.error("Vui lòng chọn file hoặc nhập URL hình ảnh.");
        return;
      }

    } catch (error) {
      console.error("Upload ảnh lên S3 thất bại:", error);
      toast.error("Upload ảnh lên S3 thất bại.");
      return;
    }

    const updatedProject = {
      name: projectName,
      alias: projectAlias,
      description: projectDescription,
      thumbnail: finalThumbnail,
    };

    mutation.mutate(updatedProject);
  };

  return (
    <>
      <Helmet>
        <title>{t('edit_project.edit_project')}</title> {/* Thêm title động nếu cần */}
        <meta name="description" content="T" />
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 2 }}>{t('edit_project.edit_project')}</Typography>

        <TextField
          label={t('edit_project.project_name')}
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ my: 2 }}
        />

        <TextField
          label="Alias"
          fullWidth
          value={projectAlias}
          onChange={(e) => setProjectAlias(e.target.value)}
          sx={{ my: 2 }}
        />

        <TextField
          label={t('edit_project.description')}
          fullWidth
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          sx={{ my: 2 }}
          multiline
          rows={4}
        />

        <TextField
          label="URL hình ảnh"
          fullWidth
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            setPreview(e.target.value);
            setSelectedFile(undefined);
          }}
          onFocus={(e) => e.target.select()}
          sx={{ my: 2 }}
        />

        <div {...getRootProps()} className="border-dashed border-2 p-5 text-center cursor-pointer my-3">
          <input {...getInputProps()} />
          <p>Drag & Drop hoặc Click để chọn file</p>
        </div>

        {preview && (
          <Box sx={{ my: 2 }}>
            <p className="text-sm text-gray-600">Xem trước:</p>
            <img src={preview} alt="Thumbnail Preview" style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover" }} />
          </Box>
        )}
        <Button onClick={() => navigate(-1)} sx={{ my: 2 }}>
          {t('edit_project.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSave} sx={{ my: 2 }}>
          {t('edit_project.save')}
        </Button>
      </Container>
    </>
  );
};
