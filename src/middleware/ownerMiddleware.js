
const ownershipMiddleware = (req, res, next) => {
    const user = req.user; 
    const resourceId = req.params.id ? parseInt(req.params.id) : user.id; 

    if (!user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    // Si es admin o dueño del recurso
    if (user.role === "admin" || user.id === resourceId) {
        return next();
    }

    return res.status(403).json({ message: "No tienes permiso para esta acción" });
};

export default ownershipMiddleware;
