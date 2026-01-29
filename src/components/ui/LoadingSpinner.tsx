'use client';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({ text, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClass = size === 'lg' ? 'loading-lg' : size === 'sm' ? 'loading-sm' : '';

  return (
    <div className="card bg-base-200 p-6">
      <div className="flex items-center gap-2">
        <span className={`loading loading-spinner ${sizeClass}`} />
        {text && <span>{text}</span>}
      </div>
    </div>
  );
};
