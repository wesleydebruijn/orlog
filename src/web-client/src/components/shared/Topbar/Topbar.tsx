import classNames from 'classnames'
import './Topbar.scss'

type Props = {
  title: string
  variant?: 'default' | 'game'
}

export default function Topbar({ title, variant = 'default' }: Props) {
  const classes = classNames('topbar', {
    'topbar--game': variant === 'game'
  })
  return (
    <section className={classes}>
      <div className="topbar__center">
        <span>{title}</span>
      </div>
    </section>
  )
}
