# Hono 3.0.0 Documentation

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

In Hono 3.0.0, middleware is created with the following pattern:

```js
const middleware = async (c, next) => {
  console.log('Before request')
  await next()
  console.log('After request')
}

app.use(middleware)
```
