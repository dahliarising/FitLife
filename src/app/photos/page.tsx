'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { getPhotos, addPhoto, deletePhoto, fileToDataUrl, resizeImage, BodyPhoto } from '@/lib/photo-timeline';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<BodyPhoto[]>(() => getPhotos());
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const dataUrl = await fileToDataUrl(file);
    const resized = await resizeImage(dataUrl);
    const photo = addPhoto({
      date: new Date().toISOString().split('T')[0],
      dataUrl: resized,
      notes: '',
    });
    setPhotos(prev => [photo, ...prev]);
  };

  const handleDelete = (id: string) => {
    deletePhoto(id);
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <Header title="바디 프로필" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />

        <Button variant="primary" fullWidth onClick={() => fileRef.current?.click()}>
          사진 촬영 / 업로드
        </Button>

        {photos.length === 0 && (
          <Card className="text-center py-12">
            <span className="text-4xl mb-4 block">📸</span>
            <p className="text-sm text-muted">바디 프로필 사진으로 변화를 기록하세요</p>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="relative rounded-xl overflow-hidden border border-border">
              <img src={photo.dataUrl} alt={photo.date} className="w-full aspect-[3/4] object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs text-white font-medium">{photo.date}</p>
              </div>
              <button onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
