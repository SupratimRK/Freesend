import React, { useState, useRef, PointerEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: {
    subject: string;
    from: string;
    to: string;
    html_body?: string;
    text_body?: string;
    reply_to?: string; // Added reply_to field
  } | null;
}

const EmailContentModal: React.FC<EmailContentModalProps> = ({ isOpen, onClose, email }) => {
  const [activeTab, setActiveTab] = useState("preview");
  const contentRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  if (!email) return null;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;
    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointer({ x, y, active: true });
  };

  const handlePointerLeave = () => {
    setPointer({ ...pointer, active: false });
  };

  const NEON_COLOR = "#ffffff"; // Monochrome white for the glow

  const glowStyle = pointer.active
    ? {
        boxShadow: `0 0 20px 2px ${NEON_COLOR}22`,
        border: `1px solid ${NEON_COLOR}44`,
        background: `radial-gradient(200px at ${pointer.x}px ${pointer.y}px, ${NEON_COLOR}0C, transparent 80%), #0a0a0a`,
        transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
      }
    : {
        transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
        border: '1px solid #ffffff1a',
        background: '#0a0a0a',
      };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={contentRef}
        className="sm:max-w-[800px] h-[80vh] flex flex-col"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={glowStyle}
      >
        <div className="flex justify-between items-start">
          <DialogHeader className="pb-4 flex-grow">
            <DialogTitle className="text-2xl font-bold">Email details</DialogTitle>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">FROM</p>
                <p className="font-medium text-foreground">{email.from}</p>
              </div>
              <div>
                <p className="text-muted-foreground">SUBJECT</p>
                <p className="font-medium text-foreground">{email.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground">TO</p>
                <p className="font-medium text-foreground">{email.to}</p>
              </div>
              {email.reply_to && (
                <div>
                  <p className="text-muted-foreground">REPLY-TO</p>
                  <p className="font-medium text-foreground">{email.reply_to}</p>
                </div>
              )}
            </div>
          </DialogHeader>
          {/* Removed API and More options buttons */}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="plain-text">Plain Text</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="flex-grow mt-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full w-full p-4 border rounded-md overflow-auto">
              {email.html_body ? (
                <div dangerouslySetInnerHTML={{ __html: email.html_body }} />
              ) : (
                <p className="whitespace-pre-wrap">{email.text_body}</p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="plain-text" className="flex-grow mt-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full w-full p-4 border rounded-md overflow-auto">
              <p className="whitespace-pre-wrap">{email.text_body}</p>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="html" className="flex-grow mt-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full w-full p-4 border rounded-md overflow-auto">
              <pre className="whitespace-pre-wrap text-xs bg-muted p-2 rounded-md">{email.html_body}</pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        {/* Removed delete button */}
      </DialogContent>
    </Dialog>
  );
};

export default EmailContentModal;
