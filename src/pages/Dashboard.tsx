import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  Briefcase, 
  Building, 
  Calendar,
  Clock,
  MapPin,
  BarChart2,
  FileText,
  Bell
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

const applicationStats = [
  { name: 'Applied', value: 12 },
  { name: 'Interview', value: 5 },
  { name: 'Offer', value: 2 },
  { name: 'Rejected', value: 3 },
];

const weeklyActivity = [
  { name: 'Mon', applications: 2 },
  { name: 'Tue', applications: 3 },
  { name: 'Wed', applications: 1 },
  { name: 'Thu', applications: 4 },
  { name: 'Fri', applications: 2 },
  { name: 'Sat', applications: 0 },
  { name: 'Sun', applications: 0 },
];

const upcomingInterviews = [
  {
    id: 1,
    company: "TechCorp",
    position: "Frontend Developer1",
    date: "Apr 15, 2025",
    time: "10:00 AM",
    type: "Video Call"
  },
  {
    id: 2,
    company: "DesignStudio",
    position: "UX/UI Designer",
    date: "Apr 18, 2025",
    time: "02:30 PM",
    type: "In-person"
  }
];

const recentApplications = [
  {
    id: 1,
    position: "Frontend Developer",
    company: "TechCorp",
    logo: "TC",
    date: "Apr 10, 2025",
    status: "Interview",
    statusColor: "bg-job-interview-bg text-job-interview"
  },
  {
    id: 2,
    position: "Product Manager",
    company: "ProductLabs",
    logo: "PL",
    date: "Apr 8, 2025",
    status: "Applied",
    statusColor: "bg-job-applied-bg text-job-applied"
  },
  {
    id: 3,
    position: "Full Stack Developer",
    company: "WebSolutions",
    logo: "WS",
    date: "Apr 5, 2025",
    status: "Rejected",
    statusColor: "bg-job-rejected-bg text-job-rejected"
  }
];

const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Job Application Dashboard</h1>
            <p className="text-gray-600">Track your job applications and interviews</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleButtonClick}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button onClick={handleButtonClick}>
              <FileText className="h-4 w-4 mr-2" />
              Update Resume
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22</div>
              <p className="text-xs text-green-600">+5 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Interview Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">41%</div>
              <Progress value={41} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Offer Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18%</div>
              <Progress value={18} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Top Match Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-gray-500">Frontend Developer</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="stats" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="stats">Application Stats</TabsTrigger>
                  <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm" className="text-xs" onClick={handleButtonClick}>
                  <BarChart2 className="h-4 w-4 mr-1" />
                  View All Reports
                </Button>
              </div>
              
              <TabsContent value="stats" className="h-[300px]">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="sm:w-1/3 mb-6 sm:mb-0">
                        <h3 className="text-lg font-medium mb-4">Application Status</h3>
                        <div className="space-y-3">
                          {applicationStats.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className={`w-3 h-3 rounded-full mr-2 ${
                                    item.name === 'Applied' ? 'bg-job-applied' : 
                                    item.name === 'Interview' ? 'bg-job-interview' :
                                    item.name === 'Offer' ? 'bg-job-offer' : 'bg-job-rejected'
                                  }`}
                                ></div>
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <span className="font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="sm:w-2/3 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={applicationStats}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {applicationStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="h-[300px]">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Weekly Application Activity</h3>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip />
                        <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Your scheduled interviews</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.length > 0 ? (
                    upcomingInterviews.map((interview) => (
                      <div 
                        key={interview.id}
                        className="p-3 border rounded-md hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {interview.company.substring(0, 2)}
                          </div>
                          <div>
                            <h4 className="font-medium">{interview.position}</h4>
                            <p className="text-sm text-gray-500">{interview.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {interview.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {interview.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No upcoming interviews</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleButtonClick}>
                  View Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div 
                    key={application.id} 
                    className="flex items-center justify-between hover:bg-secondary/50 p-3 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {application.logo}
                      </div>
                      <div>
                        <h4 className="font-medium">{application.position}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {application.company}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-gray-500 hidden sm:block">
                        <Clock className="h-3.5 w-3.5 inline mr-1" />
                        {application.date}
                      </div>
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${application.statusColor}`}>
                        {application.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={handleButtonClick}>
                View All Applications
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
