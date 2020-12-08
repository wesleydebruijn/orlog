import React from 'react'
import { PromiseFn, useAsync } from 'react-async'
import AsyncContent from '../../../../shared/AsyncContent'
import CategoryBox from '../../../../shared/ContentBox/ContentBox'

import './News.scss'

export default function News() {
  const state = useAsync(fetchNews)

  return (
    <section className="news">
      <CategoryBox title="News">
        <AsyncContent state={state}>
          {articles =>
            articles.map(({ title, content, author, timestamp }) => (
              <article className="news__article" key={title.split(' ').join('_')}>
                <h3 className="news__article__title">{title}</h3>
                <span className="news__article__text">{content}</span>
                <span className="news__article__meta">
                  <span>by {author}</span>
                  <span>{timestamp}</span>
                </span>
              </article>
            ))
          }
        </AsyncContent>
      </CategoryBox>
    </section>
  )
}

type NewsArticle = {
  title: string
  content: string
  author: string
  timestamp: string
}

const fetchNews: PromiseFn<NewsArticle[]> = async ({}, { signal }) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/news`, { signal })
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}
