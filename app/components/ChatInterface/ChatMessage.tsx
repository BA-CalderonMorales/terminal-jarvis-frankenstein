'use client';

import type { ChatMessage as ChatMessageType } from '@/app/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isLast: boolean;
  generatedFiles?: Array<{ path: string; type: string }>;
}

export function ChatMessage({ message, isLast, generatedFiles = [] }: ChatMessageProps) {
  const isGenerationComplete =
    message.content.includes('Successfully recreated') ||
    message.content.includes('AI recreation generated!') ||
    message.content.includes('Code generated!');

  const completedFiles = message.metadata?.appliedFiles || [];

  return (
    <div className="block">
      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="block">
          <div className={`block rounded-[10px] px-4 py-2 ${
            message.type === 'user' ? 'bg-[#36322F] text-white ml-auto max-w-[80%]' :
            message.type === 'ai' ? 'bg-gray-100 text-gray-900 mr-auto max-w-[80%]' :
            message.type === 'system' ? 'bg-[#36322F] text-white text-sm' :
            message.type === 'command' ? 'bg-[#36322F] text-white font-mono text-sm' :
            message.type === 'error' ? 'bg-red-900 text-red-100 text-sm border border-red-700' :
            'bg-[#36322F] text-white text-sm'
          }`}>
            {message.type === 'command' ? (
              <div className="flex items-start gap-2">
                <span className={`text-xs ${
                  message.metadata?.commandType === 'input' ? 'text-blue-400' :
                  message.metadata?.commandType === 'error' ? 'text-red-400' :
                  message.metadata?.commandType === 'success' ? 'text-green-400' :
                  'text-gray-400'
                }`}>
                  {message.metadata?.commandType === 'input' ? '$' : '>'}
                </span>
                <span className="flex-1 whitespace-pre-wrap text-white">{message.content}</span>
              </div>
            ) : message.type === 'error' ? (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Build Errors Detected</div>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className="mt-2 text-xs opacity-70">Press 'F' or click the Fix button above to resolve</div>
                </div>
              </div>
            ) : (
              message.content
            )}
          </div>

          {/* Show applied files if this is an apply success message */}
          {message.metadata?.appliedFiles && message.metadata.appliedFiles.length > 0 && (
            <div className="mt-2 inline-block bg-gray-100 rounded-[10px] p-3">
              <div className="text-xs font-medium mb-1 text-gray-700">
                {message.content.includes('Applied') ? 'Files Updated:' : 'Generated Files:'}
              </div>
              <div className="flex flex-wrap items-start gap-1">
                {message.metadata.appliedFiles.map((filePath, fileIdx) => {
                  const fileName = filePath.split('/').pop() || filePath;
                  const fileExt = fileName.split('.').pop() || '';
                  const fileType = fileExt === 'jsx' || fileExt === 'js' ? 'javascript' :
                                  fileExt === 'css' ? 'css' :
                                  fileExt === 'json' ? 'json' : 'text';

                  return (
                    <div
                      key={`applied-${fileIdx}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#36322F] text-white rounded-[10px] text-xs animate-fade-in-up"
                      style={{ animationDelay: `${fileIdx * 30}ms` }}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        fileType === 'css' ? 'bg-blue-400' :
                        fileType === 'javascript' ? 'bg-yellow-400' :
                        fileType === 'json' ? 'bg-green-400' :
                        'bg-gray-400'
                      }`} />
                      {fileName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Show generated files for completion messages */}
          {isGenerationComplete && generatedFiles.length > 0 && isLast && !message.metadata?.appliedFiles && (
            <div className="mt-2 inline-block bg-gray-100 rounded-[10px] p-3">
              <div className="text-xs font-medium mb-1 text-gray-700">Generated Files:</div>
              <div className="flex flex-wrap items-start gap-1">
                {generatedFiles.map((file, fileIdx) => {
                  const fileName = file.path.split('/').pop() || file.path;
                  return (
                    <div
                      key={`complete-${fileIdx}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#36322F] text-white rounded-[10px] text-xs animate-fade-in-up"
                      style={{ animationDelay: `${fileIdx * 30}ms` }}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        file.type === 'css' ? 'bg-blue-400' :
                        file.type === 'javascript' ? 'bg-yellow-400' :
                        file.type === 'json' ? 'bg-green-400' :
                        'bg-gray-400'
                      }`} />
                      {fileName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
