import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card'; // Assuming Card component is imported from './Card'

const Scene = ({ scene, sceneIndex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={sceneIndex}
    >
      <Card className="w-full mb-6">
        <CardHeader title={scene.title} />
        <CardContent content={scene.content} />
      </Card>
    </motion.div>
  );
};

const Dialog = ({ dialog, dialogIndex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      key={dialogIndex}
    >
      <Card className="w-full mb-4">
        <CardHeader title={dialog.speaker} />
        <CardContent content={dialog.text} />
      </Card>
    </motion.div>
  );
};


const CardHeader = ({ title }) => (
  <h2 className="text-xl font-bold mb-2">{title}</h2>
);

const CardContent = ({ content }) => (
  <p className="text-gray-700">{content}</p>
);


const Story = ({ scenes, dialogs }) => {
  return (
    <div>
      {scenes.map((scene, index) => (
        <Scene scene={scene} sceneIndex={index} key={index} />
      ))}
      {dialogs.map((dialog, index) => (
        <Dialog dialog={dialog} dialogIndex={index} key={index} />
      ))}
    </div>
  );
};

export default Story;

