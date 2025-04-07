import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Popover from "@mui/material/Popover";
import LanguageIcon from "@mui/icons-material/Language";
import { SearchBar } from "../search_bar";
import {
  useAppSelector,
  selectIsLoggedIn,
  useAppDispatch,
  logOut,
  sessionStorageKeys,
} from "../../redux_logic";
import { getApiClient } from "../../api_utils";
import { useTranslation } from "react-i18next";
import { locales } from "../../i18n/i18n";

// Định nghĩa hàm gọi API logout
const logoutRequest = async (): Promise<any> => {
  const logoutResponse = await getApiClient().postLogout({});
  return logoutResponse.body;
};

export function Header() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('translation');
  const currentLanguage = locales[i18n.language as keyof typeof locales];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const languageOpen = Boolean(languageAnchorEl);
  const navigate = useNavigate();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const appDispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: logoutRequest,

    onSuccess: () => {
      appDispatch(logOut());
      localStorage.removeItem("refreshToken");
      navigate("/auth/login");
      setLoading(false);
    },

    onError: (error: Error) => {
      console.error("Logout error:", error);
      setLoading(false);
      toast.error(
        "An error occurred while logging out. Please try again later."
      );
    },
  });

  const { mutate: logout } = mutation;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    handleMenuClose();
    navigate("/auth/login");
  };

  const handleRegisterClick = () => {
    handleMenuClose();
    navigate("/auth/register");
  };
  const handleProfileClick = () => {
    handleMenuClose();
    const userId = localStorage.getItem(sessionStorageKeys.userId);

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    navigate(`/profile/${userId}`);
  };

  const handleLogoutClick = () => {
    if (!loading) {
      setLoading(true);
      logout();
    }
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleChangeLanguage = (lng: 'en' | 'vi') => {
    localStorage.setItem('language', lng);
    i18n.changeLanguage(lng);
    handleLanguageClose();
  };
  // const changeLanguage = (lng: 'en' | 'vi') => {
  //   i18n.changeLanguage(lng);
  // }
  return (
    <Box
      className="bg-white text-black shadow-md w-full"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <Toolbar className="flex justify-between items-center px-4 md:px-6 border-b border-gray-300">
        <Typography variant="h6" className="font-bold text-lg">
        </Typography>

        <div className="flex items-center gap-3">
          <SearchBar />

          <Box className="flex items-center gap-4">
            {/* Language Toggle Button */}
            <IconButton
              className="text-black flex items-center gap-2"
              onClick={handleLanguageClick}
            >
              <LanguageIcon />
              <span className="text-sm font-semibold">{currentLanguage}</span> {/* Text next to the icon */}
            </IconButton>

            {/* Language Popover */}
            <Popover
              anchorEl={languageAnchorEl}
              open={languageOpen}
              onClose={handleLanguageClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <MenuItem onClick={() => handleChangeLanguage("vi")}>Tiếng Việt</MenuItem>
              <MenuItem onClick={() => handleChangeLanguage("en")}>English</MenuItem>
            </Popover>

            <Box
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleMenuOpen}
            >
              <IconButton className="p-0">
                <img
                  src="/header_img/Ellipse 1.png"
                  alt="User Icon"
                  className="rounded-full w-8 h-8"
                />
              </IconButton>
              <Box className="hidden md:flex items-center gap-1">
                <span className="text-sm font-semibold"> {t('header.account')}</span>
                <KeyboardArrowDownIcon />
              </Box>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{ className: "mt-1 min-w-[150px]" }}
          >
            {!isLoggedIn ? (
              <>
                <MenuItem onClick={handleLoginClick}>Login</MenuItem>
                <MenuItem onClick={handleRegisterClick}>Register</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={handleProfileClick}>{t('header.profile')}</MenuItem>
                <MenuItem onClick={handleLogoutClick}>
                  {loading ? t('header.logOut') : t('header.logout')}
                </MenuItem>
              </>
            )}
          </Menu>
        </div>
      </Toolbar>
    </Box>
  );
}
