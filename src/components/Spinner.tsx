import { motion } from "framer-motion";
import type { JSX } from "react";

type SpinnerProps = {
  size?: number;           // size in px (width & height)
  thickness?: number;      // border thickness in px
  colorClass?: string;     // tailwind color class for the border
  speed?: number;          // spin duration in seconds
  ariaLabel?: string;      // accessibility label
};

export default function Spinner({
  size = 24,
  thickness = 4,
  colorClass = "border-blue-500",
  speed = 1,
  ariaLabel = "Loading...",
}: SpinnerProps): JSX.Element {
  return (
    <motion.div
      role="status"
      aria-label={ariaLabel}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: speed,
      }}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
      }}
      className={`rounded-full animate-spin border-t-transparent ${colorClass} border-solid border`}
    />
  );
}
