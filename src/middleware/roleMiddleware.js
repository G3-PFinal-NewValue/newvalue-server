const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Verifica que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Si no se define rol en el token, se deniega
    const userRole = req.user.role;
    if (!userRole) {
      return res.status(403).json({ message: 'No autorizado: sin rol asignado' });
    }
    // Comprueba si el rol del usuario está permitido
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
};

module.exports = roleMiddleware;