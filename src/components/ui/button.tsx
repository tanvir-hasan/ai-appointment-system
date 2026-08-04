import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
  inline-flex items-center justify-center
  whitespace-nowrap
  rounded-2xl
  font-medium
  transition-all
  duration-300
  outline-none
  select-none
  active:scale-[0.98]
  disabled:pointer-events-none
  disabled:opacity-50
  focus-visible:ring-2
  focus-visible:ring-indigo-500/40
  [&_svg]:pointer-events-none
  [&_svg]:shrink-0
  [&_svg]:size-4
  `,
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-r
          from-indigo-600
          to-violet-600
          text-white
          shadow-lg
          shadow-indigo-500/20
          hover:shadow-xl
          hover:shadow-indigo-500/30
          hover:from-indigo-500
          hover:to-violet-500
        `,

        outline: `
          border
          border-white/10
          bg-white/5
          text-white
          backdrop-blur
          hover:bg-white/10
          hover:border-indigo-500/30
        `,

        secondary: `
          bg-zinc-800
          text-white
          hover:bg-zinc-700
        `,

        ghost: `
          text-zinc-300
          hover:bg-white/10
          hover:text-white
        `,

        destructive: `
          bg-red-500
          text-white
          shadow-lg
          shadow-red-500/20
          hover:bg-red-600
        `,

        link: `
          text-indigo-400
          hover:text-indigo-300
          underline-offset-4
          hover:underline
        `,
      },

      size: {
        xs: "h-8 px-3 text-xs",

        sm: "h-9 px-4 text-sm",

        default: "h-11 px-5 text-sm",

        lg: "h-12 px-6 text-base",

        icon: "h-11 w-11",

        "icon-xs": "h-8 w-8",

        "icon-sm": "h-9 w-9",

        "icon-lg": "h-12 w-12",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };