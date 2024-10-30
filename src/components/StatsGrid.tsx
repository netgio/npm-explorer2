import React, { useState } from 'react';
import { Download, Users, Clock, Info, X, Github } from 'lucide-react';
import { ComparisonData, Maintainer } from '../types';

interface StatsGridProps {
  packages: ComparisonData;
}

interface PopoverProps {
  packageName: string;
  maintainers: Maintainer[];
  contributors: number;
  onClose: () => void;
  position: { x: number; y: number } | null;
}

function MaintainersPopover({ packageName, maintainers, contributors, onClose, position }: PopoverProps) {
  if (!position) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%) translateY(-8px)'
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{packageName}</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <h5 className="font-medium text-gray-900">NPM Maintainers</h5>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {maintainers.length} active {maintainers.length === 1 ? 'maintainer' : 'maintainers'} who can publish updates
          </p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {maintainers.map((maintainer, index) => (
              <div 
                key={index} 
                className="text-sm bg-gray-50 rounded p-2 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">{maintainer.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Github className="h-4 w-4 text-gray-900" />
            <h5 className="font-medium text-gray-900">GitHub Contributors</h5>
          </div>
          <p className="text-sm text-gray-600">
            {contributors} {contributors === 1 ? 'contributor has' : 'contributors have'} made code contributions to this project
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ packages }: StatsGridProps) {
  const [popover, setPopover] = useState<{
    packageName: string;
    maintainers: Maintainer[];
    contributors: number;
    position: { x: number; y: number };
  } | null>(null);

  const packageNames = Object.keys(packages);

  const handleInfoClick = (e: React.MouseEvent, packageName: string, maintainers: Maintainer[], contributors: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopover({
      packageName,
      maintainers,
      contributors,
      position: {
        x: rect.left,
        y: rect.top
      }
    });
  };

  React.useEffect(() => {
    const handleClickOutside = () => setPopover(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Package Statistics</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-500 pb-4">Metric</th>
              {packageNames.map(name => (
                <th key={name} className="text-left text-sm font-medium text-gray-500 pb-4 px-4">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 flex items-center">
                <Download className="h-5 w-5 text-green-600 mr-2" />
                Monthly Downloads
              </td>
              {packageNames.map(name => (
                <td key={name} className="px-4 py-4 text-gray-900">
                  {packages[name].downloads
                    .reduce((sum, day) => sum + day.downloads, 0)
                    .toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-4 flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                Maintainers & Contributors
              </td>
              {packageNames.map(name => (
                <td key={name} className="px-4 py-4 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span>{packages[name].maintainers.length} / {packages[name].contributors}</span>
                    <button
                      onClick={(e) => handleInfoClick(e, name, packages[name].maintainers, packages[name].contributors)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-4 flex items-center">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                Last Updated
              </td>
              {packageNames.map(name => (
                <td key={name} className="px-4 py-4 text-gray-900">
                  {packages[name].modified.toLocaleDateString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {popover && (
        <MaintainersPopover
          packageName={popover.packageName}
          maintainers={popover.maintainers}
          contributors={popover.contributors}
          position={popover.position}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  );
}

export default StatsGrid;