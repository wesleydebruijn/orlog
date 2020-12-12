import classNames from 'classnames'
import React from 'react'

type Props = {
  title: string
  children: React.ReactNode
  className?: string
}

export default function ContentBox({ title, children, className }: Props) {
  const classes = classNames('h-auto w-1/3 mobile:w-full', className)

  return (
    <div className={classes}>
      <div className="font-signika bg-primary rounded-t-md border-secondary border-b-2 px-6 py-4">
        <h1 className="text-orange text-base">{title}</h1>
      </div>
      <div className="h-auto bg-primary bg-opacity-70 flex flex-col justify-between">
        {children}
      </div>
    </div>
  )
}
