# Hono 4.0.0 Documentation

Hono is a small, simple, and ultrafast web framework for the Edges.

## Creating an App

```js
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

// For Deno
Deno.serve(app.fetch)
```

## Middleware

In Hono 4.0.0, middleware can be created with the new middleware API:

```js
import { createMiddleware } from 'hono/middleware'

const middleware = createMiddleware(async (c, next) => {
  console.log('Before request')
  await next()
  console.log('After request')
})

app.use(middleware)
```
