import React from "react";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  size?: number;
  color?: string;
  className?: string;
};

const ButtonLoader: React.FC<LoaderProps> = ({ size = 20, color = "white", className = "" }) => {
  return (
    <Loader2
      className={`animate-spin ${className}`}
      style={{ width: size, height: size, color }}
    />
  );
};

export default ButtonLoader;
