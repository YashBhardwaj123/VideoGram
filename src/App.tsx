import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always show loader for 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        {/* VideoGram Logo */}
        <img src="/videogram-logo.svg" alt="VideoGram Logo" className="w-16 h-16 mb-6 animate-fade-in" />
        {/* Animated Gradient Bar */}
        <div className="w-48 h-2 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 animate-gradient-x shadow-lg relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-white/40 blur-lg animate-pulse-x" />
        </div>
        {/* Subtle text */}
        <div className="mt-6 text-slate-300 text-sm tracking-widest animate-fade-in-slow">Loading VideoGram...</div>
        <style>{`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 1.2s linear infinite alternate;
          }
          @keyframes pulse-x {
            0% { left: 0; opacity: 0.7; }
            100% { left: 66%; opacity: 0.2; }
          }
          .animate-pulse-x {
            animation: pulse-x 1.2s cubic-bezier(.4,0,.2,1) infinite alternate;
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.7s ease-in;
          }
          @keyframes fade-in-slow {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-slow {
            animation: fade-in-slow 1.2s ease-in;
          }
        `}</style>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
