"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Save, Download, Moon, Sun, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// In DialogEditor.tsx, add this import at the top
import DialogPreview from "./dialog-preview";

const DialogEditor = () => {
  const [scenes, setScenes] = useState(() => {
    const saved = localStorage.getItem("dialogScenes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("dialogScenes", JSON.stringify(scenes));
  }, [scenes]);

  const { theme, setTheme } = useTheme();

  const addScene = () => {
    setScenes([
      ...scenes,
      {
        NPCName: "",
        NPCState: "",
        PlayerState: "",
        Label: "",
        Dialogs: [],
      },
    ]);
  };

  const addDialog = (sceneIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs.push({
      DialogId: Date.now(),
      Speaker: "",
      Text: "",
      Position: "Center",
      NextDialogId: null,
      Options: [],
      Characters: [],
      EndDialog: {
        NextState: [],
      },
    });
    setScenes(newScenes);
  };

  const addEndDialogState = (sceneIndex, dialogIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].EndDialog.NextState.push({
      Name: "",
      State: "",
    });
    setScenes(newScenes);
  };

  const updateEndDialogState = (
    sceneIndex,
    dialogIndex,
    stateIndex,
    field,
    value
  ) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].EndDialog.NextState[stateIndex][
      field
    ] = value;
    setScenes(newScenes);
  };

  const removeEndDialogState = (sceneIndex, dialogIndex, stateIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].EndDialog.NextState = newScenes[
      sceneIndex
    ].Dialogs[dialogIndex].EndDialog.NextState.filter(
      (_, i) => i !== stateIndex
    );
    setScenes(newScenes);
  };

  const addCharacter = (sceneIndex, dialogIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].Characters.push({
      Name: "",
      Animation: "Idle",
      Position: "Left",
      Image: "",
    });
    setScenes(newScenes);
  };

  const updateCharacter = (
    sceneIndex,
    dialogIndex,
    charIndex,
    field,
    value
  ) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].Characters[charIndex][field] =
      value;
    setScenes(newScenes);
  };

  const removeCharacter = (sceneIndex, dialogIndex, charIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].Characters = newScenes[
      sceneIndex
    ].Dialogs[dialogIndex].Characters.filter((_, i) => i !== charIndex);
    setScenes(newScenes);
  };

  const updateScene = (sceneIndex, field, value) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex][field] = value;
    setScenes(newScenes);
  };

  const removeScene = (sceneIndex) => {
    setScenes(scenes.filter((_, i) => i !== sceneIndex));
  };

  const updateDialog = (sceneIndex, dialogIndex, field, value) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex][field] = value;
    setScenes(newScenes);
  };

  const removeDialog = (sceneIndex, dialogIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs = newScenes[sceneIndex].Dialogs.filter(
      (_, i) => i !== dialogIndex
    );
    setScenes(newScenes);
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(scenes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dialog-scenes.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  // Add this state inside DialogEditor component
  const [previewSceneIndex, setPreviewSceneIndex] = useState<number | null>(
    null
  );

  // Add this function to transform dialog data
  const getPreviewMessages = (sceneIndex: number) => {
    const scene = scenes[sceneIndex];
    return scene.Dialogs.map((dialog) => ({
      speaker: dialog.Speaker,
      text: dialog.Text,
      position: dialog.Position.toLowerCase() === "right" ? "right" : "left",
    }));
  };
  return (
    <div className="p-4 w-3/4 mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Dialog Scene Editor
        </h1>
        <div className="space-x-4">
          <Button onClick={exportJson} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button onClick={addScene} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Scene
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </motion.div>

      {scenes.map((scene, sceneIndex) => (
        <motion.div
          key={sceneIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sceneIndex * 0.1 }}
        >
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Scene {sceneIndex + 1}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setPreviewSceneIndex(
                      previewSceneIndex === sceneIndex ? null : sceneIndex
                    )
                  }
                >
                  {previewSceneIndex === sceneIndex ? "Close" : "Preview"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeScene(sceneIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {previewSceneIndex === sceneIndex && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-6 pb-6"
              >
                <DialogPreview messages={getPreviewMessages(sceneIndex)} />
              </motion.div>
            )}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NPC Name</Label>
                  <Input
                    value={scene.NPCName}
                    onChange={(e) =>
                      updateScene(sceneIndex, "NPCName", e.target.value)
                    }
                    placeholder="NPC Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={scene.Label}
                    onChange={(e) =>
                      updateScene(sceneIndex, "Label", e.target.value)
                    }
                    placeholder="Label"
                  />
                </div>
                <div className="space-y-2">
                  <Label>NPC State</Label>
                  <Input
                    value={scene.NPCState}
                    onChange={(e) =>
                      updateScene(sceneIndex, "NPCState", e.target.value)
                    }
                    placeholder="NPC State"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Player State</Label>
                  <Input
                    value={scene.PlayerState}
                    onChange={(e) =>
                      updateScene(sceneIndex, "PlayerState", e.target.value)
                    }
                    placeholder="Player State"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Dialogs</h3>
                  <Button
                    onClick={() => addDialog(sceneIndex)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Dialog
                  </Button>
                </div>

                {scene.Dialogs.map((dialog, dialogIndex) => (
                  <motion.div
                    key={dialogIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: dialogIndex * 0.05 }}
                  >
                    <Card className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-base">
                          Dialog {dialogIndex + 1}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDialog(sceneIndex, dialogIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Speaker</Label>
                            <Input
                              value={dialog.Speaker}
                              onChange={(e) =>
                                updateDialog(
                                  sceneIndex,
                                  dialogIndex,
                                  "Speaker",
                                  e.target.value
                                )
                              }
                              placeholder="Speaker"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Select
                              value={dialog.Position}
                              onValueChange={(value) =>
                                updateDialog(
                                  sceneIndex,
                                  dialogIndex,
                                  "Position",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Left">Left</SelectItem>
                                <SelectItem value="Center">Center</SelectItem>
                                <SelectItem value="Right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Next Dialog ID</Label>
                            <Input
                              type="number"
                              value={dialog.NextDialogId || ""}
                              onChange={(e) =>
                                updateDialog(
                                  sceneIndex,
                                  dialogIndex,
                                  "NextDialogId",
                                  parseInt(e.target.value) || null
                                )
                              }
                              placeholder="Next Dialog ID"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Dialog Text</Label>
                            <Textarea
                              value={dialog.Text}
                              onChange={(e) =>
                                updateDialog(
                                  sceneIndex,
                                  dialogIndex,
                                  "Text",
                                  e.target.value
                                )
                              }
                              placeholder="Dialog Text"
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Characters Section */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Characters</Label>
                            <Button
                              onClick={() =>
                                addCharacter(sceneIndex, dialogIndex)
                              }
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Character
                            </Button>
                          </div>
                          {dialog.Characters.map((char, charIndex) => (
                            <Card key={charIndex} className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Character {charIndex + 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeCharacter(
                                      sceneIndex,
                                      dialogIndex,
                                      charIndex
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input
                                    value={char.Name}
                                    onChange={(e) =>
                                      updateCharacter(
                                        sceneIndex,
                                        dialogIndex,
                                        charIndex,
                                        "Name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Character Name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Animation</Label>
                                  <Select
                                    value={char.Animation}
                                    onValueChange={(value) =>
                                      updateCharacter(
                                        sceneIndex,
                                        dialogIndex,
                                        charIndex,
                                        "Animation",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select animation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Idle">Idle</SelectItem>
                                      <SelectItem value="Talking">
                                        Talking
                                      </SelectItem>
                                      <SelectItem value="Walking">
                                        Walking
                                      </SelectItem>
                                      <SelectItem value="Running">
                                        Running
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Position</Label>
                                  <Select
                                    value={char.Position}
                                    onValueChange={(value) =>
                                      updateCharacter(
                                        sceneIndex,
                                        dialogIndex,
                                        charIndex,
                                        "Position",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Left">Left</SelectItem>
                                      <SelectItem value="Center">
                                        Center
                                      </SelectItem>
                                      <SelectItem value="Right">
                                        Right
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Image Path</Label>
                                  <Input
                                    value={char.Image}
                                    onChange={(e) =>
                                      updateCharacter(
                                        sceneIndex,
                                        dialogIndex,
                                        charIndex,
                                        "Image",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Image path"
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* EndDialog NextState Section */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>End Dialog States</Label>
                            <Button
                              onClick={() =>
                                addEndDialogState(sceneIndex, dialogIndex)
                              }
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add State
                            </Button>
                          </div>
                          {dialog.EndDialog.NextState.map(
                            (state, stateIndex) => (
                              <Card key={stateIndex} className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">
                                    State {stateIndex + 1}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeEndDialogState(
                                        sceneIndex,
                                        dialogIndex,
                                        stateIndex
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    value={state.Name}
                                    onChange={(e) =>
                                      updateEndDialogState(
                                        sceneIndex,
                                        dialogIndex,
                                        stateIndex,
                                        "Name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Character Name"
                                  />
                                  <Input
                                    value={state.State}
                                    onChange={(e) =>
                                      updateEndDialogState(
                                        sceneIndex,
                                        dialogIndex,
                                        stateIndex,
                                        "State",
                                        e.target.value
                                      )
                                    }
                                    placeholder="New State"
                                  />
                                </div>
                              </Card>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DialogEditor;
