"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllToolDetail } from "@/lib/types";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
//import { toast } from "@/components/hooks/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { GripVertical, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { CreateLeadTool } from "@/actions/create-tool";
import { useRouter } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  onFieldAdd: (field: any) => void;
};

const fieldOptions = [
  { value: "phone", label: "Phone" },
  { value: "country", label: "Country" },
  { value: "company", label: "Company" },
  { value: "industry", label: "Industry" },
  { value: "address", label: "Address" },
  { value: "custom", label: "Custom" },
];

const customTypeOptions = [
  { value: "text", label: "Text" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number/Float" },
  { value: "checkbox", label: "Checkbox" },
  { value: "phone", label: "Phone" },
  { value: "country", label: "Country" },
  { value: "industry", label: "Industry" },
];

const NewLeadFormField = ({ onFieldAdd }: Props) => {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [customType, setCustomType] = useState<string>("text");

  const handleAddField = () => {
    let newField;
    switch (selectedField) {
      case "phone":
        newField = {
          enabled: true,
          label: "Phone number",
          type: "phone",
          phoneCountry: "",
          required: false,
        };
        break;
      case "country":
        newField = {
          enabled: true,
          label: "Country",
          type: "country",
          required: false,
        };
        break;
      case "company":
        newField = {
          enabled: true,
          label: "Company",
          type: "text",
          required: false,
        };
        break;
      case "industry":
        newField = {
          enabled: true,
          label: "Industry",
          type: "industry",
          required: false,
        };
        break;
      case "address":
        newField = {
          enabled: true,
          label: "Address",
          type: "text",
          required: false,
        };
        break;
      case "custom":
        newField = {
          enabled: true,
          label: "New Field",
          type: customType,
          required: false,
        };
        break;
      default:
        return;
    }
    onFieldAdd(newField);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Select a field to add</h3>
      <Select onValueChange={setSelectedField}>
        <SelectTrigger>
          <SelectValue placeholder="Select a field type" />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedField === "custom" && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Custom field type</h4>
          <Select onValueChange={setCustomType} defaultValue="text">
            <SelectTrigger>
              <SelectValue placeholder="Select a custom field type" />
            </SelectTrigger>
            <SelectContent>
              {customTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <DialogClose asChild>
          <Button onClick={handleAddField} disabled={!selectedField}>
            Add Field
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default NewLeadFormField;
