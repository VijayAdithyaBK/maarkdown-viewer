
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MarkdownViewer } from "@/components/MarkdownViewer";
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
        <div className="flex-1 flex flex-col pt-2">
          <MarkdownViewer />
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Index;
