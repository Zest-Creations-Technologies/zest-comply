// Custom hook for logo upload with validation

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseLogoUploadOptions {
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  acceptedTypes?: string[];
  onUpload: (file: File, widthInches: number) => Promise<void>;
}

interface UseLogoUploadReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  widthInches: number;
  isValidating: boolean;
  error: string | null;
  selectFile: (file: File) => Promise<boolean>;
  setWidthInches: (width: number) => void;
  upload: () => Promise<boolean>;
  reset: () => void;
}

export function useLogoUpload({
  maxSizeMB = 5,
  minWidth = 100,
  minHeight = 100,
  acceptedTypes = ["image/png", "image/jpeg"],
  onUpload,
}: UseLogoUploadOptions): UseLogoUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [widthInches, setWidthInches] = useState(2.0);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = useCallback(
    async (file: File): Promise<{ valid: boolean; error?: string }> => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Invalid file type. Please upload ${acceptedTypes.map((t) => t.split("/")[1].toUpperCase()).join(" or ")} files only.`,
        };
      }

      // Check file size
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        return {
          valid: false,
          error: `File is too large. Maximum size is ${maxSizeMB}MB.`,
        };
      }

      // Check image dimensions
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (img.width < minWidth || img.height < minHeight) {
            resolve({
              valid: false,
              error: `Image is too small. Minimum dimensions are ${minWidth}x${minHeight} pixels.`,
            });
          } else {
            resolve({ valid: true });
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve({ valid: false, error: "Failed to load image for validation." });
        };
        img.src = URL.createObjectURL(file);
      });
    },
    [acceptedTypes, maxSizeMB, minWidth, minHeight]
  );

  const selectFile = useCallback(
    async (file: File): Promise<boolean> => {
      setIsValidating(true);
      setError(null);

      const validation = await validateFile(file);

      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setIsValidating(false);
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return false;
      }

      // Clean up previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsValidating(false);
      return true;
    },
    [validateFile, previewUrl, toast]
  );

  const upload = useCallback(async (): Promise<boolean> => {
    if (!selectedFile) {
      setError("No file selected");
      return false;
    }

    try {
      await onUpload(selectedFile, widthInches);
      reset();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      return false;
    }
  }, [selectedFile, widthInches, onUpload]);

  const reset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setWidthInches(2.0);
    setError(null);
  }, [previewUrl]);

  return {
    selectedFile,
    previewUrl,
    widthInches,
    isValidating,
    error,
    selectFile,
    setWidthInches,
    upload,
    reset,
  };
}
