import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import JobsList from "./pages/jobs";
import JobDetail from "./pages/job-detail";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Admin from "./pages/admin";
import ApplicationForm from "./pages/application-form";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Semi-protected routes - accessible but with limited functionality */}
      <Route path="/jobs">
        <ProtectedRoute component={JobsList} />
      </Route>
      <Route path="/jobs/:id">
        <ProtectedRoute component={JobDetail} />
      </Route>
      
      {/* Protected routes */}
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      
      {/* <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route> */}
      
      {/* Admin-only routes */}
      <Route path="/admin">
        <ProtectedRoute component={Admin} adminOnly={true} />
      </Route>
      
      {/* Application form route */}
      <Route path="/apply/:jobId">
        <ProtectedRoute component={ApplicationForm} />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // This component handles the Firebase initialization
  useEffect(() => {
    // Check if we have the required Firebase environment variables
    const hasFirebaseConfig = 
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_APP_ID;
    
    if (!hasFirebaseConfig) {
      console.warn(
        "Firebase configuration is missing. Authentication will not work properly. " +
        "Please provide the required Firebase environment variables."
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
