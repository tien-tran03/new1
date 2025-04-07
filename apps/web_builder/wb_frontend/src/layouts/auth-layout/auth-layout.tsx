import { Outlet } from "react-router-dom";
import { DefaultFcProps, HasClasses } from "../../react_utils";
export const AuthLayout: React.FC<DefaultFcProps & HasClasses> = ({ classes }) => {
  return (
    <div className={`bg-gray-700 w-full h-full${classes?.pageWrapper}`}>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};
