import { Link } from 'react-router-dom';

export const ManageVideos = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">
              Manage Videos
            </h1>
            <p className="text-gray-400">Upload and manage video content</p>
          </div>
          <Link to="/admin/dashboard" className="btn-gold-outline">
            Back to Dashboard
          </Link>
        </div>
        <div className="glass-strong p-12 rounded-lg text-center">
          <p className="text-gray-400">Video management interface</p>
        </div>
      </div>
    </div>
  );
};
