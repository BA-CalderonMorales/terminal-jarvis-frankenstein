'use client';

import { useState } from 'react';
import { FolderItem } from './FolderItem';
import { FileTreeItem } from './FileTreeItem';

interface FileData {
  path: string;
  content: string;
  type: string;
  completed: boolean;
  edited?: boolean;
}

interface FileTreeProps {
  files: FileData[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

export function FileTree({ files, selectedFile, onFileSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['app', 'src', 'src/components'])
  );

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Build file tree structure
  const buildFileTree = () => {
    const fileTree: { [key: string]: Array<{ name: string; path: string; edited?: boolean }> } = {};

    files.forEach(file => {
      const parts = file.path.split('/');
      const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
      const fileName = parts[parts.length - 1];

      if (!fileTree[dir]) fileTree[dir] = [];
      fileTree[dir].push({
        name: fileName,
        path: file.path,
        edited: file.edited || false
      });
    });

    return fileTree;
  };

  const fileTree = buildFileTree();

  return (
    <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
      <div className="text-sm">
        <FolderItem
          name="app"
          path="app"
          isExpanded={expandedFolders.has('app')}
          onToggle={() => toggleFolder('app')}
          level={0}
        >
          {Object.entries(fileTree).map(([dir, filesInDir]) => (
            <div key={dir}>
              {dir && (
                <FolderItem
                  name={dir.split('/').pop() || dir}
                  path={dir}
                  isExpanded={expandedFolders.has(dir)}
                  onToggle={() => toggleFolder(dir)}
                  level={1}
                >
                  <div className="ml-6">
                    {filesInDir
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(fileInfo => (
                        <FileTreeItem
                          key={fileInfo.path}
                          name={fileInfo.name}
                          path={fileInfo.path}
                          isSelected={selectedFile === fileInfo.path}
                          isEdited={fileInfo.edited}
                          onClick={() => onFileSelect(fileInfo.path)}
                        />
                      ))}
                  </div>
                </FolderItem>
              )}
              {!dir && expandedFolders.has('app') && (
                <div>
                  {filesInDir
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(fileInfo => (
                      <FileTreeItem
                        key={fileInfo.path}
                        name={fileInfo.name}
                        path={fileInfo.path}
                        isSelected={selectedFile === fileInfo.path}
                        isEdited={fileInfo.edited}
                        onClick={() => onFileSelect(fileInfo.path)}
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
        </FolderItem>
      </div>
    </div>
  );
}
