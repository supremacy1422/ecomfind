"use client" 
 
import * as React from "react" 
import { cn } from "@/lib/utils" 
 
const DialogContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void }| null>(null) 
 
function useDialog() { 
  const ctx = React.useContext(DialogContext) 
  if (!ctx) throw new Error("Dialog components must be used inside Dialog") 
  return ctx 
} 
 
const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => { 
  const [internalOpen, setInternalOpen] = React.useState(false) 
  const isOpen = open !== undefined ? open : internalOpen 
  const handleChange = (value: boolean) => { 
    onOpenChange?.(value) 
    setInternalOpen(value) 
  } 
  return ( 
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleChange }}> 
      {children} 
      {isOpen && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => handleChange(false)}> 
          <div className="relative bg-background rounded-lg shadow-lg max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}> 
            <div className="p-6">{children}</div> 
          </div> 
        </div> 
      )} 
    </DialogContext.Provider> 
  ) 
} 
 
interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { 
  asChild?: boolean 
} 
 
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(({ children, asChild, ...props }, ref) => { 
  const { onOpenChange } = useDialog() 
  const handleClick = () => onOpenChange(true) 
 
  if (asChild && React.isValidElement(children)) { 
    const child = children as React.ReactElement<any> 
    const originalOnClick = child.props.onClick 
    return React.cloneElement(child, { 
      onClick: (e: any) => { 
        handleClick() 
        originalOnClick?.(e) 
      }, 
      ref, 
    } as any) 
  } 
 
  return ( 
    <button ref={ref} onClick={handleClick} {...props}> 
      {children} 
    </button> 
  ) 
}) 
DialogTrigger.displayName = "DialogTrigger" 
 
const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => ( 
  <div ref={ref} className={cn("p-6", className)} {...props}> 
    {children} 
  </div> 
)) 
DialogContent.displayName = "DialogContent" 
 
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => ( 
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} /> 
) 
DialogHeader.displayName = "DialogHeader" 
 
const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => ( 
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} /> 
)) 
DialogTitle.displayName = "DialogTitle" 
 
const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => ( 
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} /> 
)) 
DialogDescription.displayName = "DialogDescription" 
 
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } 
