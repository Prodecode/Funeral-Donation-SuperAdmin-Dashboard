import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children, size = "default" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
      
      // Focus trap - focus the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElement) {
            focusableElement.focus();
          }
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    small: "sm:max-w-md",
    default: "sm:max-w-lg",
    large: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay with improved animation */}
      <div 
        className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity duration-300 ease-out"
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className={`
            relative w-full ${sizeClasses[size]} 
            bg-white rounded-xl shadow-2xl 
            transform transition-all duration-300 ease-out
            animate-modal-enter
          `}
          role="dialog"
          aria-modal="true"
        >
          {/* Subtle top border for visual appeal */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl" />
          
          {/* Content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;