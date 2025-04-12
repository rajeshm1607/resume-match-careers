
import { useNavigate } from "react-router-dom";

interface AuthFooterProps {
  message: string;
  linkText: string;
  linkPath: string;
}

const AuthFooter = ({ message, linkText, linkPath }: AuthFooterProps) => {
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
