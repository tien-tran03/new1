import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getBaseApiUrl } from "../../config_helper";
import { useNavigate, useParams } from "react-router-dom";
import { selectAccessToken, useAppSelector } from "../../redux_logic";
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';

interface PageFormValues {
  url_alias: string;
  title?: string;
  metaTags?: string;
  sections?: string;

}

const pageSchema = yup.object({
  url_alias: yup
    .string()
    .required("URL alias is required")
    .matches(/^[a-z0-9-_]+$/, "Alias should be lowercase and hyphen-separated"),
  title: yup.string().optional(), // Không bắt buộc
  metaTags: yup.string().nullable().optional(), // Không bắt buộc
  sections: yup.string().optional(), // Không bắt buộc

});

interface CreatePageFormProps {
  onClose: () => void;
}

export const CreatePageForm: React.FC<CreatePageFormProps> = ({ onClose }) => {
  const { t } = useTranslation('translation');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { alias: projectAlias } = useParams();
  const token = useAppSelector(selectAccessToken);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PageFormValues>({
    resolver: yupResolver(pageSchema) as any,
  });

  const mutation = useMutation({
    mutationFn: async (newPage: PageFormValues) => {
      try {
        const response = await axios.post(
          `${getBaseApiUrl()}/projects/${projectAlias}/create-new-page`, // Adjust endpoint based on the backend API
          newPage,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error during API call:", error);
        throw new Error(error.response?.data?.error || "Failed to create page");
      }
    },
    onSuccess: () => {
      navigate(`/projects/view/${projectAlias}`);
      toast.success("Page created successfully!");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create page");
    },
  });

  const onSubmit: SubmitHandler<PageFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col bg-gray-100 p-5">
       <Helmet>
        <title>{t("edit_page.create_page")}</title>
        <meta name="description" content="" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">{t("edit_page.create_page")}</h2>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">

          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700">{t("edit_page.title")}</label>
            <input
              {...register("title")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter title"
            />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          </div>

          {/* URL Alias */}
          <div>
            <label className="block text-lg font-medium text-gray-700">URL Alias:</label>
            <input
              {...register("url_alias")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter URL alias"
            />
            <p className="text-red-500 text-sm">{errors.url_alias?.message}</p>
          </div>

          
          {/* Meta Tags */}
          <div>
            <label className="block text-lg font-medium text-gray-700">{t("edit_page.meta_tag")}</label>
            <input
              {...register("metaTags")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter meta tags"
            />
            <p className="text-red-500 text-sm">{errors.metaTags?.message}</p>
          </div>

          {/* Sections */}
          <div hidden>
            <label className="block text-lg font-medium text-gray-700">Sections:</label>
            <textarea
              {...register("sections")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter sections"
              rows={4}
            />
            <p className="text-red-500 text-sm">{errors.sections?.message}</p>
          </div>

          {/* Thumbnail Page URL */}
          {/* <div>
            <label className="block text-lg font-medium text-gray-700">Thumbnail Page URL:</label>
            <input
              type="text"
              {...register("thumbnailPage")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter image URL"
            />
            <p className="text-red-500 text-sm">{errors.thumbnailPage?.message}</p>
          </div> */}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                navigate(`/projects/view/${projectAlias}`);
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-lg"
            >
             {t("edit_page.cancel")}
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
            >
               {t("edit_page.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
