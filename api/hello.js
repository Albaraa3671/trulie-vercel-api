export default function handler(req, res) {
  res.status(200).json({
    message: "✅ Trulie API is running successfully.",
    endpoints: ["/api/check"],
  });
}
