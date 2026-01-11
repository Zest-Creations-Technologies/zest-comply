// Conversation-specific logo upload component

import { useState, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Image, Upload, Trash2, Loader2, X } from "lucide-react";
import { conversationsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import type { ConversationLogo } from "@/lib/api/types";

interface ConversationLogoUploadProps {
  sessionId: string;
  currentLogo?: ConversationLogo | null;
  onLogoChange?: () => void;
}

export function ConversationLogoUpload({
  sessionId,
  currentLogo,
  onLogoChange,
}: ConversationLogoUploadProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      widthInches,
    }: {
      file: File;
      widthInches: number;
    }) => {
      return conversationsApi.uploadConversationLogo(
        sessionId,
        file,
        widthInches
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", sessionId],
      });
      toast({
        title: "Logo uploaded",
        description: "This package will use your custom logo",
      });
      onLogoChange?.();
      setOpen(false);
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => conversationsApi.deleteConversationLogo(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", sessionId],
      });
      toast({
        title: "Logo removed",
        description: "This package will use your default letterhead logo",
      });
      onLogoChange?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const {
    selectedFile,
    previewUrl,
    widthInches,
    error,
    selectFile,
    setWidthInches,
    reset,
  } = useLogoUpload({
    onUpload: async (file, width) => {
      await uploadMutation.mutateAsync({ file, widthInches: width });
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await selectFile(file);
      }
      e.target.value = "";
    },
    [selectFile]
  );

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        widthInches,
      });
    }
  };

  const displayLogo = previewUrl || currentLogo?.logo_cloud_path;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Image className="h-4 w-4" />
          {currentLogo ? "Change Logo" : "Set Logo"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Package Logo</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Set a custom logo for this package. It will override your default
            letterhead logo.
          </p>

          {/* Current/Preview logo */}
          {displayLogo && (
            <div className="border border-border rounded-lg p-3 bg-muted/30">
              <img
                src={displayLogo}
                alt="Package logo"
                className="max-h-20 max-w-full mx-auto object-contain"
              />
            </div>
          )}

          {/* Upload area */}
          <div
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">
              Click to upload PNG/JPEG
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Width slider when file selected */}
          {selectedFile && (
            <div className="space-y-2">
              <Label>Width: {widthInches.toFixed(1)}"</Label>
              <Slider
                value={[widthInches]}
                onValueChange={([v]) => setWidthInches(v)}
                min={0.5}
                max={5}
                step={0.1}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="flex-1"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            )}

            {currentLogo && !selectedFile && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Package Logo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This package will use your default letterhead logo
                      instead.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Removing..." : "Remove"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
