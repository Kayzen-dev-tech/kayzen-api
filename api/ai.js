export default function(req, res) {
  res.json({
    ai: [
      "chat-ai",
      "text-to-image",
      "remove-background",
      "image-enhancer",
      "ai-music"
    ]
  })
}
