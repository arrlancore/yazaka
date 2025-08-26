import { getAllCatatan } from '@/lib/catatan-hsi/content';
import { CatatanCard } from '@/components/catatan-hsi/CatatanCard';
import { BookOpen, Volume2 } from 'lucide-react';

export const metadata = {
  title: 'Catatan HSI - Study Notes with Audio Synchronization',
  description: 'Islamic study notes with synchronized audio transcription for immersive learning experience',
};

export default function CatatanHSIPage() {
  const catatanList = getAllCatatan();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Volume2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Catatan HSI
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Islamic study notes with synchronized audio transcription. 
              Follow along with audio lectures while reading synchronized text for 
              an immersive learning experience.
            </p>
          </div>
        </div>

        {/* Content */}
        {catatanList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Study Notes Available
            </h3>
            <p className="text-gray-600">
              Study notes with audio synchronization will appear here when available.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {catatanList.length}
                  </div>
                  <div className="text-sm text-gray-600">Study Sessions</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {catatanList.reduce((acc, catatan) => acc + Math.floor(catatan.metadata.duration / 60), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Minutes of Content</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(catatanList.map(c => c.metadata.series)).size}
                  </div>
                  <div className="text-sm text-gray-600">Series Available</div>
                </div>
              </div>
            </div>

            {/* Study Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catatanList.map((catatan) => (
                <CatatanCard key={catatan.slug} catatan={catatan} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}