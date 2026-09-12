import React from 'react';
import { useNavigate } from 'react-router-dom';

const destinations = [
  ['Jobs', '/jobs'],
  ['Orders', '/order/create'],
  ['Dashboard', '/dashboard'],
  ['Contacts', '/contacts'],
  ['Reports', '/reports'],
  ['Wallet', '/wallet'],
  ['Billing', '/billing'],
  ['Maps', '/maps'],
] as const;

const PageNavigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav aria-label="Simulator navigation" className="flex flex-wrap gap-2 mb-6">
      {destinations.map(([label, path]) => (
        <button
          key={path}
          type="button"
          onClick={() => navigate(path)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default PageNavigation;
