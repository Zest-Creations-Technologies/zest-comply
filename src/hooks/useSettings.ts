// Custom hook for user settings management

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api/settings";
import type {
  UserSettings,
  Letterhead,
  LetterheadUpdate,
  StyleMap,
  StyleMapUpdate,
} from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";

const SETTINGS_KEY = ["user-settings"];
const LETTERHEAD_KEY = ["letterhead"];
const STYLEMAP_KEY = ["stylemap"];

export function useSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all settings
  const settingsQuery = useQuery<UserSettings>({
    queryKey: SETTINGS_KEY,
    queryFn: () => settingsApi.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch letterhead
  const letterheadQuery = useQuery<Letterhead>({
    queryKey: LETTERHEAD_KEY,
    queryFn: () => settingsApi.getLetterhead(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch stylemap
  const stylemapQuery = useQuery<StyleMap>({
    queryKey: STYLEMAP_KEY,
    queryFn: () => settingsApi.getStyleMap(),
    staleTime: 5 * 60 * 1000,
  });

  // Update letterhead mutation
  const updateLetterhead = useMutation({
    mutationFn: (data: LetterheadUpdate) => settingsApi.updateLetterhead(data),
    onSuccess: (data) => {
      queryClient.setQueryData(LETTERHEAD_KEY, data);
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast({
        title: "Settings saved",
        description: "Letterhead settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update letterhead settings",
        variant: "destructive",
      });
    },
  });

  // Upload logo mutation
  const uploadLogo = useMutation({
    mutationFn: ({ file, widthInches }: { file: File; widthInches: number }) =>
      settingsApi.uploadLogo(file, widthInches),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LETTERHEAD_KEY });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been uploaded successfully",
      });
    },
    onError: (error: Error & { status?: number; details?: { suggestion?: string } }) => {
      const isPlanRestriction = error.status === 403 && error.message?.includes("not available on your plan");
      toast({
        title: isPlanRestriction ? "Feature not available" : "Upload failed",
        description: isPlanRestriction 
          ? error.details?.suggestion || "Please upgrade your plan to use custom letterhead"
          : (error.message || "Failed to upload logo"),
        variant: "destructive",
      });
    },
  });

  // Delete logo mutation
  const deleteLogo = useMutation({
    mutationFn: () => settingsApi.deleteLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LETTERHEAD_KEY });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast({
        title: "Logo deleted",
        description: "Your company logo has been removed",
      });
    },
    onError: (error: Error & { status?: number; details?: { suggestion?: string } }) => {
      const isPlanRestriction = error.status === 403 && error.message?.includes("not available on your plan");
      toast({
        title: isPlanRestriction ? "Feature not available" : "Error",
        description: isPlanRestriction 
          ? error.details?.suggestion || "Please upgrade your plan to use custom letterhead"
          : (error.message || "Failed to delete logo"),
        variant: "destructive",
      });
    },
  });

  // Update stylemap mutation
  const updateStyleMap = useMutation({
    mutationFn: (data: StyleMapUpdate) => settingsApi.updateStyleMap(data),
    onSuccess: (data) => {
      queryClient.setQueryData(STYLEMAP_KEY, data);
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast({
        title: "Styles saved",
        description: "Document styles updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update document styles",
        variant: "destructive",
      });
    },
  });

  return {
    // Queries
    settings: settingsQuery.data,
    letterhead: letterheadQuery.data,
    stylemap: stylemapQuery.data,
    isLoading:
      settingsQuery.isLoading ||
      letterheadQuery.isLoading ||
      stylemapQuery.isLoading,
    isError:
      settingsQuery.isError ||
      letterheadQuery.isError ||
      stylemapQuery.isError,

    // Mutations
    updateLetterhead: updateLetterhead.mutate,
    updateLetterheadAsync: updateLetterhead.mutateAsync,
    isUpdatingLetterhead: updateLetterhead.isPending,

    uploadLogo: uploadLogo.mutate,
    uploadLogoAsync: uploadLogo.mutateAsync,
    isUploadingLogo: uploadLogo.isPending,

    deleteLogo: deleteLogo.mutate,
    deleteLogoAsync: deleteLogo.mutateAsync,
    isDeletingLogo: deleteLogo.isPending,

    updateStyleMap: updateStyleMap.mutate,
    updateStyleMapAsync: updateStyleMap.mutateAsync,
    isUpdatingStyleMap: updateStyleMap.isPending,

    // Refetch
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      queryClient.invalidateQueries({ queryKey: LETTERHEAD_KEY });
      queryClient.invalidateQueries({ queryKey: STYLEMAP_KEY });
    },
  };
}
