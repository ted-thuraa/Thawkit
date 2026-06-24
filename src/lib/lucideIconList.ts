import React from "react";
import {
  LucideProps,
  Briefcase,
  CheckCircle,
  Home,
  Settings,
  User,
  Search,
  ChevronDown,
  Trash,
  Copy,
  Plus,
  Minus,
  Edit,
  Save,
  X,
  HelpCircle, // Default/fallback icon
  // ... import ALL lucide icons you want to offer
} from "lucide-react";
import {
  FaXTwitter,
  FaFacebook,
  FaSquareInstagram,
  FaRedditAlien,
  FaLinkedin,
} from "react-icons/fa6";

// Type mapping icon names to their components
export const lucideIcons: { [key: string]: React.ComponentType<LucideProps> } =
  {
    Briefcase,
    CheckCircle,
    Home,
    Settings,
    User,
    Search,
    ChevronDown,
    Trash,
    Copy,
    Plus,
    Minus,
    Edit,
    Save,
    X,
    HelpCircle,
    FaXTwitter,
    FaFacebook,
    FaSquareInstagram,
    FaRedditAlien,
    FaLinkedin,
    // ... add all imported icons here
  };

// Export just the names for easier iteration/filtering
export const lucideIconNames = Object.keys(lucideIcons);

// Function to get an icon component by name, with fallback
export const getLucideIcon = (
  name?: string
): React.ComponentType<LucideProps> => {
  if (name && lucideIcons[name]) {
    return lucideIcons[name];
  }
  return HelpCircle; // Return fallback icon
};
