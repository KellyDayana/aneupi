import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL

const DEFAULT_PREFERENCES = {
  userRole: null,
  language: "es",
  pinnedFeatured: false,
  commentsCollapsed: false,
  tvLiveTermsAccepted: false,
}

const preferenceStore = new Map<string, any>(Object.entries(DEFAULT_PREFERENCES))

function buildPreferencesResponse() {
  return {
    preferences: Object.fromEntries(preferenceStore),
  }
}

async function proxyToBackend(request: NextRequest) {
  if (!BACKEND_API_URL) {
    return null
  }

  const url = new URL(request.url)
  const backendUrl = `${BACKEND_API_URL}/api/user/preferences`
  const backendRequest = new Request(backendUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  })

  return fetch(backendRequest)
}

export async function GET(request: NextRequest) {
  if (BACKEND_API_URL) {
    const backendResponse = await proxyToBackend(request)
    if (backendResponse) {
      return NextResponse.json(await backendResponse.json(), {
        status: backendResponse.status,
      })
    }
  }

  return NextResponse.json(buildPreferencesResponse())
}

export async function PUT(request: NextRequest) {
  const requestBody = await request.json().catch(() => null)

  if (BACKEND_API_URL) {
    const backendResponse = await proxyToBackend(request)
    if (backendResponse) {
      return NextResponse.json(await backendResponse.json(), {
        status: backendResponse.status,
      })
    }
  }

  if (!requestBody || typeof requestBody !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const validKeys = [
    "userRole",
    "language",
    "pinnedFeatured",
    "commentsCollapsed",
    "tvLiveTermsAccepted",
  ]

  Object.entries(requestBody).forEach(([key, value]) => {
    if (validKeys.includes(key)) {
      preferenceStore.set(key, value)
    }
  })

  return NextResponse.json({ success: true })
}
