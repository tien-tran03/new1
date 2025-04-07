import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Tabs, Tab, Card, CardContent, Divider, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination
} from "@mui/material";
import toast from "react-hot-toast";
import { callDeleteAPI, callGetAPI } from "../../api_utils";
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from "react-i18next";
import GridViewIcon from '@mui/icons-material/GridView';
import ReorderIcon from '@mui/icons-material/Reorder';
import { styled } from '@mui/material/styles';

interface PageType {
  id: number;
  title: string;
  url_alias: string;
  content: string;
  metaTags?: string[];
  thumbnail_page: string;
}

interface ProjectType {
  id: number;
  name: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  alias: string;
  pages: PageType[];
}

export const ViewProject = () => {
  const { t } = useTranslation('translation');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { alias } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [pages, setPages] = useState<PageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(2);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!alias) {
      toast.error("Không tìm thấy dự án.");
      navigate("/projects");
      return;
    }
    fetchProjectData();
    if (tabValue === 1) {
      fetchPageData();
    }
  }, [alias, currentPage, tabValue, navigate]);

  const ThumbnailImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px 12px 0 0',
    transition: 'transform 0.5s ease',
    transformOrigin: 'center center',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  }));

  const ImageContainer = styled(Box)({
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '40%',
      background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
      pointerEvents: 'none',
    },
  });

  const ViewButton = styled(Button)({
    marginLeft: '8px',
  });

  const fetchProjectData = async () => {
    try {
      Swal.fire({
        title: t("detail_project.loading"),
        text: t("detail_project.loadingt"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await callGetAPI(`/projects-detail/${alias}`);
      if (!response.data || !response.data.project) throw new Error("Dữ liệu không tồn tại.");
      setProject(response.data.project);
      setLoading(false);
      Swal.close();
    } catch (error) {
      toast.error("Không thể tải thông tin dự án.");
      setError("Không thể lấy dữ liệu.");
      setLoading(false);
      Swal.close();
    }
  };

  const fetchPageData = async () => {
    try {
      const offset = (currentPage - 1) * limit;
      const response = await callGetAPI(`/page-detail/${alias}?limit=${limit}&offset=${offset}`);
      if (!response.data || !response.data.pages) throw new Error("Dữ liệu không tồn tại.");
      setPages(response.data.pages);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Không thể tải thông tin trang.");
      setError("Không thể lấy dữ liệu.");
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDelete = async (url_alias: string) => {
    const result = await Swal.fire({
      title: t("detail_project.title_delete"),
      text: t("detail_project.title_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("detail_project.confirm_button_yes"),
      cancelButtonText: t("detail_project.confirm_button_no"),
    });

    if (result.isConfirmed) {
      try {
        const response = await callDeleteAPI(`/projects/${alias}/${url_alias}`);
        if (response.status === 200) {
          const offset = (currentPage - 1) * limit;
          const updatedResponse = await callGetAPI(`/page-detail/${alias}?limit=${limit}&offset=${offset}`);
          if (updatedResponse.data && updatedResponse.data.pages) {
            setPages(updatedResponse.data.pages);
            setTotalPages(updatedResponse.data.totalPages || 1);
          }
          toast.success("Page deleted successfully!");
          setPages((prev) => prev.filter((page) => page.url_alias !== url_alias));
        }
      } catch (error) {
        toast.error("Failed to delete the page.");
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleViewThumbnail = (thumbnail_page: string, title: string) => {
    Swal.fire({
      title: title,
      imageUrl: thumbnail_page,
      imageAlt: title,
      imageWidth: '100%',
      imageHeight: 'auto',
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  if (loading) return <h2>{t("detail_project.loading")}</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <Container>
      <Card>
        <>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label={t("detail_project.details_project")} />
            <Tab label={t("detail_project.page")} />
          </Tabs>
          <Divider sx={{ my: 2 }} />
          {tabValue === 0 && (
            <>
              <TextField fullWidth label={t("detail_project.project_name")} value={project?.name || ""} InputProps={{ readOnly: true, style: { opacity: 0.6 } }} sx={{ mb: 2 }} />
              <TextField fullWidth label={t("detail_project.description")} value={project?.description || ""} InputProps={{ readOnly: true, style: { opacity: 0.6 } }} sx={{ mb: 2 }} multiline rows={3} />
              <TextField fullWidth label={t("detail_project.created_on")} value={project ? new Date(project.createdAt).toLocaleString("en-GB") : "N/A"} InputProps={{ readOnly: true, style: { opacity: 0.6 } }} sx={{ mb: 2 }} />
              <TextField fullWidth label={t("detail_project.updated_on")} value={project ? new Date(project.updatedAt).toLocaleString("en-GB") : "N/A"} InputProps={{ readOnly: true, style: { opacity: 0.6 } }} sx={{ mb: 2 }} />
            </>
          )}
          {tabValue === 1 && (
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/create-page/${alias}`)}
                  sx={{ mb: 2 }}
                >
                  {t("detail_project.create_new_page")}
                </Button>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_event, newViewMode) => {
                    if (newViewMode !== null) {
                      setViewMode(newViewMode);
                    }
                  }}
                  aria-label="view mode"
                >
                  <ToggleButton
                    value="list"
                    aria-label="list view"
                    sx={{
                      borderRadius: "30px",
                      padding: "3px 8px",
                      backgroundColor: viewMode === "list" ? "#1e40af" : "transparent",
                      color: viewMode === "list" ? "white" : "black",
                      boxShadow: viewMode === "list" ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
                      transition: "all 0.3s ease",
                      fontSize: "14px",
                      height: "40px",
                    }}
                  >
                    <GridViewIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="grid"
                    aria-label="grid view"
                    sx={{
                      borderRadius: "30px",
                      padding: "3px 8px",
                      backgroundColor: viewMode === "grid" ? "#1e40af" : "transparent",
                      color: viewMode === "grid" ? "white" : "black",
                      boxShadow: viewMode === "grid" ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
                      transition: "all 0.3s ease",
                      fontSize: "14px",
                      height: "40px",
                    }}
                  >
                    <ReorderIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {viewMode === 'list' ? (
                <Grid container spacing={3}>
                  {pages.map((page) => (
                    <Grid item xs={12} sm={6} md={4} key={page.id}>
                      <Card sx={{ p: 2, boxShadow: 3, backgroundColor: "#f9f9f9", height: "100%" }}>
                        <ImageContainer>
                          <Typography variant="h6">{page.title}</Typography>
                          {page.thumbnail_page && (
                            <img
                              src={page.thumbnail_page}
                              alt={page.title}
                              style={{
                                width: "100%",
                                height: "auto",
                                marginTop: "10px",
                              }}
                            />
                          )}
                        </ImageContainer>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/${alias}/pages/${page.url_alias}/edit-content`)}
                          >
                            {t("detail_project.edit")}
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/${alias}/pages/${page.url_alias}/edit-information`)}
                          >
                            {t("detail_project.edit")}
                          </Button>
                          {page.thumbnail_page && (
                            <ViewButton
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={() => handleViewThumbnail(page.thumbnail_page, page.title)}
                            >
                              Xem
                            </ViewButton>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(page.url_alias)}
                          >
                            {t("detail_project.delete")}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <TableContainer sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>{t("detail_project.title")}</TableCell>
                        <TableCell>URL Alias</TableCell>
                        <TableCell>{t("detail_project.meta_tag")}</TableCell>
                        <TableCell>{t("detail_project.Actions")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>{page.id}</TableCell>
                          <TableCell>{page.title}</TableCell>
                          <TableCell>{page.url_alias}</TableCell>
                          <TableCell>{page.metaTags}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => navigate(`/edit/${alias}/${page.url_alias}`)}
                            >
                              {t("detail_project.edit")}
                            </Button>
                            {page.thumbnail_page && (
                              <ViewButton
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => handleViewThumbnail(page.thumbnail_page, page.title)}
                              >
                               Sửa
                              </ViewButton>
                            )}
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(page.url_alias)}
                            >
                              {t("detail_project.delete")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
              />
            </CardContent>
          )}
        </>
      </Card>
    </Container>
  );
};