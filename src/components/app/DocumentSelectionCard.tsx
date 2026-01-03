import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Folder, FolderOpen, AlertTriangle, Send } from 'lucide-react';

interface Document {
  filename: string;
  folder: string;
  subfolder: string | null;
  description: string;
}

interface DocumentSelectionCardProps {
  documents: Document[];
  maxSelectable: number;
  remainingQuota: number;
  planName: string;
  onSubmit: (selectedFilenames: string[]) => void;
  isSubmitting?: boolean;
}

export function DocumentSelectionCard({
  documents,
  maxSelectable,
  remainingQuota,
  planName,
  onSubmit,
  isSubmitting = false,
}: DocumentSelectionCardProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

  const handleToggle = (filename: string, checked: boolean) => {
    const newSelection = new Set(selectedDocuments);
    if (checked) {
      if (newSelection.size < maxSelectable) {
        newSelection.add(filename);
      }
    } else {
      newSelection.delete(filename);
    }
    setSelectedDocuments(newSelection);
  };

  const handleSubmit = () => {
    if (selectedDocuments.size === 0) return;
    onSubmit(Array.from(selectedDocuments));
  };

  const canSelectMore = selectedDocuments.size < maxSelectable;

  // Group documents by folder
  const groupedDocs = documents.reduce((acc, doc) => {
    const key = doc.subfolder ? `${doc.folder}/${doc.subfolder}` : doc.folder;
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Select Your Documents
            </CardTitle>
            <CardDescription className="mt-1">
              Your {planName} plan includes {remainingQuota} documents. Select which ones to generate.
            </CardDescription>
          </div>
          <Badge variant={canSelectMore ? 'secondary' : 'default'}>
            {selectedDocuments.size} / {maxSelectable}
          </Badge>
        </div>
        
        {!canSelectMore && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-md">
            <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">
              Maximum selection reached. Deselect a document to choose another.
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {Object.entries(groupedDocs).map(([folderPath, docs]) => (
              <div key={folderPath} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  {folderPath}
                </div>
                <div className="space-y-1 pl-6">
                  {docs.map((doc) => {
                    const isSelected = selectedDocuments.has(doc.filename);
                    const isDisabled = !isSelected && !canSelectMore;
                    
                    return (
                      <label
                        key={doc.filename}
                        className={`flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 border border-primary/30' 
                            : isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleToggle(doc.filename, checked === true)}
                          disabled={isDisabled || isSubmitting}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium truncate">{doc.filename}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {doc.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {documents.length} documents available · {selectedDocuments.size} selected
        </p>
        <Button 
          onClick={handleSubmit} 
          disabled={selectedDocuments.size === 0 || isSubmitting}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Generate {selectedDocuments.size} Document{selectedDocuments.size !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
