export interface BodyPhoto {
  id: string;
  date: string;
  dataUrl: string; // base64
  notes: string;
}

const STORAGE_KEY = 'fitlife_photos';

export function getPhotos(): BodyPhoto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addPhoto(photo: Omit<BodyPhoto, 'id'>): BodyPhoto {
  const photos = getPhotos();
  const newPhoto: BodyPhoto = { ...photo, id: `photo-${Date.now()}` };
  photos.unshift(newPhoto);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); } catch {}
  return newPhoto;
}

export function deletePhoto(id: string): void {
  const photos = getPhotos().filter(p => p.id !== id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); } catch {}
}

/** 파일을 base64 DataURL로 변환 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** 이미지를 리사이즈 (max 800px) */
export function resizeImage(dataUrl: string, maxSize: number = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  });
}
