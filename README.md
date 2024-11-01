# Kommentar

Kommentar is a lightweight application that allows you to add comments to your website with ease.

> 💡 Right now, Kommentar is only the API needed to make comments work. In the near future, I will be
> adding resources to even have an unstyled UI for the comments.

---

## Overview

The API exposes 4 simple endpoints:

- GET `/comments/:hostId` to get all comments for a _Host_
- POST `/comments/:hostId` to create a comment for a _Host_
- PUT `/comments/:id` to modify a comment
- DELETE `/comments/:id` to delete a comment

The API follows the Ports and Adapters pattern, along with Command-Query Responsibility segregation. It might seem overkill, but this helps in modifying the app to use whatever technologies you want with minimal effort.

## Core concepts

A **Host** is the parent of the comment. Consider these examples:

- On a blog site, each blog post is a Host
- On GitHub, a PR, issue, or Discussion can be Hosts
- On a site like Twitter (recently renamed to X), the post is a Host
- On YouTube, a video is the Host

Essentially, comments are scoped to a particular entity. This entity is what I prefer to call a _Host_.

A Host is identified by a unique identifier called the `hostId`. Following the same examples:

- On a blog site, the blog post's slug could be the `hostId`
- On GitHub, the PR number could be the `hostId`
- On Twitter, the post's ID could be the `hostId`
- On YouTube, the video's ID could be the `hostId`

Nothing crazy right?

A comment is nothing crazy either. It's defined as an object with some properties that allow you to manage them.

```js
{
  /**
   * Unique identifier of the comment
   */
  id: string;
  /**
   * Content of the comment
   */
  content: string;
  /**
   * Unique identifier of the host, where the comment is placed (e.g. post, video, etc.)
   */
  hostId: string;
  /**
   * Date when the comment was created
   */
  createdAt: Date;
  /**
   * Date when the comment was last updated
   */
  updatedAt: Date;
}
```

You can look at the actual definition [here](/src/app/domain/entities/comment.ts)

## Contributing

No guidelines yet since I'm still in the very early stages of development. Feel free to create an issue or open a Pull Request!

## Roadmap

- [ ] Ability to add name of a commenter (real or fake)
- [ ] Create guidelines on how to create adapters
- [ ] Implement rate limiting
- [ ] Web clients (components) with Vue, React, WebC, and any other as needed.
