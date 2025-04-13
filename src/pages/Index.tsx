
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { ArrowRight, CheckCircle2, Upload, BarChart3, Briefcase } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Resume Analysis",
      description: "Upload your resume and our AI will analyze your skills and experience."
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
      title: "Job Matching",
      description: "Get personalized job recommendations based on your resume and skills."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Application Tracking",
      description: "Track your job applications and interview progress all in one place."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Joqqqqqqqhnson",
      role: "UX Designer",
      content: "JobMatch helped me find opportunities that perfectly matched my skill set. I landed my dream job in just 3 weeks!",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Frontend Developer",
      content: "The resume matching feature is amazing! It helped me understand what skills I needed to improve to get better matches.",
      avatar: "MC"
    },
    {
      name: "Priya Patel",
      role: "Product Manager",
      content: "I love how JobMatch organizes everything in one place. The application tracking dashboard is a game-changer.",
      avatar: "PP"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">JobMatch</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary">How It Works</a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-primary">Testimonials</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={() => navigate("/login")}
              className="hidden md:inline-flex"
            >
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Find Your Perfect Job Match With <span className="text-primary">AI-Powered</span> Precision
              </h1>
              <p className="text-lg text-gray-600 mb-8 md:pr-12">
                Upload your resume and instantly get matched with jobs that align with your skills, experience, and career goals. Track applications, prepare for interviews, and land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate("/signup")}
                  className="gap-2"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="gap-2"
                >
                  <FcGoogle className="h-5 w-5" />
                  Sign in with Google
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mx-auto max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    95%
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Frontend Developer</h3>
                    <p className="text-sm text-gray-500">TechCorp • San Francisco, CA</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Skills Match</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Experience Match</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Education Match</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Apply Now</Button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full hidden md:block"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-full hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How JobMatch Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform uses advanced AI to match your skills and experience with the perfect job opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-lg border transition-all duration-300 ${
                  hoveredFeature === index ? "border-primary shadow-lg" : "border-gray-200"
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Simple Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and find your perfect job match
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up with email or Google in seconds"
              },
              {
                step: "2",
                title: "Upload Resume",
                description: "Upload your resume for AI analysis"
              },
              {
                step: "3",
                title: "Get Matched",
                description: "Receive personalized job recommendations"
              },
              {
                step: "4",
                title: "Apply & Track",
                description: "Apply to jobs and track your progress"
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of job seekers who found their perfect match with JobMatch
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Job Match?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join JobMatch today and take the next step in your career journey with AI-powered job matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate("/signup")}
            >
              Create Free Account
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6" />
                <span className="text-xl font-bold">JobMatch</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered job matching platform that helps connect job seekers with their perfect career opportunities.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} JobMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
