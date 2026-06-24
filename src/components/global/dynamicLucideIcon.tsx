import React from "react";
import { LucideProps } from "lucide-react";
import { getLucideIcon } from "@/lib/lucideIconList"; // Adjust path as needed

interface DynamicLucideIconProps extends LucideProps {
  name?: string;
}

const DynamicLucideIcon: React.FC<DynamicLucideIconProps> = React.memo(
  ({ name, ...props }) => {
    const IconComponent = getLucideIcon(name);

    // Pass down standard Lucide props like size, className, color, etc.
    return <IconComponent {...props} />;
  }
);

DynamicLucideIcon.displayName = "DynamicLucideIcon";

export default DynamicLucideIcon;
