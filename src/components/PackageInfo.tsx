import React from 'react';
import { Calendar, Github } from 'lucide-react';
import { format } from 'date-fns';
import { PackageData } from '../types';
import RelatedPackages from './RelatedPackages';

interface PackageInfoProps {
  package: PackageData;
}

function PackageInfo({ package: pkg }: PackageInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-[300px]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{pkg.name}</h2>
          <p className="mt-1 text-sm text-gray-500">v{pkg.version}</p>
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{pkg.description}</p>
        </div>
        {pkg.github && (
          <a
            href={pkg.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 ml-4 flex-shrink-0"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{format(pkg.created, 'MMM d, yyyy')}</span>
        </div>
        <div>
          <span className="font-medium">License:</span> {pkg.license}
        </div>
        <div>
          <span className="font-medium">Author:</span> {pkg.author}
        </div>
      </div>

      <RelatedPackages name={pkg.name} related={pkg.related} />
    </div>
  );
}

export default PackageInfo;