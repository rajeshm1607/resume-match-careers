
import { useNavigate } from "react-router-dom";

const AuthFooter = ({ message, linkText, linkPath }) => {
  const navigate = useNavigate();
  
  return (
    <p className="text-sm text-gray-600">
      {message}{" "}
      <a
        href={linkPath}
        className="text-primary hover:underline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(linkPath);
        }}
      >
        {linkText}
      </a>
    </p>
  );
};

export default AuthFooter;
