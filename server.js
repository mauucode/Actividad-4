require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// SERVIR ARCHIVOS DEL FRONTEND
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// ==========================================
// 1. CONEXIÓN A MONGODB ATLAS
// ==========================================
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🟢 Conectado exitosamente a MongoDB Atlas (Inventario Tesla)');
        await seedAdmin(); // Crea el admin por defecto si la base de datos está vacía
    })
    .catch(err => console.error('🔴 Error al conectar con MongoDB:', err));


// ==========================================
// 2. MODELOS DE BASE DE DATOS (MONGOOSE)
// ==========================================

// --- MODELO DE USUARIOS ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});
const User = mongoose.model('User', userSchema);

// --- MODELO DE PRODUCTOS ---
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    precio: { type: Number, required: true }
}, { timestamps: true });
const Producto = mongoose.model('Producto', productoSchema);


// ==========================================
// FUNCIÓN SEED: CREAR ADMIN POR DEFECTO
// ==========================================
const seedAdmin = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log('⚙️ Base de datos de usuarios vacía. Creando administrador por defecto...');
            const hashedPassword = await bcrypt.hash('123', 10);
            await User.create({
                name: 'Elon Musk',
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('👑 Admin creado con éxito -> Usuario: admin | Pass: 123');
        }
    } catch (error) {
        console.error('Error creando el admin por defecto:', error);
    }
};


// ==========================================
// 3. CONFIGURACIÓN LOCAL (SOLO PARA TAREAS) Y SEGURIDAD
// ==========================================
const TAREAS_FILE = path.join(__dirname, 'data', 'tareas.json');
const SECRET_KEY = process.env.SECRET_KEY || 'tesla_default_secret';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token requerido" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido o expirado" });
        req.user = user;
        next();
    });
};


// ==========================================
// 4. RUTAS DE AUTENTICACIÓN Y USUARIOS (AHORA EN MONGODB)
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Buscar usuario en MongoDB
        const user = await User.findOne({ username: username });
        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        // Generar Token (usamos user._id porque en Mongo los IDs llevan guion bajo)
        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token, role: user.role, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        
        // Verificar si ya existe en MongoDB
        const existingUser = await User.findOne({ username: username });
        if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

        // Encriptar y guardar en MongoDB
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, password: hashedPassword, role: role || 'user' });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito en MongoDB" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar en la base de datos" });
    }
});

app.get('/api/users', verificarToken, async (req, res) => {
    try {
        // Traer todos los usuarios de MongoDB, pero ocultar la contraseña (-password) por seguridad
        const users = await User.find({}, '-password'); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});


// ==========================================
// 5. RUTAS DE TAREAS (SE QUEDA EN JSON COMO RESPALDO)
// ==========================================
app.get('/api/tareas', verificarToken, async (req, res) => {
    try {
        const data = await fs.readFile(TAREAS_FILE, 'utf8');
        const tareas = JSON.parse(data || '[]');
        
        if (req.user.role === 'admin') {
            res.json(tareas);
        } else {
            const misTareas = tareas.filter(t => t.assignedTo === req.user.name);
            res.json(misTareas);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al leer tareas" });
    }
});

app.post('/api/tareas', verificarToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Acceso denegado" });

    try {
        const { title, assignedTo } = req.body;
        const data = await fs.readFile(TAREAS_FILE, 'utf8');
        const tareas = JSON.parse(data || '[]');

        const nuevaTarea = {
            id: Date.now(),
            title,
            createdAt: new Date().toLocaleDateString(),
            completedAt: null,
            assignedTo,
            createdBy: req.user.name,
            status: "Pendiente"
        };

        tareas.push(nuevaTarea);
        await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(500).json({ message: "Error al guardar la tarea" });
    }
});

app.put('/api/tareas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, title, assignedTo } = req.body;
        
        const data = await fs.readFile(TAREAS_FILE, 'utf8');
        let tareas = JSON.parse(data || '[]');

        const index = tareas.findIndex(t => t.id == id);
        if (index === -1) return res.status(404).json({ message: "Tarea no encontrada" });

        if (req.user.role !== 'admin' && tareas[index].assignedTo !== req.user.name) {
            return res.status(403).json({ message: "No puedes editar esta tarea" });
        }

        if (req.user.role === 'admin') {
            tareas[index].title = title || tareas[index].title;
            tareas[index].assignedTo = assignedTo || tareas[index].assignedTo;
        }

        if (status) {
            tareas[index].status = status;
            if (status === 'Completada') {
                tareas[index].completedAt = new Date().toLocaleDateString();
            } else {
                tareas[index].completedAt = null; 
            }
        }

        await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
        res.json(tareas[index]);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
});

app.delete('/api/tareas/:id', verificarToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Acceso denegado" });

    try {
        const { id } = req.params;
        const data = await fs.readFile(TAREAS_FILE, 'utf8');
        let tareas = JSON.parse(data || '[]');

        const index = tareas.findIndex(t => t.id == id);
        if (index === -1) return res.status(404).json({ message: "Tarea no encontrada" });

        tareas.splice(index, 1);
        await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
});


// ==========================================
// 6. RUTAS Y CONTROLADORES DE INVENTARIO (MONGODB)
// ==========================================
app.post('/api/productos', verificarToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Solo administradores." });
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save(); 
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: "Error al crear producto (Revisa si el SKU está duplicado)", error: error.message });
    }
});

app.get('/api/productos', verificarToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Acceso denegado." });
    try {
        const productos = await Producto.find(); 
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el inventario", error: error.message });
    }
});

app.put('/api/productos/:id', verificarToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Acceso denegado." });
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productoActualizado) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error: error.message });
    }
});

app.delete('/api/productos/:id', verificarToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Acceso denegado." });
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).json({ message: "Producto no encontrado" });
        res.json({ message: "Producto eliminado correctamente del inventario" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
});


// ==========================================
// 7. INICIO DEL SERVIDOR Y EXPORTACIÓN PARA PRUEBAS
// ==========================================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Tesla Server corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app; // Exportamos la app para que Jest pueda probarla

