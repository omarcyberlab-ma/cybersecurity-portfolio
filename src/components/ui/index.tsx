import React from 'react';

type Variant = 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

const variantClasses: Record<Variant, string> = {
  default: 'bg-[var(--accent)] text-[#0a0e14] hover:brightness-110',
  destructive: 'bg-[var(--destructive)] text-white hover:brightness-110',
  outline: 'border border-[var(--border)] bg-transparent hover:bg-[var(--surface)]',
  ghost: 'bg-transparent hover:bg-[var(--surface)]',
  link: 'text-[var(--accent)] underline-offset-4 hover:underline',
};

const sizeClasses: Record<Size, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-10 px-8',
  icon: 'h-9 w-9',
};

export function Button({ variant = 'default' as Variant, size = 'default' as Size, className = '', children, ...props }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 font-mono ${variantClasses[variant as Variant] || variantClasses.default} ${sizeClasses[size as Size] || sizeClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = '', ...props }: any) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }: any) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Card({ className = '', children, ...props }: any) {
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: any) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: any) {
  return <h3 className={`font-semibold leading-none tracking-tight font-mono ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }: any) {
  return <p className={`text-sm text-[var(--muted-foreground)] ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }: any) {
  return <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: any) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>{children}</div>;
}

export function Badge({ className = '', children, ...props }: any) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-mono transition-colors ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
