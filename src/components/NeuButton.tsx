import { ButtonHTMLAttributes, ReactNode } from "react";

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export const NeuButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: NeuButtonProps) => {
  return (
    <button
      className={`neu-button px-6 py-3 rounded-xl font-light ${
        variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

