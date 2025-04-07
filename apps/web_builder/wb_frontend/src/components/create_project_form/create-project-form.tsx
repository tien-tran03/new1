import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getBaseApiUrl } from "../../config_helper";
import { useNavigate } from "react-router-dom";
import { selectAccessToken, useAppSelector } from "../../redux_logic";
import { Box } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';

interface ProjectFormValues {
  name: string;
  alias: string;
  description: string;
  thumbnail?: string;
}

const projectSchema = yup.object({
  name: yup.string().required("Project name is required"),
  alias: yup.string().required("Alias is required").matches(/^[a-z0-9-_]+$/, "Alias should be lowercase and hyphen-separated"),
  description: yup.string().required("Description is required"),
  thumbnail: yup.string().optional(),
});

interface CreateProjectFormProps {
  onClose: () => void;
}

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

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onClose }) => {
  const { t } = useTranslation('translation');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = useAppSelector(selectAccessToken);

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [urlInput, setUrlInput] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (newProject: ProjectFormValues) => {
      const formData = new FormData();
      formData.append("name", newProject.name);
      formData.append("alias", newProject.alias);
      formData.append("description", newProject.description);
      if (newProject.thumbnail) {
        formData.append("thumbnail", newProject.thumbnail);
      }

      const response = await axios.post(
        getBaseApiUrl() + "/create-new-project", formData,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      navigate("/projects");
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const fetchImageAsFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = url.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    return new File([blob], filename, { type: blob.type });
  };

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    let fileToUpload = selectedFile;

    if (!fileToUpload && urlInput) {
      fileToUpload = await fetchImageAsFile(urlInput);
    }

    if (fileToUpload) {
      const newThumbUrl = await uploadFileToStorage('abc', fileToUpload, token);
      setValue("thumbnail", newThumbUrl);
    }

    mutation.mutate(data);
  };

  useEffect(() => {
    if (urlInput) {
      setPreview(urlInput);
      setSelectedFile(undefined); // Clear the file when URL is added
    }
  }, [urlInput]);

  return (
    <>
      <Helmet>
        <title>{t("creat_projects.create_project")}</title>
        <meta name="description" content="Create a new project in the system" />
      </Helmet>

      <div className="flex flex-col bg-gray-100 p-5">
        <h2 className="text-3xl font-bold mb-6 text-center">{t("creat_projects.create_project")}</h2>

        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">{t("creat_projects.project_name")}</label>
              <input
                {...register("name")}
                className="border p-3 w-full rounded mt-1 text-lg"
                placeholder="Enter project name"
              />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Alias:</label>
              <input {...register("alias")} className="border p-3 w-full rounded mt-1 text-lg" placeholder="Enter project alias" />
              <p className="text-red-500 text-sm">{errors.alias?.message}</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">{t("creat_projects.description")}</label>
              <textarea
                {...register("description")}
                className="border p-3 w-full rounded mt-1 text-lg"
                placeholder="Enter project description"
                rows={4}
              />
              <p className="text-red-500 text-sm">{errors.description?.message}</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Thumbnail:</label>
              <input
                type="text"
                placeholder="Enter image URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="border p-3 w-full rounded mt-1 text-lg"
              />
              <div {...getRootProps()} className="border-dashed border-2 p-5 text-center cursor-pointer mt-3">
                <input {...getInputProps()} />
                <p>Drag & Drop or Click to select file</p>
              </div>
              {preview && (
                <Box sx={{ my: 2 }}>
                  <p className="text-sm text-gray-600">Xem trước:</p>
                  <img src={preview} alt="Thumbnail Preview" style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover" }} />
                </Box>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  navigate("/projects");
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-lg"
              >
                {t("creat_projects.cancel")}
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
              >
                {t("creat_projects.create")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
