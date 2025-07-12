import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type { MotionProps } from "framer-motion";

type AnimatedSubmitButtonProps = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"button"> & MotionProps;

export default function AnimatedSubmitButton({
  children,
  ...props
}: AnimatedSubmitButtonProps): JSX.Element {
  return (
    <motion.button
      type="submit"
      className="w-full mt-6 py-3 text-base font-semibold tracking-wide rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.85, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
