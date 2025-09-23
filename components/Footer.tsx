
import React from 'react';
import { FOOTER_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-light py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p className="mb-2 tracking-wider">
          {FOOTER_INFO.companyName}
        </p>
        <p>
          <a 
            href={FOOTER_INFO.icpLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-brand-secondary transition-colors duration-300 tracking-wider"
          >
            {FOOTER_INFO.icpRecord}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
