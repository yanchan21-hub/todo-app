export async function GET() {
  console.log("cron動いた！");

  return Response.json({
    ok: true,
    message: "cron executed",
  });
}
