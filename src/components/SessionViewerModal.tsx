import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SessionViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionUrl: string;
  sessionTitle: string;
}

export default function SessionViewerModal({
  isOpen,
  onClose,
  sessionUrl,
  sessionTitle,
}: SessionViewerModalProps) {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIframeError(false);
      setIsLoading(true);
    }
  }, [isOpen, sessionUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIsLoading(false);
  };

  const handleOpenInNewTab = () => {
    window.open(sessionUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-coral-50 to-pink-50">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {sessionTitle}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Session Recording</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleOpenInNewTab}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors text-gray-600 hover:text-coral-600"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors text-gray-600 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-gray-900">
          {isLoading && !iframeError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/80">Loading session...</p>
              </div>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-8">
              <div className="text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Unable to Load in Frame
                </h3>
                <p className="text-gray-400 mb-6">
                  This session cannot be displayed in an iframe due to security restrictions.
                  Click the button below to open it in a new tab instead.
                </p>
                <button
                  onClick={handleOpenInNewTab}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white font-medium rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in New Tab
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={sessionUrl}
              className="w-full h-full border-0"
              title={sessionTitle}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              If the session doesn't load, try opening it in a new tab
            </p>
            <button
              onClick={handleOpenInNewTab}
              className="text-sm text-coral-600 hover:text-coral-700 font-medium flex items-center gap-1"
            >
              Open in New Tab
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
