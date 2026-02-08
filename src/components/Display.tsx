import './Display.css'

interface DisplayProps {
  value: string
  expression?: string
}

export default function Display({ value, expression = '' }: DisplayProps) {
  return (
    <div className="display">
      <div className="display-expression">{expression}</div>
      <div className="display-value">{value}</div>
    </div>
  )
}
