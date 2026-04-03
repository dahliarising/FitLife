import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:brightness-110 active:scale-[0.97] shadow-sm',
  secondary: 'bg-secondary text-white hover:brightness-110 active:scale-[0.97] shadow-sm',
  outline: 'border border-border bg-transparent hover:bg-surface-hover active:scale-[0.97] text-foreground',
  ghost: 'bg-transparent hover:bg-surface-hover active:scale-[0.97] text-foreground',
  danger: 'bg-danger text-white hover:brightness-110 active:scale-[0.97] shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl min-h-[36px]',
  md: 'px-4 py-2.5 text-sm rounded-xl min-h-[44px]',
  lg: 'px-6 py-3 text-base rounded-2xl min-h-[48px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold cursor-pointer
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
