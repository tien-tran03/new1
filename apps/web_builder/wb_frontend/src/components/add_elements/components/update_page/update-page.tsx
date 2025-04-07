import { useEditor } from "@craftjs/core";
import UpdateSharpIcon from '@mui/icons-material/UpdateSharp';
import { Box, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callPutAPI, getApiClient } from "../../../../api_utils";
import { getBaseApiUrl } from "../../../../config_helper";
import { sessionStorageKeys } from "../../../../redux_logic";
import domtoimage from "dom-to-image";
import { useParams } from "react-router-dom";

const BASE_URL = getBaseApiUrl() || "http://localhost:4000/dev";
axios.defaults.baseURL = BASE_URL;
const apiClient = getApiClient();
axios.interceptors.response.use(
  async (response) => {
    const originalRequest = response.config;
    if (response.data.name === "TokenExpiredError") {
      try {
        const refreshToken = localStorage.getItem(sessionStorageKeys.refreshToken) || "";
        const refreshTokenRequest = await apiClient.postRefresh({
          body: {
            refreshToken,
          },
        });
        const { accessToken } = refreshTokenRequest.body || {};
        if (accessToken) {
          localStorage.setItem(sessionStorageKeys.accessToken, accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } else {
          localStorage.removeItem(sessionStorageKeys.accessToken);
          localStorage.removeItem(sessionStorageKeys.refreshToken);
          window.location.href = '/login';
        }
      } catch (refreshError) {
        localStorage.removeItem(sessionStorageKeys.accessToken);
        localStorage.removeItem(sessionStorageKeys.refreshToken);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return response;
  },
);

interface SavePageProps {
  title: string;
  alias: string;
  metaTags: string;
  editorRef: React.RefObject<HTMLDivElement>;
}

export const UpdatePage: React.FC<SavePageProps> = ({ title, alias, metaTags, editorRef }) => {
  const { query } = useEditor();
  const token = localStorage.getItem(sessionStorageKeys.accessToken);
  const { projectAlias} = useParams<{ projectAlias: string; urlAlias: string }>(); 

  const captureScreenshot = async () => {
    if (!editorRef.current) return "";
    return domtoimage.toPng(editorRef.current);
  };

  const uploadThumbnail = async (base64: string) => {
    const body = {
      fileName: `thumbnail-${Date.now()}.jpg`,
      fileType: 'image/jpeg',
    };
    const response = await axios.post("/upload-image", body, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response) {
      throw new Error('Failed to get signed URL');
    }
    const signedUrl = response.data?.body as unknown as string;
    if (!signedUrl) {
      throw new Error('Invalid signed URL');
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const uploadResponse = await axios.put(signedUrl, blob, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
    if (uploadResponse.status !== 200) {
      throw new Error('Failed to upload to S3');
    }
    const publicUrl = signedUrl.split('?')[0];
    if (!publicUrl) {
      throw new Error('Invalid public URL');
    }
    return publicUrl;
  };

  const handleSave = async () => {
    try {
      if (!title.trim() || !alias.trim()) {
        throw new Error("Tiêu đề và bí danh không được để trống");
      }

      const jsonData = query.serialize();
      if (!jsonData) {
        throw new Error("Không có dữ liệu layout để lưu");
      }

      const base64 = await captureScreenshot();
      const thumbnail_page = await uploadThumbnail(base64);
      const payload = {
        url_alias: alias,
        title: title,
        metaTags: metaTags,
        sections: jsonData,
        thumbnail_page, 
      };

      toast.info("Đang cập nhật page...", {
        position: "top-right",
        autoClose: false,
        toastId: "saving",
      });

      await callPutAPI(`/projects/${projectAlias}/${alias}/update`, payload);

      toast.dismiss("saving");
      toast.success("Cập nhật page thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error: any) {
      console.error("Lỗi khi cập nhật layout:", error);
      toast.dismiss("saving");
      const errorMessage = error.response?.data?.error || error.message || "Lỗi không xác định";
      toast.error(`Không thể cập nhật page: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Tooltip title="Cập nhật Page" arrow placement="top">
        <IconButton
          onClick={handleSave}
          sx={{
            color: "#ffffff",
            bgcolor: "#1e1e38",
            p: 1,
            
          }}
          size="small"
        >
          <UpdateSharpIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};