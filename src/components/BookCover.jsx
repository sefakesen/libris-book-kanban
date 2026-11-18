import { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants/bookConstants';

/**
 * Kitap kapağını gösterir; görsel yüklenene kadar veya URL geçersiz/1x1 boş görsel döndüğünde
 * editoryal ciltli tipografik kitap kapağı arka katmanda kesintisiz görünür.
 */
export default function BookCover({ book, size = 'md' }) {
  const [imgReady, setImgReady] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgReady(false);
    setImgFailed(false);
  }, [book?.coverUrl]);

  const categoryMeta = CATEGORIES[book?.category] || CATEGORIES.literature;
  const sizeClass =
    size === 'sm'
      ? 'w-12 h-18'
      : size === 'lg'
      ? 'w-28 h-42'
      : 'w-16 h-24';

  const shouldTryImage = Boolean(book?.coverUrl) && !imgFailed;

  return (
    <div
      style={{ backgroundColor: categoryMeta.coverBg }}
      className={`${sizeClass} shrink-0 rounded-md overflow-hidden border border-black/15 shadow-xs p-2 flex flex-col justify-between text-white select-none relative`}
    >
      {/* Tipografik Ciltli Kapak (Her zaman altta hazır, görsel yüklenemezse görünür) */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/25 pointer-events-none" />
      <span className="font-mono text-[8px] uppercase tracking-wider opacity-80 pl-1 truncate">
        {categoryMeta.label.split(' ')[0]}
      </span>
      <div className="font-serif text-[10px] leading-tight font-medium line-clamp-3 pl-1">
        {book?.title}
      </div>
      <div className="text-[8px] opacity-85 truncate pl-1 border-t border-white/20 pt-1">
        {book?.author}
      </div>

      {/* Gerçek Kapak Görseli (Başarıyla yüklenip 2px'den büyükse üste çıkar) */}
      {shouldTryImage && (
        <img
          src={book.coverUrl}
          alt={`${book.title} kapağı`}
          onError={() => {
            setImgFailed(true);
            setImgReady(false);
          }}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth <= 2 || e.currentTarget.naturalHeight <= 2) {
              setImgFailed(true);
              setImgReady(false);
            } else {
              setImgReady(true);
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            imgReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
