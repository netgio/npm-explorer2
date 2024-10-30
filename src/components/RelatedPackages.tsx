import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { RelatedPackages as RelatedPackagesType } from '../types';

interface RelatedPackagesProps {
  name: string;
  related: RelatedPackagesType;
}

function PackageList({ title, packages }: { title: string; packages: string[] }) {
  if (packages.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        {packages.map((pkg) => (
          <a
            key={pkg}
            href={`https://www.npmjs.com/package/${pkg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-2 py-1 bg-gray-50 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900 truncate"
          >
            {pkg}
          </a>
        ))}
      </div>
    </div>
  );
}

function RelatedPackages({ name, related }: RelatedPackagesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalPackages = 
    related.dependencies.length + 
    related.devDependencies.length + 
    related.peerDependencies.length;

  if (totalPackages === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            Related Packages ({totalPackages})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3">
          <PackageList 
            title="Dependencies" 
            packages={related.dependencies}
          />
          <PackageList 
            title="Peer Dependencies" 
            packages={related.peerDependencies}
          />
          <PackageList 
            title="Dev Dependencies" 
            packages={related.devDependencies}
          />
        </div>
      )}
    </div>
  );
}

export default RelatedPackages;