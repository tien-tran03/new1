import { Outlet, useNavigate } from "react-router-dom";
import { DefaultFcProps, HasClasses } from "../../react_utils";
import {
  HeaderAdmin,
  SidebarAdmin,
} from "../../components";
import {
  selectIsLoggedIn,
  setAccessToken,
  useAppSelector
} from "../../redux_logic";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getApiClient } from "../../api_utils";
import { Helmet } from "react-helmet-async";

export const DefaultLayoutAdmin: React.FC<DefaultFcProps & HasClasses> = ({
  classes
}) => {

  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const goToLogInPage = () => navigate('/auth/login');

  const verifyToken = async () => {
    try {
      const verifyTokenRequest = await getApiClient().postVerifyToken({});

      let isAccessTokenValid = true;

      if (verifyTokenRequest.status === 400) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const refreshTokenRequest = await getApiClient().postRefresh({
            body: {
              refreshToken: refreshToken
            }
          });

          if (refreshTokenRequest.status === 200) {
            const { accessToken } = refreshTokenRequest.body || {};

            if (accessToken) {
              dispatch(setAccessToken(accessToken));
            } else {
              isAccessTokenValid = false;
            }
          } else {
            isAccessTokenValid = false;
          }
        } else {
          isAccessTokenValid = false;
        }
      }

      if (!isAccessTokenValid) {
        goToLogInPage();
      }

    } catch (error) {
      console.error("Error verifying token:", error);
      goToLogInPage();
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      verifyToken();
    } else {
      goToLogInPage();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Helmet>
        <title>Ranoar No-Code</title>
        <meta name="description" content="Welcome to the Ranoar No-Code platform" />
      </Helmet>
      <div className={classes.pageWrapper} >
        <div className="flex w-full flex-1 md:pl-14 sm:pl-16">
          <SidebarAdmin />
          <div className="flex-1 pt-16 ml-10 mr-3">
            <HeaderAdmin />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
