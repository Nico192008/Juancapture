import { Link } from 'react-router-dom';

export const ManageTestimonials = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-playfair font-bold text-white mb-2">
              Manage Testimonials
            </h1>
            <p className="text-gray-400">Add and manage client testimonials</p>
          </div>
          <Link to="/admin/dashboard" className="btn-gold-outline">
            Back to Dashboard
          </Link>
        </div>
        <div className="glass-strong p-12 rounded-lg text-center">
          <p className="text-gray-400">Testimonials management interface</p>
        </div>
      </div>
    </div>
  );
};
