import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`rounded-xl bg-white p-6 shadow-md ${
        hover ? "hover:shadow-lg transition" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
