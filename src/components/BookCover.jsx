import { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants/bookConstants';

/**
 * 3B ciltli kitap kapağı: görsel yüklenene kadar veya yüklenemediğinde
 * pirinç çerçeveli editoryal tipografik cilt arka katmanda görünür.
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
      : size === 'xl'
      ? 'w-32 h-48'
      : 'w-16 h-24';

  const shouldTryImage = Boolean(book?.coverUrl) && !imgFailed;

  return (
    <div
      style={{ backgroundColor: categoryMeta.coverBg }}
      className={`${sizeClass} book-3d shrink-0 rounded-l-[3px] rounded-r-md overflow-hidden border border-black/25 p-2 flex flex-col justify-between text-[#F8EFE0] select-none relative`}
    >
      {/* Sol cilt sırtı oluğu */}
      <div
        className="absolute inset-y-0 left-0 w-2 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(255,255,255,0.12) 55%, rgba(0,0,0,0.22) 100%)',
        }}
      />

      {/* İnce pirinç çerçeve detayı */}
      <div className="absolute inset-1.5 left-2.5 border border-[#D8B46A]/35 rounded-xs pointer-events-none" />

      <span className="font-mono text-[8px] uppercase tracking-wider text-[#E9D4AA] pl-1.5 truncate relative z-0">
        {categoryMeta.label.split(' ')[0]}
      </span>
      <div className="font-display text-[11px] leading-tight font-semibold line-clamp-3 pl-1.5 relative z-0">
        {book?.title}
      </div>
      <div className="text-[8px] text-[#E9D4AA]/90 truncate pl-1.5 border-t border-[#D8B46A]/30 pt-1 relative z-0">
        {book?.author}
      </div>

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
