import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Pagination, Typography } from "@mui/material";
import { callGetAPI, callDeleteAPI, callPutAPI } from "../../api_utils";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

export const UserList: React.FC = () => {
  const { t } = useTranslation('translation');
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      Swal.fire({
        title: t('users_list.loading'),
        text: t('users_list.loadingt'),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await callGetAPI(`/users?page=${currentPage}&limit=8`);
        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setTotalUsers(response.data.totalUsers);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to load users. Please try again.", "error");
      } finally {
        Swal.close();
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    try {
      await callDeleteAPI(`/delete-user/${id}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, deletedAt: new Date() } : user
        )
      );
      Swal.fire("Deactive!", "User has been deactivated.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to deactivate user. Please try again.", "error");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await callPutAPI(`/restore-user/${id}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, deletedAt: null } : user
        )
      );
      Swal.fire("Restored!", "User has been restored.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to restore user. Please try again.", "error");
    }
  };
  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.4 },
    { field: "username", headerName: t('users_list.username'), width: 200, flex: 1 },
    { field: "role", headerName: t('users_list.role'), width: 250, flex: 1 },
    { field: "deletedAt", headerName: t('users_list.deletedAt'), width: 250, flex: 1 },
    {
      field: "actions",
      headerName: "",
      width: 200,
      renderCell: (params: any) => (
        <>
          {params.row.deletedAt === null ? (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              {t('users_list.deactive')}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleRestore(params.row.id)}
            >
              {t('users_list.restore')}
            </Button>
          )
          }
        </>
      ),
    },
  ];

  return (
    <div className="flex p-5 max-w-full mx-auto pl-16 sm:pl-0 md:pl-0 lg:pl-0">
      <Helmet>
        <title>{t('users_list.user_title')}</title>
        <meta name="description" content="T " />
      </Helmet>
      <div className="w-5/6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            <Typography variant="h3" component="h2" className="font-bold mb-4">
              {t('users_list.user_title')}
            </Typography>
          </h1>
        </div>
        <div>
          <Typography variant="h5" component="h2" className="font-bold">
            {t('users_list.user_total')} ({totalUsers || 0})
          </Typography>
        </div>
        <div>

        </div>
        <div className="p-5">

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataGrid
                rows={users}
                columns={columns}
                pagination
                hideFooter
                sx={{
                  width: "120%",
                }}
              />

              {users.length === 0 && !loading && <p>No users found</p>}

              <div className="flex justify-center mt-7 ml-32">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
