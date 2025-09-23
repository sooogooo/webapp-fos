
import React from 'react';

interface ActionButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, href, onClick, className, icon, target, rel }) => {
  const baseClasses = "inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300 tracking-wider";

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`} target={target} rel={rel}>
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${className}`}>
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default ActionButton;
