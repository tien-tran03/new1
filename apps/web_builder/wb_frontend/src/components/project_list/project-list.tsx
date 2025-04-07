import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ContextMenu, MenuActions } from "./components";
import { HasData } from "../../react_utils";
import { selectSearchKeyword } from "../../redux_logic";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid } from "@mui/x-data-grid";
import { Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ReorderIcon from '@mui/icons-material/Reorder';
import GridViewIcon from '@mui/icons-material/GridView';
import AddIcon from '@mui/icons-material/Add';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { DuplicateProjectModal, DeleteProjectModal } from "../project_detail/page";
import { callDeleteAPI, callGetAPI, callPostAPI } from "../../api_utils";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';
import Popover from "@mui/material/Popover";
import FileCopyIcon from '@mui/icons-material/FileCopy';

export const ProjectList: React.FC<HasData> = ({ }) => {
  const { t } = useTranslation('translation');
  const [selectedProjectAlias, setSelectedProjectAlias] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const navigate = useNavigate();
  const keyword = useSelector(selectSearchKeyword);

  useEffect(() => {
    const fetchProjects = async () => {
      Swal.fire({
        title: t('projects_list.loading'),
        text: t('projects_list.loadingt'),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const endpoint = keyword
          ? `/projects?name=${keyword}&page=${currentPage}&limit=8`
          : `/projects?page=${currentPage}&limit=8`;

        const projectResponse = await callGetAPI(endpoint);

        if (projectResponse.data && projectResponse.data.projects) {
          setProjectsData(projectResponse.data.projects);
          setTotalProjects(projectResponse.data.count_item_projects);
          setTotalPages(projectResponse.data.totalPages || 1);
        } else {
          console.error("No projects found in the response.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        Swal.fire("Error!", "Failed to load projects. Please try again.", "error");
      } finally {
        Swal.close();
      }
    };

    fetchProjects();
  }, [keyword, currentPage]);

  useEffect(() => {
    const fetchFilteredProjects = async () => {
      if (keyword) {
        setLoading(true);
        try {
          const projectResponse = await callGetAPI(`/projects?name=${keyword}&page=${currentPage}&limit=8`);

          if (projectResponse.data && projectResponse.data.projects) {
            setProjectsData(projectResponse.data.projects);
            setTotalPages(projectResponse.data.totalPages || 1);
          } else {
            console.error("No projects found in the response.");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFilteredProjects();
  }, [keyword, currentPage]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, projectId: number, projectAlias: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectAlias(projectAlias);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (menuActions: MenuActions) => {
    if (selectedProjectId === null) return;

    switch (menuActions) {
      case MenuActions.view:
        navigate(`/projects/view/${selectedProjectAlias}`);
        break;
      case MenuActions.edit:
        navigate(`/project_detail/${selectedProjectId}/edit`);
        break;
      case MenuActions.duplicate:
        setOpenDuplicateModal(true);
        break;
      case MenuActions.delete:
        setOpenDeleteModal(true);
        break;
      default:
        console.log(`Action: ${MenuActions[menuActions]} on Project ID: ${selectedProjectId}`);
        break;
    }
    handleMenuClose();
  };

  const handleCreateNewProject = () => {
    navigate("/create-new-project");
  };

  const handleDuplicateProject = async (projectId: number) => {
    try {
      const duplicateResponse = await callPostAPI(`/projects/${projectId}/duplicate`, {});

      if (duplicateResponse.status === 201) {
        const updatedProjects = await callGetAPI(`/projects?page=${currentPage}&limit=8`);

        if (updatedProjects.data && updatedProjects.data.projects) {
          setProjectsData(updatedProjects.data.projects);
          setTotalProjects(updatedProjects.data.count_item_projects);
          setTotalPages(updatedProjects.data.totalPages || 1);
        }

        setOpenDuplicateModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Project duplicated successfully.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to duplicate the project. Please try again later.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProjectId) return;

    try {
      await callDeleteAPI(`/projects/${selectedProjectId}`);

      const updatedResponse = await callGetAPI(`/projects?page=${currentPage}&limit=8`);
      setProjectsData(updatedResponse.data.projects);
      setTotalProjects(updatedResponse.data.count_item_projects);
      setTotalPages(updatedResponse.data.totalPages || 1);

      Swal.fire("Deleted!", "Project has been successfully deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the project, please try again.", "error");
    } finally {
      setOpenDeleteModal(false);
      setSelectedProjectId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setSelectedProjectId(null);
  };
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, project: any) => {
    console.log(project);
    setPopoverAnchorEl(event.currentTarget);
    setPopoverOpen(true);
    setSelectedProjectId(project.id); // Đảm bảo theo dõi ID của dự án đã chọn
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setSelectedProjectId(null); // Đặt lại ID dự án khi đóng popover
  };

  const handleCopyImage = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Đã sao chép!',
        text: 'URL của ảnh đã được sao chép vào clipboard.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Không thể sao chép!',
        text: 'Không thể sao chép URL của ảnh. Vui lòng thử lại.',
      });
    });
  };


  const columns = [
    { field: "id", headerName: "ID", width: 70, flex: 0.4 },
    { field: "name", headerName: t('projects_list.project_name'), width: 200, flex: 1 },
    { field: "createdAtFormatted", headerName: t('projects_list.created'), width: 150, flex: 1 },
    { field: "updatedAtFormatted", headerName: t('projects_list.last_updated'), width: 150, flex: 1 },
    {
      field: "thumbnail",
      headerName: "Thumbnail",
      width: 200,

      renderCell: (params: any) => (
        <div>
          <img
            src={params.row.thumbnail}
            alt="thumbnail"
            className="w-full h-20 object-cover"
            onClick={(e) => handlePopoverOpen(e, params.row)}  // Open popover on click
          />
          <Popover
            open={popoverOpen && selectedProjectId === params.row.id} // Kiểm tra nếu popover cần mở cho dự án này
            anchorEl={popoverAnchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}

          >
            <div className="p-4">
              <img
                src={params.row.thumbnail}
                alt={params.row.thumbnail}
                className="w-64 h-64 object-cover"
              />
              <button
                onClick={() => handleCopyImage(params.row.thumbnail)}
                className="
                absolute 
                top-2 
                right-2 
                px-2 
                py-2 
                bg-transparent 
                text-white 
                rounded-lg flex 
                items-center 
                justify-center 
                opacity-60 
                hover:opacity-100 
                hover:bg-blue-500 
                transition-all 
                duration-300"
              >
                <FileCopyIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
          </Popover>

        </div>
      ),
    },

    {
      field: "actions",
      headerName: "",
      width: 70,
      flex: 0.5,
      renderCell: (params: any) => (
        <button onClick={(e) => handleMenuOpen(e, params.row.id, params.row.alias)} className="hover:text-gray-800">
          <MoreVertIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="p-5 max-w-full mx-auto pl-16 sm:pl-0 md:pl-0 lg:pl-0">
      <Helmet>
        <title>{t('projects_list.list_projects')}</title>
        <meta name="description" content="T " />
      </Helmet>

      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h2" className="font-bold">
          {t('projects_list.list_projects')}
        </Typography>

        <div className="flex items-center space-x-4">
          <div className="transition-all duration-500 ease-in-out flex items-center">
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
          </div>

          <Button
            variant="contained"
            onClick={handleCreateNewProject}
          >
            <AddIcon sx={{ fontSize: 24, marginRight: "12px" }} /> {t('projects_list.create_new_project')}
          </Button>

        </div>
      </div>
      <p className="text-lg font-semibold mb-3">{t('projects_list.all_projects_you_have')} ({totalProjects})</p>

      {loading ? null : (
        <>
          <div className="transition-all duration-500 ease-in-out">
            {viewMode === 'grid' ? (
              <DataGrid
                rows={projectsData.map((p) => ({ ...p, id: p.id || p._id }))}
                columns={columns}
                sx={{
                  width: "100%",
                  minWidth: "600px",
                  maxWidth: "100%",
                }}
                className="overflow-x-auto"
                hideFooter
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projectsData.map((project: any) => (
                  <div key={project.id} className="relative shadow-lg transition-all duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
                    <Link to={`/projects/view/${project.alias}`}>
                      <div>
                        <LazyLoadImage
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-60 object-cover rounded-lg"
                        />
                        <Typography variant="h6" className="text-lg font-semibold mb-2 pt-2 pl-2">
                          {project.name}
                        </Typography>
                        <Typography variant="body2" className="text-sm text-gray-500 p-2">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </Typography>
                      </div>
                    </Link>

                    <button
                      onClick={(e) => handleMenuOpen(e, project.id, project.alias)}
                      className="absolute bottom-2 right-2"
                    >
                      <MoreVertIcon className="text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {projectsData.length === 0 && !loading && <p> {t('projects_list.no_projects_found')}</p>}
        </>
      )}

      <div className="flex justify-center mt-4">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            variant="outlined"
            shape="rounded"
            onChange={(_event, value) => setCurrentPage(value)}
          />
        </Stack>
      </div>

      <ContextMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onAction={handleMenuAction}
      />

      {openDuplicateModal && selectedProjectId !== null && (
        <DuplicateProjectModal
          projectId={selectedProjectId}
          onClose={() => setOpenDuplicateModal(false)}
          onDuplicate={handleDuplicateProject}
        />
      )}

      {openDeleteModal && (
        <DeleteProjectModal
          projectId={selectedProjectId}
          onConfirmDelete={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
