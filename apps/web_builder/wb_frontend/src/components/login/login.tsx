import { useState } from 'react'; // Thêm useEffect để kiểm tra localStorage
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { setData, useAppDispatch } from '../../redux_logic';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoginResponseDAO } from '@kis/wb-api-services/dist/generated-api-client';
import { motion } from "framer-motion";
import { getApiClient } from '../../api_utils';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';  // Import Helmet

interface LoginFormData {
  username: string;
  password: string;
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (data: LoginFormData): Promise<LoginResponseDAO> => {
    const loginResponse = await getApiClient().postLogin({
      body: {
        username: data.username,
        password: data.password,
      },
    });
    return loginResponse.body as LoginResponseDAO;
  };

  const checkUserRole = async (accessToken: string) => {
    const response = await fetch("http://localhost:4000/dev/check-user-role", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to check user role");
    }

    return response.json();
  };
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (responseData: LoginResponseDAO) => {
      appDispatch(setData({
        isLoggedIn: true,
        accessToken: responseData.accessToken || "",
        userId: responseData.userId?.toString() || "",
        userName: responseData.username || "",
      }));

      if (responseData.refreshToken) {
        localStorage.setItem("refreshToken", responseData.refreshToken);
      } else {
        console.error("Refresh token is missing.");
      }
      toast.success("Login successful!", { position: "top-right" });
      try {
        const roleResponse = await checkUserRole(responseData.accessToken ?? "");
        if (roleResponse.role === "ADMIN") {
          navigate(`/managerment`);
        } else {
          navigate("/dashboard");
        }
      } catch (error: any) {
        toast.error(error.message || "Could not verify user role.");
      }
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error('Username or password is invalid!');
      } else if (error?.response?.status === 404) {
        toast.error('User not found!');
      } else if (error?.response?.status === 403) {
        toast.error('User is deactivated');
      } else {
        toast.error('An unexpected error occurred!');
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data); // Trigger the mutation
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <>
      <Helmet>
        <title>Login to Ranoar No-Code – The Future of No-Code Websites</title>
        <meta name="description" content="Login to your Ranoar No-Code account" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="relative min-h-screen">
          <img
            src="/images/header_img/Group 12519.png"
            alt="Logo"
            className="absolute top-3 left-3 w-14 h-auto z-50"
          />
          <div className="flex min-h-screen bg-gray-100">
            <div className="hidden md:flex w-3/5 bg-gradient-to-tr from-black justify-center items-center relative">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="z-10 text-white text-center w-full h-full flex justify-center items-center">
                <div className="flex flex-col items-start space-y-2">
                  <h1 className="font-extrabold text-6xl text-left">Ranoar <br /> No-Code</h1>
                  <div className="font-normal text-3xl">A No-code website builder</div>
                </div>
              </div>
            </div>
            <div className="
            flex-1 
            w-full 
            md:w-2/5 
            flex 
            justify-center 
            items-center 
            p-6 
            md:p-12
            "
            >
              <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg min-h-[450px]">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h1>
                <div className="mb-6">
                  <TextField
                    label="Username"
                    id="username"
                    {...register("username", { required: "Username is required" })}
                    fullWidth
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                </div>
                <div className="mb-6">
                  <TextField
                    label="Password"
                    id="password"
                    {...register("password", { required: "Password is required" })}
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="
                  w-full
                bg-blue-600
                text-white 
                  font-bold 
                  py-3 p
                  x-4 
                  rounded-lg
                hover:bg-blue-700 
                  focus:outline-none 
                  focus:ring-2
                focus:ring-blue-500 
                  transition-colors"
                >
                  Login
                </button>
                <p className="text-center text-sm text-gray-500 mt-6">
                  Don't have an account?
                  <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate("/auth/register")}>
                    Sign Up
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
