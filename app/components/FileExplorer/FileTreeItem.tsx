'use client';

import { FiFile } from '@/lib/icons';
import { SiJavascript, SiReact, SiCss3, SiJson } from '@/lib/icons';

interface FileTreeItemProps {
  name: string;
  path: string;
  isSelected: boolean;
  isEdited?: boolean;
  onClick: () => void;
}

export function FileTreeItem({ name, path, isSelected, isEdited = false, onClick }: FileTreeItemProps) {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconClass = "w-3.5 h-3.5";

    switch (ext) {
      case 'js':
      case 'jsx':
        return <SiJavascript className={`${iconClass} text-yellow-500`} />;
      case 'tsx':
      case 'ts':
        return <SiReact className={`${iconClass} text-blue-500`} />;
      case 'css':
        return <SiCss3 className={`${iconClass} text-blue-400`} />;
      case 'json':
        return <SiJson className={`${iconClass} text-yellow-600`} />;
      default:
        return <FiFile className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div
      className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {getFileIcon(name)}
      <span className={`text-xs flex items-center gap-1 ${isSelected ? 'font-medium' : ''}`}>
        {name}
        {isEdited && (
          <span className={`text-[10px] px-1 rounded ${
            isSelected ? 'bg-blue-400' : 'bg-orange-500 text-white'
          }`}>✓</span>
        )}
      </span>
    </div>
  );
}
