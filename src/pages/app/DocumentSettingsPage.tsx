// Document Settings Page - Letterhead, Logo, and Style Configuration

import { useState, useCallback } from "react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";
import { LogoUploader } from "@/components/app/LogoUploader";
import { MarginEditor } from "@/components/app/MarginEditor";
import {
  StyleElementEditor,
  TableStyleEditor,
} from "@/components/app/StyleEditor";
import type { StylesJson, LetterheadUpdate } from "@/lib/api/types";

const STYLE_TEMPLATES = [
  { value: "professional", label: "Professional" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "corporate", label: "Corporate" },
];

export default function DocumentSettingsPage() {
  const {
    letterhead,
    stylemap,
    isLoading,
    updateLetterhead,
    isUpdatingLetterhead,
    uploadLogo,
    isUploadingLogo,
    deleteLogo,
    isDeletingLogo,
    updateStyleMap,
    isUpdatingStyleMap,
  } = useSettings();

  // Local state for pending changes
  const [pendingLetterhead, setPendingLetterhead] =
    useState<LetterheadUpdate | null>(null);
  const [pendingStyles, setPendingStyles] = useState<StylesJson | null>(null);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);

  // Merged values (API data + pending changes)
  const currentLetterhead = {
    ...letterhead,
    ...pendingLetterhead,
  };

  const currentStyles = {
    ...stylemap?.styles_json,
    ...pendingStyles,
  };

  const currentTemplate = pendingTemplate ?? stylemap?.active_template ?? "professional";

  // Check for unsaved changes
  const hasLetterheadChanges = pendingLetterhead !== null;
  const hasStyleChanges = pendingStyles !== null || pendingTemplate !== null;
  const hasUnsavedChanges = hasLetterheadChanges || hasStyleChanges;

  // Handle letterhead changes
  const handleLetterheadChange = useCallback(
    (changes: LetterheadUpdate) => {
      setPendingLetterhead((prev) => ({ ...prev, ...changes }));
    },
    []
  );

  // Handle style changes
  const handleStyleChange = useCallback(
    (key: keyof StylesJson, value: StylesJson[keyof StylesJson]) => {
      setPendingStyles((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Save all letterhead changes
  const saveLetterhead = useCallback(() => {
    if (pendingLetterhead) {
      updateLetterhead(pendingLetterhead);
      setPendingLetterhead(null);
    }
  }, [pendingLetterhead, updateLetterhead]);

  // Save all style changes
  const saveStyles = useCallback(() => {
    const updates: { styles_json?: StylesJson; active_template?: string } = {};
    if (pendingStyles) {
      updates.styles_json = { ...stylemap?.styles_json, ...pendingStyles };
    }
    if (pendingTemplate) {
      updates.active_template = pendingTemplate;
    }
    if (Object.keys(updates).length > 0) {
      updateStyleMap(updates);
      setPendingStyles(null);
      setPendingTemplate(null);
    }
  }, [pendingStyles, pendingTemplate, stylemap, updateStyleMap]);

  // Reset all pending changes
  const resetChanges = useCallback(() => {
    setPendingLetterhead(null);
    setPendingStyles(null);
    setPendingTemplate(null);
  }, []);

  // Handle logo upload
  const handleLogoUpload = useCallback(
    async (file: File, widthInches: number) => {
      await new Promise<void>((resolve, reject) => {
        uploadLogo(
          { file, widthInches },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    },
    [uploadLogo]
  );

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Branding
          </h1>
          <p className="text-muted-foreground">
            Customize the appearance of your generated compliance documents
          </p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="letterhead" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="letterhead">Letterhead & Logo</TabsTrigger>
          <TabsTrigger value="styles">Document Styles</TabsTrigger>
        </TabsList>

        {/* Letterhead Tab */}
        <TabsContent value="letterhead" className="space-y-6">
          {/* Logo Upload */}
          <LogoUploader
            currentLogoPath={letterhead?.logo_cloud_path ?? null}
            currentWidthInches={
              currentLetterhead?.logo_width_inches ?? 2.0
            }
            showLogo={currentLetterhead?.show_logo ?? true}
            isUploading={isUploadingLogo}
            isDeleting={isDeletingLogo}
            onUpload={handleLogoUpload}
            onDelete={() => deleteLogo()}
            onWidthChange={(width) =>
              handleLetterheadChange({ logo_width_inches: width })
            }
            onShowLogoChange={(show) =>
              handleLetterheadChange({ show_logo: show })
            }
          />

          {/* Header/Footer Text */}
          <Card>
            <CardHeader>
              <CardTitle>Header & Footer</CardTitle>
              <CardDescription>
                Add custom text to appear at the top and bottom of each page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header-text">Header Text</Label>
                <Textarea
                  id="header-text"
                  placeholder="e.g., CONFIDENTIAL - Internal Use Only"
                  value={currentLetterhead?.header_text ?? ""}
                  onChange={(e) =>
                    handleLetterheadChange({ header_text: e.target.value })
                  }
                  maxLength={500}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  {(currentLetterhead?.header_text?.length ?? 0)}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Textarea
                  id="footer-text"
                  placeholder="e.g., © 2024 Your Company. All rights reserved."
                  value={currentLetterhead?.footer_text ?? ""}
                  onChange={(e) =>
                    handleLetterheadChange({ footer_text: e.target.value })
                  }
                  maxLength={500}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  {(currentLetterhead?.footer_text?.length ?? 0)}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Page Margins */}
          <MarginEditor
            topMargin={currentLetterhead?.top_margin ?? 1.0}
            bottomMargin={currentLetterhead?.bottom_margin ?? 1.0}
            leftMargin={currentLetterhead?.left_margin ?? 1.0}
            rightMargin={currentLetterhead?.right_margin ?? 1.0}
            onChange={handleLetterheadChange}
          />

          {/* Save Button */}
          {hasLetterheadChanges && (
            <Button
              onClick={saveLetterhead}
              disabled={isUpdatingLetterhead}
              className="w-full"
            >
              {isUpdatingLetterhead ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Letterhead Settings
                </>
              )}
            </Button>
          )}
        </TabsContent>

        {/* Styles Tab */}
        <TabsContent value="styles" className="space-y-6">
          {/* Style Template */}
          <Card>
            <CardHeader>
              <CardTitle>Style Template</CardTitle>
              <CardDescription>
                Choose a base template for your document styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={currentTemplate}
                onValueChange={setPendingTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_TEMPLATES.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Style Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Typography Styles</CardTitle>
              <CardDescription>
                Customize fonts, sizes, and formatting for different elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="heading_1">
                  <AccordionTrigger>Heading 1</AccordionTrigger>
                  <AccordionContent>
                    <StyleElementEditor
                      label="Heading 1 Style"
                      style={currentStyles.heading_1 ?? {}}
                      onChange={(style) => handleStyleChange("heading_1", style)}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="heading_2">
                  <AccordionTrigger>Heading 2</AccordionTrigger>
                  <AccordionContent>
                    <StyleElementEditor
                      label="Heading 2 Style"
                      style={currentStyles.heading_2 ?? {}}
                      onChange={(style) => handleStyleChange("heading_2", style)}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="heading_3">
                  <AccordionTrigger>Heading 3</AccordionTrigger>
                  <AccordionContent>
                    <StyleElementEditor
                      label="Heading 3 Style"
                      style={currentStyles.heading_3 ?? {}}
                      onChange={(style) => handleStyleChange("heading_3", style)}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="paragraph">
                  <AccordionTrigger>Paragraph</AccordionTrigger>
                  <AccordionContent>
                    <StyleElementEditor
                      label="Paragraph Style"
                      style={currentStyles.paragraph ?? {}}
                      onChange={(style) => handleStyleChange("paragraph", style)}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="list_item">
                  <AccordionTrigger>List Items</AccordionTrigger>
                  <AccordionContent>
                    <StyleElementEditor
                      label="List Item Style"
                      style={currentStyles.list_item ?? {}}
                      onChange={(style) => handleStyleChange("list_item", style)}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="table">
                  <AccordionTrigger>Tables</AccordionTrigger>
                  <AccordionContent>
                    <TableStyleEditor
                      style={currentStyles.table ?? {}}
                      onChange={(style) => handleStyleChange("table", style)}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Save Button */}
          {hasStyleChanges && (
            <Button
              onClick={saveStyles}
              disabled={isUpdatingStyleMap}
              className="w-full"
            >
              {isUpdatingStyleMap ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Document Styles
                </>
              )}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
