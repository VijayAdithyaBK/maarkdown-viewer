
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileDown, FileEdit, Upload } from "lucide-react";
import { Header } from "@/components/Header";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeProvider>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="max-w-2xl w-full mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Markdown Magic</h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              A powerful tool to view, edit, and convert documents to Markdown format
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <FileEdit className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h2 className="text-xl font-semibold mb-3">View & Edit Markdown</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Preview and edit your markdown with real-time rendering and advanced formatting options
                </p>
                <Button 
                  className="mt-auto" 
                  onClick={() => navigate("/preview")}
                >
                  Open Editor
                </Button>
              </div>
              
              <div className="flex flex-col p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <Upload className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h2 className="text-xl font-semibold mb-3">Convert to Markdown</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Upload Word or PDF documents and convert them to clean, formatted markdown
                </p>
                <Button 
                  className="mt-auto" 
                  onClick={() => navigate("/convert")}
                >
                  Convert Document
                </Button>
              </div>
            </div>
            
            <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
              <p>Customize your reading experience with font options, themes, and more</p>
            </div>
          </div>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default Home;
