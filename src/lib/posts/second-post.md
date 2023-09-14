---
title: Implementing the blog system.
description: Learn how to implement a blog system with Sveltekit, rendering markdown posts using mdsvex.
date: '2023-9-13'
categories:
  - sveltekit
  - svelte
  - mdsvex
published: true
---

# Building a Blog System with SvelteKit and mdsvex

Today, I made significant progress in implementing a blog system for my website. While the result isn't perfect yet, I'm excited about the progress I've made so far. In this post, I'll walk you through the steps I took to build this blog system using SvelteKit and mdsvex.

## Storing Blog Posts as Markdown

I decided to store my blog posts as Markdown files, which are a popular choice for content creation due to their simplicity and readability. To render these Markdown files, I chose mdsvex, a powerful Markdown processor for Svelte.

## Setting Up the API

One of the first tasks was to set up an API to serve my blog posts. I leveraged SvelteKit's built-in server template to create an API route:

```javascript
./src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit'
import type { Post } from '$lib/types'

async function getPosts() {
    // ... Code to fetch and process blog posts
}

export async function GET() {
    const posts = await getPosts()
    return json(posts)
}
```

In this code, I fetch and process my blog posts, ensuring they are sorted by date, and then serve them as JSON data through the API.

## Creating the Blog Page
With the API in place, I created a dedicated blog page:

```javascript
./src/routes/blog/+page.ts
import type { Post } from '$lib/types'

export async function load({ fetch }) {
    // ... Fetching and loading blog posts
}
```

This code fetches the blog posts using the API we set up earlier and loads them for rendering on the blog page.

## Generating Blog Post Links
In the corresponding Svelte component, I use the fetched data to generate links to individual blog posts. Here's a portion of the code:

```html
./src/routes/blog/+page.svelte
<section>
    <ul class="posts">
        {#each data.posts as post}
            <li class="post">
                <a href={post.slug} class="title dark:text-gray-500">{post.title}</a>
                <!-- ... Displaying post information -->
            </li>
        {/each}
    </ul>
</section>
```

This code dynamically generates links to individual blog posts based on the fetched data.

## Rendering Individual Blog Posts
When a user clicks on a blog post link, they are taken to an individual post page. The post slug in the URL is used to identify the specific post:

```javascript
./src/routes/[slug]/+page.ts
import { error } from '@sveltejs/kit'

export async function load({ params }) {
    try {
        const post = await import(`../../lib/posts/${params.slug}.md`)
        // ... Loading and rendering individual blog posts
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`)
    }
}
```

In this code, I load and render individual blog posts based on the provided slug from the URL.

## Rendering Blog Post Content
Finally, the blog post content is rendered using the Svelte component generated from the Markdown file:

```html
./src/routes/[slug]/+page.svelte
<!-- Post -->
<div class="prose dark:text-white">
    <svelte:component this={data.content} />
</div>
```

This allows me to dynamically generate a component from the Markdown content and render it on the individual blog post page.

## Conclusion
The markdown isn't rendering correctly at present, and I'm not sure why. I'll revisit this some other time, but something tells me it has something to do with an overriding CSS style somewhere. For now, I'd like to pivot to focus on the AI projects I originally created this site to talk about.