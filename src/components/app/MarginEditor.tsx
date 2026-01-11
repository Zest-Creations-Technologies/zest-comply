// Visual margin editor component

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

interface MarginEditorProps {
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  onChange: (margins: {
    top_margin?: number;
    bottom_margin?: number;
    left_margin?: number;
    right_margin?: number;
  }) => void;
}

export function MarginEditor({
  topMargin,
  bottomMargin,
  leftMargin,
  rightMargin,
  onChange,
}: MarginEditorProps) {
  const clampValue = (value: number): number => {
    return Math.min(3.0, Math.max(0.5, value));
  };

  const handleChange = (
    key: "top_margin" | "bottom_margin" | "left_margin" | "right_margin",
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({ [key]: clampValue(numValue) });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Page Margins
        </CardTitle>
        <CardDescription>
          Set the margins for your generated documents (0.5" - 3.0")
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* Visual representation */}
          <div className="relative w-48 h-64 border-2 border-border rounded-lg bg-background">
            {/* Top margin indicator */}
            <div
              className="absolute left-0 right-0 top-0 bg-primary/20 border-b border-dashed border-primary"
              style={{ height: `${(topMargin / 3) * 100}%`, maxHeight: "33%" }}
            />
            {/* Bottom margin indicator */}
            <div
              className="absolute left-0 right-0 bottom-0 bg-primary/20 border-t border-dashed border-primary"
              style={{
                height: `${(bottomMargin / 3) * 100}%`,
                maxHeight: "33%",
              }}
            />
            {/* Left margin indicator */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-primary/20 border-r border-dashed border-primary"
              style={{ width: `${(leftMargin / 3) * 100}%`, maxWidth: "33%" }}
            />
            {/* Right margin indicator */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-primary/20 border-l border-dashed border-primary"
              style={{ width: `${(rightMargin / 3) * 100}%`, maxWidth: "33%" }}
            />
            {/* Content area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Content Area</span>
            </div>
          </div>

          {/* Margin inputs */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="space-y-2">
              <Label htmlFor="top-margin">Top (inches)</Label>
              <Input
                id="top-margin"
                type="number"
                min={0.5}
                max={3.0}
                step={0.1}
                value={topMargin}
                onChange={(e) => handleChange("top_margin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bottom-margin">Bottom (inches)</Label>
              <Input
                id="bottom-margin"
                type="number"
                min={0.5}
                max={3.0}
                step={0.1}
                value={bottomMargin}
                onChange={(e) => handleChange("bottom_margin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="left-margin">Left (inches)</Label>
              <Input
                id="left-margin"
                type="number"
                min={0.5}
                max={3.0}
                step={0.1}
                value={leftMargin}
                onChange={(e) => handleChange("left_margin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="right-margin">Right (inches)</Label>
              <Input
                id="right-margin"
                type="number"
                min={0.5}
                max={3.0}
                step={0.1}
                value={rightMargin}
                onChange={(e) => handleChange("right_margin", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
