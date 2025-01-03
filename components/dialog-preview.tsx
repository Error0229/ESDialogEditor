import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronDown, ChevronRight } from "lucide-react";

interface DialogOption {
  Text: string;
  NextDialog: number | null;
}

interface Dialog {
  DialogId: number;
  Speaker: string;
  Text: string;
  Position: string;
  Options: DialogOption[];
  NextDialogId: number | null;
  IsLastDialog?: boolean;
}

interface DialogPreviewProps {
  dialogs: Dialog[];
  initialDialogId?: number;
}

// Update interfaces to include selected options tracking
interface HistoryEntry {
  dialog: Dialog;
  selectedOption?: string; // Store the selected option text
}

const DialogPreview: React.FC<DialogPreviewProps> = ({
  dialogs,
  initialDialogId,
}) => {
  const [messageHistory, setMessageHistory] = useState<HistoryEntry[]>([]);
  const [currentDialogId, setCurrentDialogId] = useState<number | null>(
    initialDialogId || (dialogs[0]?.DialogId ?? null)
  );
  const [showOptions, setShowOptions] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentDialog = dialogs.find((d) => d.DialogId === currentDialogId);

  // Add a useEffect to auto-continue when there's a NextDialogId
  useEffect(() => {
    if (
      currentDialog &&
      !currentDialog.Options.length &&
      currentDialog.NextDialogId
    ) {
      const timeoutId = setTimeout(() => {
        handleNextDialog();
      }, 100); // Wait 1.5 seconds before auto-continuing

      return () => clearTimeout(timeoutId);
    }
  }, [currentDialog]);

  const handleOptionClick = (
    nextDialogId: number | null,
    optionText: string
  ) => {
    if (!currentDialog) return;

    // Add just the player's selected option without modifying the speaker
    setMessageHistory((prev) => [
      ...prev,
      {
        dialog: {
          ...currentDialog,
          Text: optionText, // Use the option text
          Position: "right", // Keep option responses on the right
        },
      },
    ]);

    setCurrentDialogId(nextDialogId ?? currentDialog.DialogId + 1);
  };

  // Modify handleNextDialog to be more streamlined
  const handleNextDialog = () => {
    if (!currentDialog) return;

    setMessageHistory((prev) => [...prev, { dialog: currentDialog }]);
    setCurrentDialogId(currentDialog.NextDialogId ?? currentDialogId + 1);
  };

  const handleRestart = () => {
    setMessageHistory([]);
    setCurrentDialogId(initialDialogId || (dialogs[0]?.DialogId ?? null));
    setShowOptions(true);
  };

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <h3 className="text-lg font-semibold">Dialog Preview</h3>
          </div>
          <Button variant="secondary" size="sm" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>
        {!isCollapsed && (
          <ScrollArea className="h-[352px]">
            <div className="p-4 space-y-4">
              {/* Message History */}
              {messageHistory.map((entry, index) => (
                <React.Fragment key={`history-${index}`}>
                  {entry.dialog.Text && ( // Only show dialog bubble if there's text
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.0,
                        delay: 0, // Remove any delay in the animation
                      }}
                      className={`flex ${
                        entry.dialog.Position.toLowerCase() === "right"
                          ? "justify-end"
                          : "justify-start"
                      } mb-4`}
                    >
                      <div
                        className={`flex ${
                          entry.dialog.Position.toLowerCase() === "right"
                            ? "flex-row-reverse"
                            : "flex-row"
                        } items-end`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${entry.dialog.Speaker}`}
                          />
                          <AvatarFallback>
                            {entry.dialog.Speaker[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`mx-2 p-3 rounded-lg ${
                            entry.dialog.Position.toLowerCase() === "right"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <p className="text-sm">{entry.dialog.Text}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}

              {/* Current Dialog */}
              {currentDialog && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Only show the dialog text if there are no options */}
                  {currentDialog.Options.length === 0 && (
                    <div
                      className={`flex ${
                        currentDialog.Position.toLowerCase() === "right"
                          ? "justify-end"
                          : "justify-start"
                      } mb-4`}
                    >
                      <div
                        className={`flex ${
                          currentDialog.Position.toLowerCase() === "right"
                            ? "flex-row-reverse"
                            : "flex-row"
                        } items-end`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${currentDialog.Speaker}`}
                          />
                          <AvatarFallback>
                            {currentDialog.Speaker[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`mx-2 p-3 rounded-lg ${
                            currentDialog.Position.toLowerCase() === "right"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <p className="text-sm">{currentDialog.Text}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modified Options or End Dialog Button */}
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                      className="space-y-2 pl-12"
                    >
                      {currentDialog?.Options.length > 0
                        ? currentDialog.Options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full text-left justify-start"
                              onClick={() =>
                                handleOptionClick(
                                  option.NextDialog,
                                  option.Text
                                )
                              }
                            >
                              {option.Text}
                            </Button>
                          ))
                        : !currentDialog?.NextDialogId && (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={handleRestart}
                            >
                              End of Dialog (Restart)
                            </Button>
                          )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default DialogPreview;
