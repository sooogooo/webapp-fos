
import React from 'react';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  containerClassName?: string;
  hasTopBorder?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  id,
  title, 
  subtitle, 
  children, 
  className = "py-16 md:py-24", 
  titleClassName = "text-3xl md:text-4xl font-light text-center text-neutral-dark mb-4 tracking-wider",
  subtitleClassName = "text-lg text-center text-gray-600 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed tracking-wide",
  containerClassName = "container mx-auto px-4 sm:px-6 lg:px-8",
  hasTopBorder = false
}) => {
  return (
    <section id={id} className={`${className} ${hasTopBorder ? 'border-t border-neutral-medium' : ''}`}>
      <div className={containerClassName}>
        {title && <h2 className={titleClassName}>{title}</h2>}
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
};

export default Section;
