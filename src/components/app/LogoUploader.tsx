// Reusable logo uploader component

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Upload, Trash2, Image, Loader2 } from "lucide-react";
import { useLogoUpload } from "@/hooks/useLogoUpload";

interface LogoUploaderProps {
  currentLogoPath: string | null;
  currentWidthInches: number;
  showLogo: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  onUpload: (file: File, widthInches: number) => Promise<void>;
  onDelete: () => void;
  onWidthChange: (width: number) => void;
  onShowLogoChange: (show: boolean) => void;
  title?: string;
  description?: string;
}

export function LogoUploader({
  currentLogoPath,
  currentWidthInches,
  showLogo,
  isUploading,
  isDeleting,
  onUpload,
  onDelete,
  onWidthChange,
  onShowLogoChange,
  title = "Company Logo",
  description = "Upload your company logo to appear on generated documents",
}: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    previewUrl,
    widthInches,
    isValidating,
    error,
    selectFile,
    setWidthInches,
    upload,
    reset,
  } = useLogoUpload({
    onUpload: async (file, width) => {
      await onUpload(file, width);
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await selectFile(file);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [selectFile]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        await selectFile(file);
      }
    },
    [selectFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadClick = async () => {
    const success = await upload();
    if (success) {
      reset();
    }
  };

  const displayedLogo = previewUrl || currentLogoPath;
  const displayedWidth = selectedFile ? widthInches : currentWidthInches;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload area */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          {displayedLogo ? (
            <div className="space-y-4">
              <img
                src={displayedLogo}
                alt="Logo preview"
                className="max-h-32 max-w-full mx-auto object-contain"
                style={{ width: `${displayedWidth}in` }}
              />
              <p className="text-sm text-muted-foreground">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">
                Drop your logo here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG or JPEG, max 5MB, min 100x100px
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Error display */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Selected file info */}
        {selectedFile && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                Cancel
              </Button>
            </div>

            {/* Width slider for new upload */}
            <div className="space-y-2">
              <Label>Logo Width: {widthInches.toFixed(1)}"</Label>
              <Slider
                value={[widthInches]}
                onValueChange={([value]) => setWidthInches(value)}
                min={0.5}
                max={5}
                step={0.1}
              />
            </div>

            <Button
              onClick={handleUploadClick}
              disabled={isUploading || isValidating}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </>
              )}
            </Button>
          </div>
        )}

        {/* Current logo settings */}
        {currentLogoPath && !selectedFile && (
          <div className="space-y-4">
            {/* Width adjustment */}
            <div className="space-y-2">
              <Label>Logo Width: {currentWidthInches.toFixed(1)}"</Label>
              <Slider
                value={[currentWidthInches]}
                onValueChange={([value]) => onWidthChange(value)}
                min={0.5}
                max={5}
                step={0.1}
              />
            </div>

            {/* Show logo toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="show-logo">Show logo on documents</Label>
              <Switch
                id="show-logo"
                checked={showLogo}
                onCheckedChange={onShowLogoChange}
              />
            </div>

            {/* Delete button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Logo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Logo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your company logo from all generated
                    documents. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
