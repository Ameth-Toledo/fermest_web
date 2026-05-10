import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../../lib/utils'

type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'asChild'
> & {
  variant?: 'default' | 'accent'
  size?: 'default' | 'sm' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4 rounded',
  default: 'h-5 w-5 rounded-md',
  lg: 'h-6 w-6 rounded-md',
}

const iconSize = {
  sm: 10,
  default: 12,
  lg: 14,
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant = 'default', size = 'default', checked, onCheckedChange, ...props }, ref) => {
  const isAccent = variant === 'accent'

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'flex items-center justify-center border transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size ?? 'default'],
        checked
          ? isAccent
            ? 'bg-green-500 border-green-500'
            : 'bg-white border-white'
          : 'bg-transparent border-neutral-600 hover:border-neutral-400',
        className
      )}
      {...props}
    >
      <AnimatePresence>
        {checked && (
          <CheckboxPrimitive.Indicator forceMount asChild>
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <svg
                width={iconSize[size ?? 'default']}
                height={iconSize[size ?? 'default']}
                viewBox="0 0 12 12"
                fill="none"
              >
                <motion.path
                  d="M2 6l3 3 5-5"
                  stroke={isAccent ? '#fff' : '#000'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>
          </CheckboxPrimitive.Indicator>
        )}
      </AnimatePresence>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox }
