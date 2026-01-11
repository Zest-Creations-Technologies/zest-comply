// Style editor component for document typography settings

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { StyleElement, TableStyle } from "@/lib/api/types";

// Available fonts
const FONT_OPTIONS = [
  "Arial",
  "Times New Roman",
  "Calibri",
  "Georgia",
  "Verdana",
  "Helvetica",
  "Trebuchet MS",
  "Garamond",
];

interface StyleElementEditorProps {
  label: string;
  style: StyleElement;
  onChange: (style: StyleElement) => void;
}

export function StyleElementEditor({
  label,
  style,
  onChange,
}: StyleElementEditorProps) {
  const updateStyle = useCallback(
    (key: keyof StyleElement, value: StyleElement[keyof StyleElement]) => {
      onChange({ ...style, [key]: value });
    },
    [style, onChange]
  );

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium">{label}</h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label>Font</Label>
          <Select
            value={style.font || "Arial"}
            onValueChange={(value) => updateStyle("font", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label>Size (pt): {style.size || 11}</Label>
          <Slider
            value={[style.size || 11]}
            onValueChange={([value]) => updateStyle("size", value)}
            min={8}
            max={72}
            step={1}
          />
        </div>

        {/* Bold */}
        <div className="flex items-center justify-between">
          <Label>Bold</Label>
          <Switch
            checked={style.bold || false}
            onCheckedChange={(checked) => updateStyle("bold", checked)}
          />
        </div>

        {/* Italic */}
        <div className="flex items-center justify-between">
          <Label>Italic</Label>
          <Switch
            checked={style.italic || false}
            onCheckedChange={(checked) => updateStyle("italic", checked)}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Color (hex)</Label>
          <div className="flex gap-2">
            <div
              className="w-8 h-8 rounded border border-border"
              style={{ backgroundColor: `#${style.color || "000000"}` }}
            />
            <Input
              value={style.color || "000000"}
              onChange={(e) => {
                const value = e.target.value.replace("#", "").slice(0, 6);
                updateStyle("color", value);
              }}
              placeholder="000000"
              maxLength={6}
              className="font-mono"
            />
          </div>
        </div>

        {/* Spacing After */}
        <div className="space-y-2">
          <Label>Spacing After (pt): {style.spacing_after || 0}</Label>
          <Slider
            value={[style.spacing_after || 0]}
            onValueChange={([value]) => updateStyle("spacing_after", value)}
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* Spacing Before */}
        <div className="space-y-2 col-span-2">
          <Label>Spacing Before (pt): {style.spacing_before || 0}</Label>
          <Slider
            value={[style.spacing_before || 0]}
            onValueChange={([value]) => updateStyle("spacing_before", value)}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border border-border rounded p-3 bg-background">
        <p
          style={{
            fontFamily: style.font || "Arial",
            fontSize: `${style.size || 11}pt`,
            fontWeight: style.bold ? "bold" : "normal",
            fontStyle: style.italic ? "italic" : "normal",
            color: `#${style.color || "000000"}`,
          }}
        >
          Preview: The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
}

interface TableStyleEditorProps {
  style: TableStyle;
  onChange: (style: TableStyle) => void;
}

export function TableStyleEditor({ style, onChange }: TableStyleEditorProps) {
  const updateStyle = useCallback(
    (key: keyof TableStyle, value: TableStyle[keyof TableStyle]) => {
      onChange({ ...style, [key]: value });
    },
    [style, onChange]
  );

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium">Table Style</h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Header Bold */}
        <div className="flex items-center justify-between">
          <Label>Bold Headers</Label>
          <Switch
            checked={style.header_bold || false}
            onCheckedChange={(checked) => updateStyle("header_bold", checked)}
          />
        </div>

        {/* Cell Font Size */}
        <div className="space-y-2">
          <Label>Cell Font Size: {style.cell_font_size || 10}pt</Label>
          <Slider
            value={[style.cell_font_size || 10]}
            onValueChange={([value]) => updateStyle("cell_font_size", value)}
            min={6}
            max={24}
            step={1}
          />
        </div>

        {/* Header Background */}
        <div className="space-y-2 col-span-2">
          <Label>Header Background (hex)</Label>
          <div className="flex gap-2">
            <div
              className="w-8 h-8 rounded border border-border"
              style={{
                backgroundColor: `#${style.header_background || "E0E0E0"}`,
              }}
            />
            <Input
              value={style.header_background || "E0E0E0"}
              onChange={(e) => {
                const value = e.target.value.replace("#", "").slice(0, 6);
                updateStyle("header_background", value);
              }}
              placeholder="E0E0E0"
              maxLength={6}
              className="font-mono"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: `#${style.header_background || "E0E0E0"}`,
                fontWeight: style.header_bold ? "bold" : "normal",
              }}
            >
              <th className="p-2 text-left">Column A</th>
              <th className="p-2 text-left">Column B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="p-2 border-t border-border"
                style={{ fontSize: `${style.cell_font_size || 10}pt` }}
              >
                Cell 1
              </td>
              <td
                className="p-2 border-t border-border"
                style={{ fontSize: `${style.cell_font_size || 10}pt` }}
              >
                Cell 2
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
