'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { motion } from 'framer-motion'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'

export default function PostPage({ params }) {
  const { slug } = params
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const STRAPI_BASE_URL = 'http://139.59.64.136:54321'

  useEffect(() => {
    async function fetchPost() {
      try {
        const apiUrl = `http://139.59.64.136:54321/api/posts?filters[slug][$eq]=${slug}` +
                       `&populate[category][fields][0]=name` +
                       `&populate[author][fields][0]=name&populate[author][fields][1]=role` +
                       `&populate[cover][fields][0]=url`
        const res = await fetch(apiUrl)
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`)
        }
        const json = await res.json()
        if (json.data && json.data.length > 0) {
          const item = json.data[0]
          const blocks = item?.content || []
          const rawDate = item?.date
          const formattedDate = rawDate
            ? new Date(rawDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''

          setPost({
            id: item.id,
            title: item.title || 'No Title',
            date: formattedDate,
            readtime: item.readtime || 'N/A',
            content: blocks,
            category: item?.category?.name || 'Uncategorized',
            authorName: item?.author?.name || 'Unknown Author',
            authorRole: item?.author?.role || '',
            coverUrl: item?.cover?.url || null,
          })
          setError(null)
        } else {
          setPost(null)
          setError('Post not found.')
        }
      } catch (err) {
        setError(`Failed to load post: ${err.message || 'Unknown error'}`)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20">
        <p className="text-center text-gray-500 animate-pulse">Loading post...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20">
        <p className="text-center text-red-600 font-medium">{error}</p>
        <Link
          href="/blog"
          className="block text-center mt-6 text-gray-600 hover:text-brand-secondary transition-colors"
        >
          ← Back to Blogs
        </Link>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20">
        <p className="text-center text-gray-500">Post not found.</p>
        <Link
          href="/blog"
          className="block text-center mt-6 text-gray-600 hover:text-brand-secondary transition-colors"
        >
          ← Back to Blogs
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <Link
        href="/blog"
        className="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-brand-secondary transition-colors"
      >
        ← Back to main page
      </Link>
      <Section>
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          {/* Cover Image */}
          {post.coverUrl && (
            <div className="w-full h-72 sm:h-96 overflow-hidden">
              <img
                src={`${STRAPI_BASE_URL}${post.coverUrl}`}
                alt={post.title || 'Post Cover'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="px-6 sm:px-10 py-8">
            <h1 className="text-4xl font-bold leading-tight mb-3 text-gray-900">
              {post.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {post.date} · {post.readtime} read · {post.category}
            </p>

            <div className="prose max-w-none prose-lg prose-gray">
              {post.content && post.content.length > 0 ? (
                <BlocksRenderer content={post.content} />
              ) : (
                <p>No content available.</p>
              )}
            </div>

            {/* Author */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                About the Author
              </h3>
              <p className="text-gray-800 font-medium">{post.authorName}</p>
              {post.authorRole && (
                <p className="text-gray-500 text-sm">{post.authorRole}</p>
              )}
            </div>
          </div>
        </motion.article>
      </Section>
    </main>
  )
}
