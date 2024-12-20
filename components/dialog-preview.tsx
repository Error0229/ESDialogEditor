import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  speaker: string;
  text: string;
  position: 'left' | 'right';
}

interface DialogPreviewProps {
  messages: Message[];
}

const DialogPreview: React.FC<DialogPreviewProps> = ({ messages }) => {
  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary text-primary-foreground p-2">
          <h3 className="text-lg font-semibold">Dialog Preview</h3>
        </div>
        <ScrollArea className="h-[352px] p-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.position === 'right' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex ${message.position === 'right' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.speaker}`} />
                  <AvatarFallback>{message.speaker[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.position === 'right'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DialogPreview;
