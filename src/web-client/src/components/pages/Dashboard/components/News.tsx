import React from 'react'
import { PromiseFn, useAsync } from 'react-async'
import AsyncContent from '../../../shared/AsyncContent'

import ContentBox from '../../../shared/ContentBox'

type Props = {
  className?: string
}

export default function News({ className }: Props) {
  const state = useAsync(fetchNews)

  return (
    <ContentBox title="News" className={className}>
      <AsyncContent state={state}>
        {articles =>
          articles.map(({ title, content, author, timestamp }) => (
            <article className="flex flex-col justify-between py-4 px-6 mb-2">
              <b className="text-orange text-sm">{title}</b>
              <p className="text-text text-sm py-4">{content}</p>
              <div className="text-orange text-xs flex justify-between">
                <span>by {author}</span>
                <span>{timestamp}</span>
              </div>
            </article>
          ))
        }
      </AsyncContent>
    </ContentBox>
  )
}

type NewsArticle = {
  title: string
  content: string
  author: string
  timestamp: string
}

const fetchNews: PromiseFn<NewsArticle[]> = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/news`)
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}
