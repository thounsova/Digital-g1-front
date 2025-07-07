import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const base = 'rounded px-4 py-2 font-medium transition-all';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="inline mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};
