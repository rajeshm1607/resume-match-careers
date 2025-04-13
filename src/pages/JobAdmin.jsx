import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/layouts/MainLayout";
import JobScraper from "@/components/JobScraper.jsx";

const JobAdmin = () => {
  const [activeTab, setActiveTab] = useState("scraper");
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Job Portal Administration</h1>
            <p className="text-gray-600">Manage job listings and sources</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full max-w-md">
            <TabsTrigger value="scraper">LinkedIn Scraper</TabsTrigger>
            <TabsTrigger value="manage">Manage Jobs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scraper" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Job Scraper</CardTitle>
                <CardDescription>
                  Scrape job listings from LinkedIn and add them to your database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JobScraper />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Jobs</CardTitle>
                <CardDescription>
                  View, edit, and delete job listings in your database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  Job management interface will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scraper Settings</CardTitle>
                <CardDescription>
                  Configure scraper settings and job sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  Scraper settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default JobAdmin;
