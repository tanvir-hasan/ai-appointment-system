"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    />
  )
}


function DialogTrigger({
  children,
  asChild,
  ...props
}: DialogPrimitive.Trigger.Props & {
  asChild?: boolean
}) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={
        asChild
          ? React.Children.only(children) as React.ReactElement
          : undefined
      }
      {...props}
    >
      {!asChild && children}
    </DialogPrimitive.Trigger>
  )
}


function DialogPortal({
  ...props
}: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  )
}


function DialogClose({
  children,
  asChild,
  ...props
}: DialogPrimitive.Close.Props & {
  asChild?: boolean
}) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={
        asChild
          ? React.Children.only(children) as React.ReactElement
          : undefined
      }
      {...props}
    >
      {!asChild && children}
    </DialogPrimitive.Close>
  )
}


function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/70 backdrop-blur-md",
        "data-open:animate-in data-open:fade-in-0",
        "data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}


function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {

  return (
    <DialogPortal>

      <DialogOverlay />


      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "w-full max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-3xl",
          "border border-white/10",
          "bg-gradient-to-br from-zinc-900 via-zinc-900 to-black",
          "p-8",
          "text-white",
          "shadow-2xl shadow-black/60",
          "backdrop-blur-2xl",
          "outline-none",
          "duration-200",
          "data-open:animate-in",
          "data-open:fade-in-0",
          "data-open:zoom-in-95",
          "data-closed:animate-out",
          "data-closed:fade-out-0",
          "data-closed:zoom-out-95",
          className
        )}
        {...props}
      >

        {children}


        {showCloseButton && (

          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-5 top-5 rounded-xl text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              />
            }
          >

            <XIcon className="h-5 w-5" />

            <span className="sr-only">
              Close
            </span>

          </DialogPrimitive.Close>

        )}


      </DialogPrimitive.Popup>


    </DialogPortal>
  )
}



function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "mb-6 flex flex-col gap-2",
        className
      )}
      {...props}
    />
  )
}



function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >

      {children}


      {showCloseButton && (

        <DialogPrimitive.Close
          render={
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            />
          }
        >
          Close
        </DialogPrimitive.Close>

      )}


    </div>
  )
}



function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {

  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-2xl font-semibold tracking-tight text-white",
        className
      )}
      {...props}
    />
  )
}



function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {

  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm leading-6 text-zinc-400",
        className
      )}
      {...props}
    />
  )
}



export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}