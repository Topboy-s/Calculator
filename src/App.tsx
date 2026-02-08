import { useState } from 'react'
import Display from './components/Display'
import Button from './components/Button'
import './App.css'

export default function App() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  const operators = ['+', '-', '×', '÷']
  const isOperator = (value: string) => operators.includes(value)

  const handleNumberClick = (num: string) => {
    if (newNumber) {
      const nextDisplay = num === '.' ? '0.' : num
      setDisplay(nextDisplay)
      setNewNumber(false)
      setExpression((prev) => {
        if (prev === '' || prev.endsWith('=')) return nextDisplay
        return `${prev}${nextDisplay}`
      })
    } else {
      // Prevent multiple decimal points
      if (num === '.' && display.includes('.')) return
      // Prevent leading zeros
      if (display === '0' && num !== '.') {
        setDisplay(num)
        setExpression((prev) => {
          if (prev.endsWith(display)) {
            return `${prev.slice(0, -display.length)}${num}`
          }
          return `${prev}${num}`
        })
      } else {
        const nextDisplay = display + num
        setDisplay(nextDisplay)
        setExpression((prev) => {
          if (prev.endsWith(display)) {
            return `${prev.slice(0, -display.length)}${nextDisplay}`
          }
          return `${prev}${num}`
        })
      }
    }
  }

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(formatResult(result))
      setPreviousValue(result)
    }

    setOperation(op)
    setNewNumber(true)
    setExpression((prev) => {
      if (prev === '' || prev.endsWith('=')) {
        return `${formatResult(currentValue)}${op}`
      }
      const lastChar = prev.slice(-1)
      if (isOperator(lastChar)) {
        return `${prev.slice(0, -1)}${op}`
      }
      return `${prev}${op}`
    })
  }

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '×':
        return prev * current
      case '÷':
        if (current === 0) {
          alert('Cannot divide by zero')
          return 0
        }
        return prev / current
      default:
        return current
    }
  }

  const formatResult = (num: number): string => {
    // Limit decimal places to avoid floating point errors
    return parseFloat(num.toPrecision(12)).toString()
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display)
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(formatResult(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
      setExpression((prev) => (prev === '' || prev.endsWith('=') ? prev : `${prev}=`))
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setExpression('')
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleDelete = () => {
    if (expression.endsWith('=')) {
      setExpression(display)
      return
    }

    if (display.length === 1) {
      setDisplay('0')
      setNewNumber(true)
      setExpression((prev) => {
        if (prev.endsWith(display)) {
          return `${prev.slice(0, -display.length)}0`
        }
        return prev.slice(0, -1)
      })
    } else {
      const nextDisplay = display.slice(0, -1)
      setDisplay(nextDisplay)
      setExpression((prev) => {
        if (prev.endsWith(display)) {
          return `${prev.slice(0, -display.length)}${nextDisplay}`
        }
        return prev.slice(0, -1)
      })
    }
  }

  const handleToggleSign = () => {
    const num = parseFloat(display)
    setDisplay((num * -1).toString())
  }

  const handlePercent = () => {
    const num = parseFloat(display)
    const nextDisplay = (num / 100).toString()
    setDisplay(nextDisplay)
    setExpression((prev) => {
      if (prev.endsWith(display)) {
        return `${prev.slice(0, -display.length)}${nextDisplay}`
      }
      return nextDisplay
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator">
        <Display value={display} expression={expression} />
        
        <div className="buttons-grid">
          {/* Row 1 - Actions */}
          <Button label="C" onClick={handleClear} variant="action" />
          <Button label="⌫" onClick={handleDelete} variant="action" />
          <Button label="%" onClick={handlePercent} variant="action" />
          <Button label="÷" onClick={() => handleOperation('÷')} variant="operator" />

          {/* Row 2 */}
          <Button label="7" onClick={() => handleNumberClick('7')} />
          <Button label="8" onClick={() => handleNumberClick('8')} />
          <Button label="9" onClick={() => handleNumberClick('9')} />
          <Button label="×" onClick={() => handleOperation('×')} variant="operator" />

          {/* Row 3 */}
          <Button label="4" onClick={() => handleNumberClick('4')} />
          <Button label="5" onClick={() => handleNumberClick('5')} />
          <Button label="6" onClick={() => handleNumberClick('6')} />
          <Button label="-" onClick={() => handleOperation('-')} variant="operator" />

          {/* Row 4 */}
          <Button label="1" onClick={() => handleNumberClick('1')} />
          <Button label="2" onClick={() => handleNumberClick('2')} />
          <Button label="3" onClick={() => handleNumberClick('3')} />
          <Button label="+" onClick={() => handleOperation('+')} variant="operator" />

          {/* Row 5 */}
          <Button label="0" onClick={() => handleNumberClick('0')} className="zero-button" />
          <Button label="." onClick={() => handleNumberClick('.')} />
          <Button label="=" onClick={handleEquals} variant="equals" />
        </div>
      </div>
    </div>
  )
}
