import React from 'react';
import { ExamType } from '../types';

interface FooterProps {
  activeExamType: ExamType;
}

const Footer: React.FC<FooterProps> = ({ activeExamType }) => {
  const linkHoverClass = 'hover:text-white';

  return (
    <footer className="bg-[#0d0c15] mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
               <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} AI Exam Prep. All rights reserved.</p>
               <p className="text-xs text-gray-500 mt-1">AI-Powered Mock Tests for Competitive Exam Aspirants.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className={`text-sm text-gray-400 ${linkHoverClass}`}>About</a>
              <a href="#" className={`text-sm text-gray-400 ${linkHoverClass}`}>Privacy Policy</a>
              <a href="#" className={`text-sm text-gray-400 ${linkHoverClass}`}>Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
