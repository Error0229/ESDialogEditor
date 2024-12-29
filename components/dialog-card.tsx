import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface DialogCardProps {
  type: "scene" | "dialog";
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onClick: () => void;
}

export const DialogCard: React.FC<DialogCardProps> = ({
  type,
  index,
  data,
  onClick,
}) => {
  const getTooltipContent = () => {
    if (type === "scene") {
      return (
        <>
          <p>Label: {data.Label || "No Label"}</p>
          <p>Player State: {data.PlayerState || "None"}</p>
          <p>NPC State: {data.NPCState || "None"}</p>
          <p>Dialogs: {data.Dialogs?.length || 0}</p>
        </>
      );
    } else {
      const optionsCount = data.Options?.length || 0;
      const nextDialogId = data.NextDialogId;
      return (
        <>
          <p>Speaker: {data.Speaker || "No Speaker"}</p>
          <p>Text: {data.Text?.substring(0, 50) || "No Text"}...</p>
          <p>Options: {optionsCount}</p>
          <p>Next Dialog: {nextDialogId || "None"}</p>
          <p>Characters: {data.Characters?.length || 0}</p>
        </>
      );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="cursor-pointer"
          >
            <Card className="h-32">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">
                  {type === "scene"
                    ? `Scene ${index + 1}`
                    : `Dialog ${data.DialogId}`}
                </CardTitle>
                <CardDescription>
                  {type === "scene"
                    ? data.Label || "No Label"
                    : data.Text?.substring(0, 30) + "..." || "No Text"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {type === "scene"
                  ? `${data.Dialogs?.length || 0} dialogs`
                  : `${data.Options?.length || 0} options`}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="w-64 p-4">
          <div className="space-y-2">{getTooltipContent()}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
