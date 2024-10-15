const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || ""
    : window.location.origin;


export async function callApi<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: object,
    headers?: HeadersInit,
    timeout = 5000
): Promise<T> {
    const controller = new AbortController();
    const signalTimeout = setTimeout(() => controller.abort(), timeout);

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        signal: controller.signal,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }
    console.log(`${BASE_URL}/${url}`);
    const response = await fetch(`${BASE_URL}/${url}`, options);

    clearTimeout(signalTimeout);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    if (response.status === 204) return response.statusText as string as T;
    return await response.json();
}