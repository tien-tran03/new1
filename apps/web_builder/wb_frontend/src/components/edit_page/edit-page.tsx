import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getBaseApiUrl } from "../../config_helper";
import { useNavigate, useParams } from "react-router-dom";
import { selectAccessToken, useAppSelector } from "../../redux_logic";
import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async"; 

interface PageFormValues {
  url_alias: string;
  title?: string;
  metaTags?: string;
   
}
const pageSchema = yup.object({
  url_alias: yup
    .string()
    .required("URL alias is required.")
    .matches(/^[a-z0-9-_]+$/, "Alias should be lowercase and hyphen-separated"),
  title: yup.string().optional(),
  metaTags: yup.string().optional(),
  
});

interface EditPageFormProps {

  onClose: () => void;
}

export const EditPageForm: React.FC<EditPageFormProps> = ({ onClose }) => {
  const { t } = useTranslation('translation');
  const { alias, url_alias } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = useAppSelector(selectAccessToken);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PageFormValues>({
    resolver: yupResolver(pageSchema),
  });

  const mutation = useMutation({
    mutationFn: async (updatedPage: PageFormValues) => {
      try {
        const response = await axios.put(
          `${getBaseApiUrl()}/projects/${alias}/${url_alias}/update`, 
          updatedPage,
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error during API call:", error);
        throw new Error(error.response?.data?.error || "Failed to update page");
      }
    },
    onSuccess: () => {
      navigate(`/projects/view/${alias}`); 
      toast.success("Page updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update page");
    },
  });

  const onSubmit: SubmitHandler<PageFormValues> = (data) => {
    mutation.mutate(data);
  };


  const fetchPageData = async () => {
    try {
      const response = await axios.get(`${getBaseApiUrl()}/page-detail/${alias}/${url_alias}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const page = response.data.page;

      setValue("url_alias", page.url_alias);
      setValue("title", page.title);
      setValue("metaTags", page.metaTags);
    
    } catch (error) {
      toast.error("Failed to load page data");
    }
  };


  React.useEffect(() => {
    fetchPageData();
  }, [alias, url_alias, token]);

  return (
    <div className="flex flex-col bg-gray-100 p-5">
        <Helmet>
        <title>{t("edit_page.edit_page")}</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">{t("edit_page.edit_page")}</h2>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
          
          <div>
            <label className="block text-lg font-medium text-gray-700">{t("edit_page.title")}</label>
            <input
              {...register("title")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter page title"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">URL Alias:</label>
            <input
              {...register("url_alias")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter page URL alias"
            />
            <p className="text-red-500 text-sm">{errors.url_alias?.message}</p>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">{t("edit_page.meta_tag")}</label>
            <input
              {...register("metaTags")}
              className="border p-3 w-full rounded mt-1 text-lg"
              placeholder="Enter page meta tags"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(`/projects/view/${alias}`)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-lg"
            >
             {t("edit_page.cancel")}
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
            >
              {t("edit_page.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
