function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

export default {
  async fetch(req, env) {
    const { method } = req
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop()
    const db = env.DB

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      })
    }

    try {
      if (method === "GET") {
        const { results } = await db.prepare("SELECT * FROM items").all()
        return Response.json(results, { headers: corsHeaders() })
      }

      if (method === "POST") {
        const { name } = await req.json()
        await db.prepare("INSERT INTO items (name) VALUES (?)").bind(name).run()
        return new Response("Created", { status: 201, headers: corsHeaders() })
      }

      if (method === "PUT") {
        const { name } = await req.json()
        await db.prepare("UPDATE items SET name = ? WHERE id = ?").bind(name, id).run()
        return new Response("Updated", { status: 200, headers: corsHeaders() })
      }

      if (method === "DELETE") {
        await db.prepare("DELETE FROM items WHERE id = ?").bind(id).run()
        return new Response("Deleted", { status: 200, headers: corsHeaders() })
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders() })
    } catch (e) {
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders(),
      })
    }
  },
}
