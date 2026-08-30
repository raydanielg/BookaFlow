export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const BACKEND_URL = "http://178.104.240.146:4000/api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = new URL(request.url)
  const targetUrl = `${BACKEND_URL}/${path.join("/")}${url.search}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader) headers["Authorization"] = authHeader

  const businessId = request.headers.get("x-business-id")
  if (businessId) headers["x-business-id"] = businessId

  try {
    const res = await fetch(targetUrl, { headers })
    const data = await res.text()
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Backend unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const targetUrl = `${BACKEND_URL}/${path.join("/")}`

  const contentType = request.headers.get("content-type") || ""

  // For multipart/form-data (file uploads), pass through the body as-is
  if (contentType.includes("multipart/form-data")) {
    const headers: Record<string, string> = {
      "Content-Type": contentType,
    }
    const authHeader = request.headers.get("authorization")
    if (authHeader) headers["Authorization"] = authHeader
    const businessId = request.headers.get("x-business-id")
    if (businessId) headers["x-business-id"] = businessId

    const body = await request.arrayBuffer()
    try {
      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body,
      })
      const data = await res.text()
      return new Response(data, {
        status: res.status,
        headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
      })
    } catch {
      return new Response(JSON.stringify({ error: "Backend unreachable" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // Regular JSON requests
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader) headers["Authorization"] = authHeader

  const businessId = request.headers.get("x-business-id")
  if (businessId) headers["x-business-id"] = businessId

  const body = await request.text()

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
    })
    const data = await res.text()
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Backend unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const targetUrl = `${BACKEND_URL}/${path.join("/")}`

  const contentType = request.headers.get("content-type") || ""

  // For multipart/form-data (file uploads), pass through the body as-is
  if (contentType.includes("multipart/form-data")) {
    const headers: Record<string, string> = {
      "Content-Type": contentType,
    }
    const authHeader = request.headers.get("authorization")
    if (authHeader) headers["Authorization"] = authHeader
    const businessId = request.headers.get("x-business-id")
    if (businessId) headers["x-business-id"] = businessId

    const body = await request.arrayBuffer()
    try {
      const res = await fetch(targetUrl, {
        method: "PUT",
        headers,
        body,
      })
      const data = await res.text()
      return new Response(data, {
        status: res.status,
        headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
      })
    } catch {
      return new Response(JSON.stringify({ error: "Backend unreachable" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // Regular JSON requests
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader) headers["Authorization"] = authHeader

  const businessId = request.headers.get("x-business-id")
  if (businessId) headers["x-business-id"] = businessId

  const body = await request.text()

  try {
    const res = await fetch(targetUrl, {
      method: "PUT",
      headers,
      body,
    })
    const data = await res.text()
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Backend unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const targetUrl = `${BACKEND_URL}/${path.join("/")}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader) headers["Authorization"] = authHeader

  const businessId = request.headers.get("x-business-id")
  if (businessId) headers["x-business-id"] = businessId

  try {
    const res = await fetch(targetUrl, {
      method: "DELETE",
      headers,
    })
    const data = await res.text()
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Backend unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }
}
