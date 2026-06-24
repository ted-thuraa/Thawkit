"use client";

import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { ScoreTiers } from "@/lib/types/project";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ColorPicker } from "@/components/global/colorPicker";
import { createOrUpdateScoreTiers } from "@/actions/project/scoretiers";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const ScoreTiersEditor = React.forwardRef<HTMLDivElement>((props, ref) => {
  const {
    scoretiers: tiers,
    updateScoreTiers,
    projectData,
  } = usePageBuilderStore();
  const [isSaving, setIsSaving] = useState(false);
  console.log(tiers);

  const setTiers = (
    newTiers: ScoreTiers[] | ((prevTiers: ScoreTiers[]) => ScoreTiers[])
  ) => {
    if (typeof newTiers === "function") {
      updateScoreTiers(newTiers(tiers));
    } else {
      updateScoreTiers(newTiers);
    }
  };

  const canAddMoreTiers = () => {
    if (!tiers || tiers.length === 0) return false;
    const sortedTiers = [...tiers].sort((a, b) => a.scoreFrom - b.scoreFrom);
    const lastTier = sortedTiers[sortedTiers.length - 1];
    if (!lastTier) return false;
    return lastTier.scoreTo - lastTier.scoreFrom > 1;
  };

  const addTier = () => {
    if (!canAddMoreTiers() || !projectData) return;

    const sortedTiers = [...tiers].sort((a, b) => a.scoreFrom - b.scoreFrom);
    const lastTier = sortedTiers[sortedTiers.length - 1];
    const rangeToSplit = lastTier.scoreTo - lastTier.scoreFrom;
    const splitPoint = Math.floor(lastTier.scoreFrom + rangeToSplit / 2);

    const updatedLastTier = { ...lastTier, scoreFrom: splitPoint + 1 };
    const newTier: ScoreTiers = {
      id: nanoid(),
      name: "new",
      scoreColour: "#CCCCCC",
      scoreFrom: lastTier.scoreFrom,
      scoreTo: splitPoint,
      projectId: projectData.id as string,
    };

    const tiersWithoutLast = sortedTiers.slice(0, -1);
    setTiers(
      [...tiersWithoutLast, newTier, updatedLastTier].sort(
        (a, b) => a.scoreFrom - b.scoreFrom
      )
    );
  };

  const removeTier = (index: number) => {
    const sortedTiers = [...tiers].sort((a, b) => a.scoreFrom - b.scoreFrom);
    const tierToRemove = sortedTiers[index];

    if (tierToRemove.scoreFrom === 0 || tierToRemove.scoreTo === 100) return;

    const updatedTiers = sortedTiers
      .filter((_, i) => i !== index)
      .map((tier, i, array) => {
        if (i > 0) {
          const prevTier = array[i - 1];
          return { ...tier, scoreFrom: prevTier.scoreTo + 1 };
        }
        return tier;
      });

    setTiers(updatedTiers);
  };

  const updateTier = (index: number, field: string, value: string | number) => {
    const sortedTiers = [...tiers].sort((a, b) => a.scoreFrom - b.scoreFrom);
    let updatedTiers = [...sortedTiers];

    if (field === "name" || field === "scoreColour") {
      updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    } else {
      const numValue = Number(value);
      if (isNaN(numValue)) return;

      if (
        (index === 0 && field === "scoreFrom") ||
        (index === updatedTiers.length - 1 && field === "scoreTo")
      ) {
        return;
      }

      updatedTiers = updatedTiers.map((tier, i) => {
        if (i === index) {
          let updatedTier = { ...tier, [field]: numValue };
          if (field === "scoreFrom" && updatedTier.scoreTo <= numValue) {
            updatedTier.scoreTo = numValue + 1;
          }
          if (field === "scoreTo" && updatedTier.scoreFrom >= numValue) {
            updatedTier.scoreFrom = numValue - 1;
          }
          return updatedTier;
        }
        if (i === index + 1 && field === "scoreTo") {
          return { ...tier, scoreFrom: numValue + 1 };
        }
        if (i === index - 1 && field === "scoreFrom") {
          return { ...tier, scoreTo: numValue - 1 };
        }
        return tier;
      });
    }

    const isValid = updatedTiers.every((tier, i) => {
      if (i === 0) return true;
      const prevTier = updatedTiers[i - 1];
      return tier.scoreFrom === prevTier.scoreTo + 1;
    });

    if (isValid) {
      setTiers(updatedTiers);
    }
  };

  const handleSave = async () => {
    if (!projectData) return;
    setIsSaving(true);
    try {
      const result = await createOrUpdateScoreTiers(
        tiers,
        projectData.id as string
      );
      if (result?.success) {
        toast.success("Scoretiers saved successfully");
      }
    } catch (error) {
      console.error("Error saving score tiers:", error);
      toast.error("Error saving score tiers");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={ref} id="score-tiers">
      <div
        className={cn(
          "px-2 py w-full flex flex-col space-y-2 text-center sm:text-left "
        )}
      >
        <h2 className="text-2xl font-bold">Theme Settings</h2>
        <p className="text-sm">Edit theme </p>
      </div>
      <div className="mt-2 ">
        <Card className="w-full p-4 bg-slate-100 border-none">
          <div className="flex flex-col space-y-1.5 text-left">
            <div className="font-semibold leading-none tracking-tight">
              Score Tiers
            </div>
            <div className="text-sm text-muted-foreground">
              Often when scores are displayed they're colour coded using a
              traffic light style system. You can customise the tiers and
              colours.
            </div>
          </div>
        </Card>
        <div className="p-4">
          <div className="pt-4">
            <div className="grid grid-cols-5 gap-4 text- font-semibold">
              <div>COLOUR</div>
              <div>LABEL</div>
              <div>SCORE FROM</div>
              <div>SCORE TO</div>
              <div></div>
            </div>
            <div className="">
              {[...tiers]
                .sort((a, b) => a.scoreFrom - b.scoreFrom)
                .map((tier, index) => (
                  <div
                    key={tier.id || index}
                    className="grid grid-cols-5 gap-4 items-center mb-4"
                  >
                    <ColorPicker
                      color={tier.scoreColour}
                      onChange={(newColor) =>
                        updateTier(index, "scoreColour", newColor)
                      }
                      className="w-full"
                    />
                    <Input
                      value={tier.name}
                      onChange={(e) =>
                        updateTier(index, "name", e.target.value)
                      }
                      placeholder="Label"
                    />
                    <Input
                      type="number"
                      value={tier.scoreFrom}
                      onChange={(e) =>
                        updateTier(index, "scoreFrom", parseInt(e.target.value))
                      }
                      min={1}
                      max={98}
                      disabled={tier.scoreFrom === 0}
                      onKeyDown={(e) => {
                        if (["-", "e", "."].includes(e.key)) e.preventDefault();
                      }}
                    />
                    <Input
                      type="number"
                      value={tier.scoreTo}
                      onChange={(e) =>
                        updateTier(index, "scoreTo", parseInt(e.target.value))
                      }
                      min={2}
                      max={99}
                      disabled={tier.scoreTo === 100}
                      onKeyDown={(e) => {
                        if (["-", "e", "."].includes(e.key)) e.preventDefault();
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTier(index)}
                      disabled={tier.scoreFrom === 0 || tier.scoreTo === 100}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={addTier}
                className="flex items-center"
                disabled={!canAddMoreTiers()}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Tier
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ScoreTiersEditor.displayName = "ScoreTiersEditor";
export default ScoreTiersEditor;
