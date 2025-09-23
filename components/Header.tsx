
import React from 'react';
import { LOGO_URL } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-neutral-light py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <img src={LOGO_URL} alt="重庆联合丽格科技有限公司 Logo" className="h-10 md:h-12 w-auto" />
          <span className="ml-3 text-xl md:text-2xl font-medium text-neutral-dark tracking-wide">馒化脸修复AI咨询</span>
        </div>
        {/* Navigation could go here if needed */}
        {/* <nav className="space-x-4">
          <a href="#about" className="text-neutral-dark hover:text-brand-primary">关于我们</a>
          <a href="#services" className="text-neutral-dark hover:text-brand-primary">服务项目</a>
          <a href="#contact" className="text-neutral-dark hover:text-brand-primary">联系我们</a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
