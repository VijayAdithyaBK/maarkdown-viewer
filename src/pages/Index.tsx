
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { ControlPanel } from "@/components/ControlPanel";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  React.useEffect(() => {
    // Show welcome toast briefly
    toast("Preview & Edit Markdown", {
      description: "Customize your viewing experience using the settings button.",
      duration: 1000, // 1 second duration
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeProvider>
        <Header />
        <div className="px-4 py-2">
          <Link to="/" className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <main className="flex-1 flex flex-col">
          <MarkdownViewer />
        </main>
        <ControlPanel />
      </ThemeProvider>
    </div>
  );
};

export default Index;
