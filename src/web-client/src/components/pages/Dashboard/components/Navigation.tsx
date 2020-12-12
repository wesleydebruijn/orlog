import React, { useState } from 'react'

type Props = {
  items: NavigationItemProps[]
}

export default function Navigation({ items }: Props) {
  const [menu, toggleMenu] = useState(false)

  return (
    <nav className="h-full flex items-center">
      <div className="mobile:hidden h-full flex items-center space-x-10">
        {items.map(item => (
          <NavigationItem key={item.text} icon={item.icon} text={item.text} />
        ))}
      </div>
      <div
        className="hidden mobile:flex justify-between flex-col mr-5 h-1/5 cursor-pointer"
        onClick={() => toggleMenu(!menu)}
      >
        <span className="bg-white w-5 h-0.5"></span>
        <span className="bg-white w-5 h-0.5"></span>
        <span className="bg-white w-5 h-0.5"></span>
      </div>
      {menu && (
        <div className="hidden mobile:flex absolute top-28 right-0 mr-5 h-auto w-44 bg-primary rounded box-border py-1 px-2 z-10">
          <ul className="w-full">
            {items.map(item => (
              <NavigationItem key={item.text} icon={item.icon} text={item.text} />
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

type NavigationItemProps = {
  icon: string
  text: string
}

export function NavigationItem({ icon, text }: NavigationItemProps) {
  return (
    <div className="flex flex-col mobile:flex-row mobile:p-2 mobile:w-full justify-between mobile:h-14 h-3/5 items-center cursor-pointer">
      <div className="w-full mobile:w-8 mobile:mr-5 h-4/5 flex justify-center items-center">
        <img src={icon} width="30" height="30" className="fill-current text-white" />
      </div>
      <span className="text-orange text-xs mobile:flex-grow">{text}</span>
    </div>
  )
}
