import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-orange-400 text-primary-foreground hover:shadow-md hover:translate-y-[-1px] hover:from-primary/95 hover:to-orange-500 active:translate-y-0 active:shadow-sm",
        destructive:
          "bg-gradient-to-r from-destructive to-red-400 text-destructive-foreground hover:shadow-md hover:translate-y-[-1px] hover:from-destructive/95 hover:to-red-500 active:translate-y-0 active:shadow-sm",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:border-accent hover:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-sm hover:translate-y-[-1px] active:translate-y-0 active:shadow-none",
        accent: 
          "bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground hover:shadow-md hover:translate-y-[-1px] hover:from-accent/95 hover:to-yellow-600 active:translate-y-0 active:shadow-sm",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
