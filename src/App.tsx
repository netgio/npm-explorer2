import React, { useState, useEffect } from 'react';
import { Package, Search, X } from 'lucide-react';
import SearchBar from './components/SearchBar';
import PackageInfo from './components/PackageInfo';
import StatsGrid from './components/StatsGrid';
import DownloadChart from './components/DownloadChart';
import { PackageData, ComparisonData } from './types';

const STORAGE_KEY = 'npm-explorer-packages';

function App() {
  const [packages, setPackages] = useState<ComparisonData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved packages on initial render
  useEffect(() => {
    const savedPackages = localStorage.getItem(STORAGE_KEY);
    if (savedPackages) {
      const parsedPackages = JSON.parse(savedPackages);
      // Convert date strings back to Date objects
      Object.values(parsedPackages).forEach((pkg: any) => {
        pkg.created = new Date(pkg.created);
        pkg.modified = new Date(pkg.modified);
      });
      setPackages(parsedPackages);
    }
  }, []);

  // Save packages whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  }, [packages]);

  const getGitHubContributors = async (repoUrl: string): Promise<number> => {
    try {
      // Extract owner and repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return 0;
      
      const [, owner, repo] = match;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`);
      
      // Get total count from Link header
      const link = response.headers.get('Link');
      if (!link) return (await response.json()).length;
      
      const match2 = link.match(/&page=(\d+)>; rel="last"/);
      return match2 ? parseInt(match2[1], 10) : 1;
    } catch (error) {
      console.error('Failed to fetch contributors:', error);
      return 0;
    }
  };

  const fetchPackageData = async (packageName: string) => {
    if (packages[packageName]) {
      setError('Package already added to comparison');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [npmData, downloadsData] = await Promise.all([
        fetch(`https://registry.npmjs.org/${packageName}`).then(res => res.json()),
        fetch(`https://api.npmjs.org/downloads/range/last-month/${packageName}`).then(res => res.json())
      ]);

      const githubUrl = npmData.repository?.url?.replace('git+', '').replace('.git', '') || null;
      const contributors = githubUrl ? await getGitHubContributors(githubUrl) : 0;

      const latestVersion = npmData['dist-tags'].latest;
      const latestVersionData = npmData.versions[latestVersion];

      setPackages(prev => ({
        ...prev,
        [packageName]: {
          name: npmData.name,
          version: latestVersion,
          description: npmData.description,
          author: npmData.author?.name || 'Unknown',
          license: npmData.license,
          downloads: downloadsData.downloads,
          github: githubUrl,
          homepage: npmData.homepage,
          maintainers: npmData.maintainers || [],
          created: new Date(npmData.time.created),
          modified: new Date(npmData.time.modified),
          contributors,
          related: {
            dependencies: Object.keys(latestVersionData.dependencies || {}),
            devDependencies: Object.keys(latestVersionData.devDependencies || {}),
            peerDependencies: Object.keys(latestVersionData.peerDependencies || {})
          }
        }
      }));
    } catch (err) {
      setError('Failed to fetch package data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePackage = (packageName: string) => {
    setPackages(prev => {
      const newPackages = { ...prev };
      delete newPackages[packageName];
      return newPackages;
    });
  };

  const packageCount = Object.keys(packages).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">NPM Package Explorer</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={fetchPackageData} loading={loading} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {packageCount > 0 && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {Object.values(packages).map((pkg) => (
                <div key={pkg.name} className="relative">
                  <button
                    onClick={() => removePackage(pkg.name)}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <PackageInfo package={pkg} />
                </div>
              ))}
            </div>
            <StatsGrid packages={packages} />
            <DownloadChart packages={packages} />
          </div>
        )}

        {packageCount === 0 && !error && (
          <div className="mt-16 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">Compare NPM Packages</h2>
            <p className="mt-2 text-gray-500">Search and add packages to compare their statistics</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;