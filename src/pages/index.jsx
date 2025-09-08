import React from "react"
import _ from "lodash"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import SEO from "components/SEO"
import Bio from "components/Bio"
import PostList from "components/PostList"
import SideTagList from "components/SideTagList"
import VerticalSpace from "components/VerticalSpace"
import Tab from "components/Tab"

import { title, description, siteUrl, useSeries } from "../../blog-config"

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const tags = _.sortBy(data.allMarkdownRemark.group, ["totalCount"]).reverse()
  
  // 시리즈 개수 계산 - 시리즈가 있는 포스트들을 그룹화하여 개수 계산
  const seriesCount = useSeries ? (() => {
    const postsWithSeries = posts.filter(post => post.frontmatter.series)
    const uniqueSeries = new Set(postsWithSeries.map(post => post.frontmatter.series))
    return uniqueSeries.size
  })() : 0

  if (posts.length === 0) {
    return (
      <p>
        No blog posts found. Add markdown posts to &quot;content/blog&quot; (or
        the directory you specified for the &quot;gatsby-source-filesystem&quot;
        plugin in gatsby-config.js).
      </p>
    )
  }

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />
      <VerticalSpace size={48} />
      <Bio />
      <Tab postsCount={posts.length} seriesCount={seriesCount} activeTab="posts" />
      <SideTagList tags={tags} postCount={posts.length} />
      <PostList postList={posts} />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/contents/posts/" } }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          update(formatString: "MMM DD, YYYY")
          title
          tags
          series
        }
      }
    }
  }
`
