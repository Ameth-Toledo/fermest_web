import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence, type Transition } from 'motion/react'
import { cn } from '../../lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} {...props} className={cn('fixed inset-0 z-50', className)} />
))
DialogOverlay.displayName = 'DialogOverlay'

type FromDirection = 'top' | 'bottom' | 'left' | 'right'

const getInitialMotion = (from: FromDirection) => ({
  top:    { y: '-100%', opacity: 0 },
  bottom: { y: '100%',  opacity: 0 },
  left:   { x: '-100%', opacity: 0 },
  right:  { x: '100%',  opacity: 0 },
}[from])

interface DialogContentProps extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'asChild' | 'forceMount'> {
  showCloseButton?: boolean
  from?: FromDirection
  transition?: Transition
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({
  className,
  children,
  showCloseButton = true,
  from = 'top',
  transition = { type: 'spring', stiffness: 150, damping: 25 },
  ...props
}, ref) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => { setOpen(true) }, [])

  return (
    <DialogPortal>
      <AnimatePresence>
        {open && (
          <>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content ref={ref} forceMount asChild {...props}>
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
                  'rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl',
                  className
                )}
                initial={{ ...getInitialMotion(from), scale: 0.95 }}
                animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                exit={{ ...getInitialMotion(from), scale: 0.95 }}
                transition={transition}
              >
                {showCloseButton && (
                  <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-neutral-500 hover:text-neutral-300 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-neutral-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </DialogPrimitive.Close>
                )}
                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </DialogPortal>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex justify-end gap-2 mt-6', className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-base font-semibold text-white', className)} {...props} />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-neutral-400 leading-relaxed', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
