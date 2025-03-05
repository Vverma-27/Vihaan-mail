"use client";
export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
