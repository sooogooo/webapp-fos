import React from 'react';

interface FeatureCardProps {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center ${className}`}>
      <div className="text-brand-primary mb-4">
        {React.cloneElement(icon, { className: "w-12 h-12" })}
      </div>
      <h3 className="text-xl font-medium text-neutral-dark mb-2 tracking-wide">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm tracking-normal">{description}</p>
    </div>
  );
};

export default FeatureCard;
