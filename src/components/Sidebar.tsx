
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  LayoutDashboard, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  FolderCog
} from "lucide-react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/lib/supabase";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const name = currentUser.user_metadata?.full_name || 
                       currentUser.user_metadata?.name || 
                       currentUser.email?.split('@')[0] || 
                       "User";
          
          setUser({
            name: name,
            email: currentUser.email || "",
            avatar: currentUser.user_metadata?.avatar_url || "",
          });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: "An unexpected error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Jobs",
      icon: Briefcase,
      path: "/jobs",
    },
    {
      title: "Job Admin",
      icon: FolderCog,
      path: "/job-admin",
    },
    {
      title: "Resume",
      icon: FileText,
      path: "/resume",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader className="p-4 flex flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sidebar-foreground" />
            <h1 className="text-xl font-bold text-sidebar-foreground">JobMatch</h1>
          </div>
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-3 py-2">
          <div className="mb-8">
            {user && (
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sidebar-foreground">{user.name}</span>
                  <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
                </div>
              </div>
            )}
          </div>
          
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  className={location.pathname === item.path ? "bg-sidebar-accent" : ""}
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout} 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Log out
        </Button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
