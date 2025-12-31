
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Upload, Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-b from-background to-muted/20">
      <ThemeProvider>
        {/* Floating Navbar */}
        <header className="flex items-center justify-between mb-8 p-3 bg-card/80 backdrop-blur-sm rounded-xl border shadow-sm sticky top-4 z-10 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 pl-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Maarkdown Viewer</h1>
          </div>

          <div className="pr-2">
            <Button variant="ghost" size="sm" className="opacity-0 cursor-default">
              {/* Spacer to balance spacing if needed, or put ThemeToggle here later */}
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-4xl w-full space-y-12">

            {/* Hero Section */}
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                <Sparkles className="mr-1 h-3 w-3" />
                New: PDF Conversion
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
                Master your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Documentation
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The all-in-one workspace to view, edit, and convert your markdown documents with ease. Professional tools for professional writers.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">

              <Card
                className="group relative overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => navigate("/preview")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Markdown Editor
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    Real-time preview, split-pane editing, and export options for your documentation.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group relative overflow-hidden border-2 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => navigate("/convert")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Convert Document
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    Turn Word docs and PDFs into clean Markdown using our advanced converter.
                  </CardDescription>
                </CardHeader>
              </Card>

            </div>
          </div>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default Home;
