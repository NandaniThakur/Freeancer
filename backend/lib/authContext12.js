//CREATE AN AUTH BOUNDARY



export function setAuthContext(req, user) {
  req.auth = {
    userId: user._id.toString(),
    role: user.role,
  }
}
