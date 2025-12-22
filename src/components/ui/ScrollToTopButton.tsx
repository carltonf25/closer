'use client';

interface ScrollToTopButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollToTopButton({
  children,
  className = 'btn-primary btn-lg',
}: ScrollToTopButtonProps) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
