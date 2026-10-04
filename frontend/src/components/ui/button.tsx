'use client';

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none relative overflow-hidden cursor-pointer font-teko uppercase tracking-widest",
  {
    variants: {
      variant: {
        default: "bg-primary text-black hover:bg-primary/90 pubg-btn shadow-[0_4px_18px_rgba(242,169,0,0.2)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 pubg-btn shadow-[0_4px_18px_rgba(220,38,38,0.2)]",
        outline:
          "border border-[#1f1f1f] bg-transparent hover:bg-white/5 text-white pubg-btn",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 pubg-btn",
        ghost:
          "text-muted-foreground hover:text-white hover:bg-white/5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-2 text-lg",
        sm: "h-10 px-6 text-sm",
        lg: "h-14 px-12 text-xl",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={cn(buttonVariants({ variant, size, className }), "group")}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2 pointer-events-none">
          {children}
        </span>
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
