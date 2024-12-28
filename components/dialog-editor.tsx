"use client";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Download,
  Moon,
  Sun,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// In DialogEditor.tsx, add this import at the top
import DialogPreview from "./dialog-preview";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DialogEditor = () => {
  const [scenes, setScenes] = useState([]);
  const [previewSceneIndex, setPreviewSceneIndex] = useState<number | null>(
    null
  );
  // Add these at the top of DialogEditor component
  const [uniqueCharacterNames, setUniqueCharacterNames] = useState<string[]>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("characterNames");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    }
  );

  const [uniqueCharacterImages, setUniqueCharacterImages] = useState<string[]>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("characterImages");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    }
  );

  // Add these effects to persist changes
  useEffect(() => {
    if (typeof window !== "undefined" && uniqueCharacterNames.length > 0) {
      localStorage.setItem(
        "characterNames",
        JSON.stringify(uniqueCharacterNames)
      );
    }
  }, [uniqueCharacterNames]);

  useEffect(() => {
    if (typeof window !== "undefined" && uniqueCharacterImages.length > 0) {
      localStorage.setItem(
        "characterImages",
        JSON.stringify(uniqueCharacterImages)
      );
    }
  }, [uniqueCharacterImages]);

  // Update the existing useEffect to merge with stored names
  useEffect(() => {
    const names = new Set<string>(uniqueCharacterNames);
    const images = new Set<string>(uniqueCharacterImages);

    scenes.forEach((scene) => {
      if (scene.NPCName) names.add(scene.NPCName);

      if (scene?.Dialogs) {
        scene.Dialogs.forEach((dialog) => {
          if (dialog.Speaker) names.add(dialog.Speaker);

          if (dialog?.Characters) {
            dialog.Characters.forEach((char) => {
              if (char?.Name) names.add(char.Name);
              if (char?.Image) images.add(char.Image);
            });
          }

          if (dialog?.EndDialog?.NextState) {
            dialog.EndDialog.NextState.forEach((state) => {
              if (state?.Name) names.add(state.Name);
            });
          }
        });
      }
    });

    setUniqueCharacterNames(Array.from(names));
    setUniqueCharacterImages(Array.from(images));
  }, [scenes]);
  // Create these components for reuse
  // Add these types at the top of the file

  // Add these functions near the other state management functions
  const removeCharacterName = (nameToRemove: string) => {
    setUniqueCharacterNames(
      uniqueCharacterNames.filter((name) => name !== nameToRemove)
    );
  };

  const removeCharacterImage = (imageToRemove: string) => {
    setUniqueCharacterImages(
      uniqueCharacterImages.filter((image) => image !== imageToRemove)
    );
  };

  // Update the AutocompleteInput component
  const AutocompleteInput = ({ value, onChange, items = [], placeholder }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredItems = (items || []).filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (item: string, e: React.MouseEvent) => {
      e.stopPropagation();
      // Remove from the appropriate list based on placeholder
      if (placeholder.includes("name")) {
        removeCharacterName(item);
      } else if (placeholder.includes("image")) {
        removeCharacterImage(item);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange(search);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add &quot;{search}&quot;
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => {
                      onChange(item);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-destructive/10"
                      onClick={(e) => handleDelete(item, e)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };
  // Move localStorage logic into useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedScenes = localStorage.getItem("dialogScenes");
        if (savedScenes) {
          const parsedScenes = JSON.parse(savedScenes);
          if (Array.isArray(parsedScenes)) {
            setScenes(parsedScenes);
          }
        }
      } catch (e) {
        console.error("Failed to load scenes from localStorage:", e);
      }
    }
  }, []);

  // Update the save effect to prevent unnecessary saves
  useEffect(() => {
    if (typeof window !== "undefined" && scenes.length > 0) {
      localStorage.setItem("dialogScenes", JSON.stringify(scenes));
    }
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
  // Add this near the top of the DialogEditor component
  const [highestDialogId, setHighestDialogId] = useState(0);

  // Update the useEffect that loads scenes to find the highest dialog ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedScenes = localStorage.getItem("dialogScenes");
        if (savedScenes) {
          const parsedScenes = JSON.parse(savedScenes);
          if (Array.isArray(parsedScenes)) {
            setScenes(parsedScenes);

            // Find highest dialog ID
            let maxId = 0;
            parsedScenes.forEach((scene) => {
              scene.Dialogs?.forEach((dialog) => {
                maxId = Math.max(maxId, dialog.DialogId || 0);
              });
            });
            setHighestDialogId(maxId);
          }
        }
      } catch (e) {
        console.error("Failed to load scenes from localStorage:", e);
      }
    }
  }, []);

  // Modify the addDialog function
  const addDialog = (sceneIndex) => {
    const newDialogId = highestDialogId + 1;
    setHighestDialogId(newDialogId);

    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs.push({
      DialogId: newDialogId,
      Speaker: "",
      Text: "",
      Position: "Center",
      DialogImage: "Common",
      NextDialogId: null,
      Options: [],
      Characters: [],
      EndDialog: {
        NextState: [],
      },
    });
    setScenes(newScenes);
  };

  // Add a new function to update dialog ID
  const updateDialogId = (sceneIndex, dialogIndex, newId) => {
    const newScenes = [...scenes];
    const currentId = newScenes[sceneIndex].Dialogs[dialogIndex].DialogId;

    // Check if ID already exists in any scene
    const idExists = scenes.some((scene) =>
      scene.Dialogs.some(
        (dialog) =>
          dialog.DialogId === parseInt(newId) && dialog.DialogId !== currentId
      )
    );

    if (idExists) {
      alert("This Dialog ID already exists. Please choose a different one.");
      return;
    }

    newScenes[sceneIndex].Dialogs[dialogIndex].DialogId = parseInt(newId);
    setScenes(newScenes);

    // Update highest ID if necessary
    if (parseInt(newId) > highestDialogId) {
      setHighestDialogId(parseInt(newId));
    }
  };

  // In the dialog render section, add the Dialog ID input field:
  // Find this section in the existing CardContent:

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
    if (typeof window !== "undefined") {
      setScenes(scenes.filter((_, i) => i !== sceneIndex));
    }
  };

  const removeDialog = (sceneIndex, dialogIndex) => {
    if (typeof window !== "undefined") {
      const newScenes = [...scenes];
      newScenes[sceneIndex].Dialogs = newScenes[sceneIndex].Dialogs.filter(
        (_, i) => i !== dialogIndex
      );
      setScenes(newScenes);
    }
  };

  const updateDialog = (sceneIndex, dialogIndex, field, value) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex][field] = value;
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

  // Add this function to transform dialog data
  const getPreviewDialogs = (sceneIndex: number) => {
    return scenes[sceneIndex].Dialogs;
  };

  const addOption = (sceneIndex, dialogIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].Options.push({
      Text: "",
      NextDialog: null,
    });
    setScenes(newScenes);
  };

  const updateOption = (sceneIndex, dialogIndex, optionIndex, field, value) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].Options[optionIndex][field] =
      value;
    setScenes(newScenes);
  };

  const removeOption = (sceneIndex, dialogIndex, optionIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs[dialogIndex].Options = newScenes[
      sceneIndex
    ].Dialogs[dialogIndex].Options.filter((_, i) => i !== optionIndex);
    setScenes(newScenes);
  };

  // Add a new function to insert a dialog at a specific index
  const insertDialog = (sceneIndex: number, insertIndex: number) => {
    const newDialogId = highestDialogId + 1;
    setHighestDialogId(newDialogId);

    const newScenes = [...scenes];
    newScenes[sceneIndex].Dialogs.splice(insertIndex, 0, {
      DialogId: newDialogId,
      Speaker: "",
      Text: "",
      Position: "Center",
      DialogImage: "Common",
      NextDialogId: null,
      Options: [],
      Characters: [],
      EndDialog: {
        NextState: [],
      },
    });
    setScenes(newScenes);
  };

  return (
    <div className="p-4 w-3/4 mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text">
          EverSnow Dialog Editor
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete Scene {sceneIndex + 1} and all its dialogs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeScene(sceneIndex)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                <DialogPreview
                  dialogs={getPreviewDialogs(sceneIndex)}
                  initialDialogId={scenes[sceneIndex].Dialogs[0]?.DialogId}
                />
              </motion.div>
            )}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label>NPC Name</Label>
                  <AutocompleteInput
                    value={scene.NPCName}
                    onChange={(value) =>
                      updateScene(sceneIndex, "NPCName", value)
                    }
                    items={uniqueCharacterNames}
                    placeholder="Select NPC name"
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
                  <React.Fragment key={dialogIndex}>
                    {dialogIndex === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center my-2"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertDialog(sceneIndex, 0)}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: dialogIndex * 0.05 }}
                    >
                      <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-base flex items-center gap-2">
                            Dialog
                            <Input
                              type="number"
                              value={dialog.DialogId}
                              onChange={(e) =>
                                updateDialogId(
                                  sceneIndex,
                                  dialogIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Dialog ID"
                              className="w-24" // Add fixed width for better appearance
                            />
                          </CardTitle>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete Dialog {dialog.DialogId}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    removeDialog(sceneIndex, dialogIndex)
                                  }
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Speaker</Label>
                              <AutocompleteInput
                                value={dialog.Speaker}
                                onChange={(value) =>
                                  updateDialog(
                                    sceneIndex,
                                    dialogIndex,
                                    "Speaker",
                                    value
                                  )
                                }
                                items={uniqueCharacterNames}
                                placeholder="Select speaker"
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
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                              <Label>Dialog image</Label>
                              <Select
                                value={dialog.DialogImage}
                                onValueChange={(value) =>
                                  updateDialog(
                                    sceneIndex,
                                    dialogIndex,
                                    "DialogImage",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Dialog image" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Common">Common</SelectItem>
                                  <SelectItem value="Thinking">
                                    Thinking
                                  </SelectItem>
                                  <SelectItem value="Overthinking">
                                    Overthinking
                                  </SelectItem>
                                  <SelectItem value="Surprising">
                                    Surprising
                                  </SelectItem>
                                </SelectContent>
                              </Select>
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
                                    <AutocompleteInput
                                      value={char.Name}
                                      onChange={(value) =>
                                        updateCharacter(
                                          sceneIndex,
                                          dialogIndex,
                                          charIndex,
                                          "Name",
                                          value
                                        )
                                      }
                                      items={uniqueCharacterNames || []}
                                      placeholder="Select character name"
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
                                        <SelectItem value="Idle">
                                          Idle
                                        </SelectItem>
                                        <SelectItem value="Shaking">
                                          Shaking
                                        </SelectItem>
                                        <SelectItem value="Zooming">
                                          Zooming
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
                                        <SelectItem value="Left">
                                          Left
                                        </SelectItem>
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
                                    <Label>Image</Label>
                                    <AutocompleteInput
                                      value={char.Image}
                                      onChange={(value) =>
                                        updateCharacter(
                                          sceneIndex,
                                          dialogIndex,
                                          charIndex,
                                          "Image",
                                          value
                                        )
                                      }
                                      items={uniqueCharacterImages}
                                      placeholder="Select character image"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                          {/* Options Section */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Dialog Options</Label>
                              <Button
                                onClick={() =>
                                  addOption(sceneIndex, dialogIndex)
                                }
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Option
                              </Button>
                            </div>
                            {dialog.Options.map((option, optionIndex) => (
                              <motion.div
                                key={optionIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card className="p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">
                                      Option {optionIndex + 1}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeOption(
                                          sceneIndex,
                                          dialogIndex,
                                          optionIndex
                                        )
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label>Option Text</Label>
                                      <Textarea
                                        value={option.Text}
                                        onChange={(e) =>
                                          updateOption(
                                            sceneIndex,
                                            dialogIndex,
                                            optionIndex,
                                            "Text",
                                            e.target.value
                                          )
                                        }
                                        placeholder="What should this option say?"
                                        rows={2}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Next Dialog ID</Label>
                                      <Input
                                        type="number"
                                        value={option.NextDialog || ""}
                                        onChange={(e) =>
                                          updateOption(
                                            sceneIndex,
                                            dialogIndex,
                                            optionIndex,
                                            "NextDialog",
                                            parseInt(e.target.value) || null
                                          )
                                        }
                                        placeholder="Which dialog should this lead to?"
                                      />
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
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
                                    <div className="space-y-2">
                                      <Label>Character Name</Label>
                                      <AutocompleteInput
                                        value={state.Name}
                                        onChange={(value) =>
                                          updateEndDialogState(
                                            sceneIndex,
                                            dialogIndex,
                                            stateIndex,
                                            "Name",
                                            value
                                          )
                                        }
                                        items={uniqueCharacterNames}
                                        placeholder="Select character name"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Next Character State</Label>
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
                                  </div>
                                </Card>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center my-2"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          insertDialog(sceneIndex, dialogIndex + 1)
                        }
                        className="rounded-full w-8 h-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </React.Fragment>
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
