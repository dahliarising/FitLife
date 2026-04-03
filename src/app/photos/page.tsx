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
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-primary">
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-2.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H19.5a.75.75 0 01-.75-.75V10.5z" clipRule="evenodd" />
              </svg>
            </div>
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
