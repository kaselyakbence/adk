// Chrome DevTools automatically probes this path to look for a workspace
// mapping file. We don't provide one - this just answers cleanly instead of
// falling through to the [[...slug]] catch-all, which errors under
// "output: export" because this path was never in its static param list.
export const dynamic = "force-static";

export function GET() {
  return new Response(null, { status: 404 });
}
