
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <span className="bg-primary text-white p-2 rounded">Job</span>
            <span>Match</span>
          </h1>
          <p className="text-gray-600 mt-2">Your intelligent job matching platform</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
