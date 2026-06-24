"use client";
import React, { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { AllToolDetail } from "@/lib/types";
import { ScoreTiers } from "@prisma/client";
import { SaveScoreTiers } from "@/actions/scoretiers";
import { ColorPicker } from "@/components/global/colorPicker";
import { v4 } from "uuid";

type Props = {
  toolId: string;
  //toolRef: string;
  toolData: AllToolDetail;
};

const ScoreTierSettings = ({ toolId, toolData }: Props) => {
  const [tiers, setTiers] = useState<ScoreTiers[]>([]);
  const [isSaving, setIsSaving] = useState(false); // Add this line

  console.log(tiers);
  useEffect(() => {
    if (toolData?.ScoreTiers) {
      // Sort tiers by score_from when initializing
      const sortedTiers = [...toolData.ScoreTiers].sort(
        (a, b) => a.score_from - b.score_from
      );
      setTiers(sortedTiers);
    }
  }, [toolData?.ScoreTiers]);

  // Function to check if we can add more tiers
  const canAddMoreTiers = () => {
    if (!tiers || tiers.length === 0) return false;

    const sortedTiers = [...tiers].sort((a, b) => a.score_from - b.score_from);
    const lastTier = sortedTiers[sortedTiers.length - 1];

    if (!lastTier) return false;

    // If the last tier has a range of just 1 (99-100), we can't add more
    return lastTier.score_to - lastTier.score_from > 1;
  };

  const addTier = () => {
    if (!canAddMoreTiers()) return;

    const sortedTiers = [...tiers].sort((a, b) => a.score_from - b.score_from);
    const lastTier = sortedTiers[sortedTiers.length - 1];

    // Calculate the midpoint for splitting the last tier
    const rangeToSplit = lastTier.score_to - lastTier.score_from;
    const splitPoint = Math.floor(lastTier.score_from + rangeToSplit / 2);

    // Update the last tier's range
    const updatedLastTier = {
      ...lastTier,
      score_from: splitPoint + 1,
    };

    // Create new tier
    const newTier = {
      id: "", // Generate a new UUID
      name: "new",
      score_colour: "#CCCCCC",
      score_from: lastTier.score_from,
      score_to: splitPoint,
      toolId,
    };

    // Remove the old last tier and add both new tiers
    const tiersWithoutLast = sortedTiers.slice(0, -1);
    setTiers(
      [...tiersWithoutLast, newTier, updatedLastTier].sort(
        (a, b) => a.score_from - b.score_from
      )
    );
  };

  const removeTier = (index: number) => {
    const sortedTiers = [...tiers].sort((a, b) => a.score_from - b.score_from);
    const tierToRemove = sortedTiers[index];

    // Don't allow removal of first (0) or last (100) tiers
    if (tierToRemove.score_from === 0 || tierToRemove.score_to === 100) return;

    // Update the next tier's score_from to match the previous tier's score_to + 1
    const updatedTiers = sortedTiers
      .filter((_, i) => i !== index)
      .map((tier, i, array) => {
        if (i > 0) {
          const prevTier = array[i - 1];
          return {
            ...tier,
            score_from: prevTier.score_to + 1,
          };
        }
        return tier;
      });

    setTiers(updatedTiers);
  };

  const updateTier = (index: number, field: string, value: string | number) => {
    const sortedTiers = [...tiers].sort((a, b) => a.score_from - b.score_from);

    // Convert value to number and validate range
    const numValue = Number(value);
    console.log(numValue);
    // Prevent invalid values
    if (numValue <= 0 || numValue >= 100) {
      return;
    }

    // Don't allow updates to first tier's score_from (0) or last tier's score_to (100)
    if (
      (index === 0 && field === "score_from") ||
      (index === sortedTiers.length - 1 && field === "score_to")
    ) {
      return;
    }

    const updatedTiers = sortedTiers.map((tier, i) => {
      // Current tier being updated
      if (i === index) {
        const updatedTier = { ...tier, [field]: Number(value) };

        // Ensure score_to is greater than score_from
        if (field === "score_from" && updatedTier.score_to <= Number(value)) {
          updatedTier.score_to = Number(value) + 1;
        }
        if (field === "score_to" && updatedTier.score_from >= Number(value)) {
          updatedTier.score_from = Number(value) - 1;
        }

        return updatedTier;
      }

      // Update next tier's score_from when current tier's score_to changes
      if (i === index + 1 && field === "score_to") {
        return {
          ...tier,
          score_from: Number(value) + 1,
        };
      }

      // Update previous tier's score_to when current tier's score_from changes
      if (i === index - 1 && field === "score_from") {
        return {
          ...tier,
          score_to: Number(value) - 1,
        };
      }

      return tier;
    });

    // Validate ranges before setting
    const isValid = updatedTiers.every((tier, i) => {
      if (i === 0) return true;
      const prevTier = updatedTiers[i - 1];
      return tier.score_from === prevTier.score_to + 1;
    });

    if (isValid) {
      setTiers(updatedTiers);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SaveScoreTiers(tiers, toolId);
      // You might want to add a success message or update the UI here
    } catch (error) {
      console.error("Error saving score tiers:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Tiers</CardTitle>
        <CardDescription>
          Often when scores are displayed they're colour coded using a traffic
          light style system. You can customise the tiers and colours.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-4 font-semibold">
          <div>COLOUR</div>
          <div>LABEL</div>
          <div>SCORE FROM</div>
          <div>SCORE TO</div>
          <div></div>
        </div>
        {[...tiers]
          .sort((a, b) => a.score_from - b.score_from)
          .map((tier, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <ColorPicker
                color={tier.score_colour}
                onChange={(newColor) =>
                  updateTier(index, "score_colour", newColor)
                }
                className="w-full h-10 p-1 rounded"
              />
              <Input
                value={tier.name}
                onChange={(e) => updateTier(index, "name", e.target.value)}
                placeholder="Label"
              />
              <Input
                type="number"
                value={tier.score_from}
                onChange={(e) =>
                  updateTier(index, "score_from", parseInt(e.target.value))
                }
                min={1}
                max={98}
                disabled={tier.score_from === 0}
                onKeyDown={(e) => {
                  // Prevent typing of invalid values
                  if (["-", "e", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Input
                type="number"
                value={tier.score_to}
                onChange={(e) =>
                  updateTier(index, "score_to", parseInt(e.target.value))
                }
                min={2}
                max={99}
                disabled={tier.score_to === 100}
                onKeyDown={(e) => {
                  // Prevent typing of invalid values
                  if (["-", "e", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTier(index)}
                disabled={tier.score_from === 0 || tier.score_to === 100}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        <Button
          variant="outline"
          onClick={addTier}
          className="flex items-center"
          disabled={!canAddMoreTiers()}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Tier
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScoreTierSettings;
