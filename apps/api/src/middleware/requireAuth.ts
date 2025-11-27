import { supabase } from "../lib/supabase.js";

export const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Validate the token using Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach the user object to request
    req.user = data.user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
