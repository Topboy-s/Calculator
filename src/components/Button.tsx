import './Button.css'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'number' | 'operator' | 'action' | 'equals'
  className?: string
}

export default function Button({ label, onClick, variant = 'number', className = '' }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
