import classNames from 'classnames'
import React from 'react'

import './Diamond.scss'

export default function Diamond({
  className,
  width = 195,
  height = 80,
  children,
  border = 5,
  borderColor = '#e3e3e3'
}: {
  className?: string
  children?: React.ReactNode
  width?: number
  height?: number
  border?: number
  borderColor?: string
}) {
  const classes = classNames('diamond', className)
  const offset = -border

  return (
    <div
      className={classes}
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      <svg className="diamond__shape" viewBox={`${offset} ${offset} ${width} ${height}`}>
        <path
          d="M1740.937,532.544l-19.042,34.565,19.042,33.33h148.331l17.038-33.33-17.038-34.565Z"
          transform="translate(-1721.894 -532.544)"
          fill="currentColor"
          stroke={borderColor}
          strokeWidth={border}
        />
      </svg>
      <div className="diamond__content">{children}</div>
    </div>
  )
}
