export function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const h = req.headers.get("x-test-now-ms");
    if (h) return new Date(Number(h));
  }
  return new Date();
}
