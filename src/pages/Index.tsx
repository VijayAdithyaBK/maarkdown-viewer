
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { ControlPanel } from "@/components/ControlPanel";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const Index = () => {
  React.useEffect(() => {
    // Show welcome toast briefly
    toast("Welcome to Markdown Viewer", {
      description: "Customize your viewing experience using the settings button.",
      duration: 1000, // 1 second duration
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeProvider>
        <Header />
        <main className="flex-1 flex flex-col">
          <MarkdownViewer />
        </main>
        <ControlPanel />
      </ThemeProvider>
    </div>
  );
};

export default Index;
