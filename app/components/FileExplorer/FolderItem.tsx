'use client';

import { FiChevronRight, FiChevronDown, BsFolderFill, BsFolder2Open } from '@/lib/icons';

interface FolderItemProps {
  name: string;
  path: string;
  isExpanded: boolean;
  onToggle: () => void;
  level?: number;
  children?: React.ReactNode;
}

export function FolderItem({ name, path, isExpanded, onToggle, level = 0, children }: FolderItemProps) {
  const isRoot = level === 0;

  return (
    <div className="mb-1">
      <div
        className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
        onClick={onToggle}
      >
        {isExpanded ? (
          <FiChevronDown className="w-4 h-4 text-gray-600" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        )}
        {isExpanded ? (
          <BsFolder2Open className={`w-4 h-4 ${isRoot ? 'text-blue-500' : 'text-yellow-600'}`} />
        ) : (
          <BsFolderFill className={`w-4 h-4 ${isRoot ? 'text-blue-500' : 'text-yellow-600'}`} />
        )}
        <span className={`${isRoot ? 'font-medium text-gray-800' : 'text-gray-700'}`}>
          {name}
        </span>
      </div>
      {isExpanded && children && (
        <div className={level > 0 ? 'ml-4' : 'ml-4'}>
          {children}
        </div>
      )}
    </div>
  );
}
