

import Link from 'next/link';
import Image from 'next/image';

export default function Tile({
  label,
  description,
  href,
  external = false,
  img,
  buttonText,
  onClick,
  className = '',
  index,
  children,
}) {
  const base = `group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`.trim();
  const finalClass = /(^|\s)h-\d/.test(className) ? base : `${base} h-40`;

  return (
    <div className={finalClass}>
      {img && (
        <Image
          src={img}
          alt={label}
          fill
          className="object-cover"
          priority={index != null && index < 2}
        />
      )}
      {/* Frosted overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-[rgba(62,78,139,0.5)] transition-opacity group-hover:bg-[rgba(62,78,139,0.3)]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-4">
        <div>
          {label && <h3 className="text-lg font-semibold mb-1 text-white">{label}</h3>}
          {description && <p className="text-sm text-white/90 mb-2">{description}</p>}
          {children}
          {buttonText && (
            href ? (
              external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 rounded-md px-4 py-2 font-medium transition bg-[#fbb041] text-black hover:brightness-90"
                >
                  {buttonText}
                </a>
              ) : (
                <Link
                  href={href}
                  className="inline-block mt-2 rounded-md px-4 py-2 font-medium transition bg-[#fbb041] text-black hover:brightness-90"
                >
                  {buttonText}
                </Link>
              )
            ) : onClick ? (
              <button
                onClick={onClick}
                className="inline-block mt-2 rounded-md px-4 py-2 font-medium transition bg-[#fbb041] text-black hover:brightness-90"
              >
                {buttonText}
              </button>
            ) : null
          )}
        </div>
      </div>

      {/* Accent bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-transparent group-hover:bg-[#fbb041] transition-colors" />

      {/* Click-through layer if href provided and no explicit button */}
      {href && !buttonText && (
        external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
            aria-label={label}
          />
        ) : (
          <Link href={href} className="absolute inset-0" aria-label={label} />
        )
      )}
    </div>
  );
}