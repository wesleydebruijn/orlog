import classNames from 'classnames'
import React from 'react'

export default function Diamond({
  className,
  children
}: {
  className?: string
  children?: React.ReactNode
}) {
  const classes = classNames('absolute', className)
  return (
    <div className="relative w-58 h-full flex justify-center items-center">
      <svg className={classes} viewBox="-10 0 195 68">
        <path
          d="M1740.937,532.544l-19.042,34.565,19.042,33.33h148.331l17.038-33.33-17.038-34.565Z"
          transform="translate(-1721.894 -532.544)"
          fill="currentColor"
          stroke="#e3e3e3"
          strokeWidth={5}
        />
      </svg>
      <div className="ml-5 z-10">{children}</div>
    </div>
  )
}
