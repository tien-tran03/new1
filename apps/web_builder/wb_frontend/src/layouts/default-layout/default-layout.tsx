import { Outlet, useNavigate } from "react-router-dom";
import { DefaultFcProps, HasClasses } from "../../react_utils";
import {
  Header,
  Sidebar,
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

export const DefaultLayout: React.FC<DefaultFcProps & HasClasses> = ({
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

      // If token is invalid, refresh it
      if (verifyTokenRequest.status === 400) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          // If refresh token exists, attempt to refresh the access token
          const refreshTokenRequest = await getApiClient().postRefresh({
            body: {
              refreshToken: refreshToken
            }
          });

          if (refreshTokenRequest.status === 200) {
            // Make sure to check if 'accessToken' exists in the response
            const { accessToken } = refreshTokenRequest.body || {};

            if (accessToken) {
              // Update access token in Redux store
              dispatch(setAccessToken(accessToken));
            } else {
              // If no access token, mark it as invalid
              isAccessTokenValid = false;
            }
          } else {
            // If refresh token is invalid, set access token as invalid
            isAccessTokenValid = false;
          }
        } else {
          // If no refresh token exists, set access token as invalid
          isAccessTokenValid = false;
        }
      }

      // If the access token is invalid, redirect to the login page
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
        <title>Ranoar No-Code</title> {/* Set a default page title */}
        <meta name="description" content="Welcome to the Ranoar No-Code platform" />
      </Helmet>
      <div className={classes.pageWrapper} >
        <div className="flex w-full flex-1 md:pl-14 sm:pl-16">
          <Sidebar />
          <div className="flex-1 pt-16 ml-10 mr-3">
            <Header />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
