
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AuthCard = ({ title, description, children, footer }) => {
  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex justify-center">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default AuthCard;
