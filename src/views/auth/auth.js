import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Extrae el token tras "Bearer"

    if (!token) return res.status(401).json({ error: "No autenticado" });

    try {
        const decodificado = jwt.verify(token, SECRET);
        req.user = decodificado;
        next();
    } catch (err) {
        res.status(403).json({ error: "Token inválido" });
    }
};
