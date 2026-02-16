const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Importamos tu servidor

// Variables globales para las pruebas
let tokenAdmin = '';
let productoId = '';

describe('🧪 Pruebas Unitarias: API de Inventario Tesla', () => {
    
    // 1. Antes de probar, necesitamos loguearnos para obtener un Token
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                username: 'admin',
                password: '123'
            });
        tokenAdmin = res.body.token; // Guardamos el token
    });

    // 2. Al terminar todas las pruebas, cerramos la conexión a MongoDB
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // --- CASOS DE PRUEBA ---

    it('🛑 Debería denegar el acceso a GET /api/productos si no hay token', async () => {
        const res = await request(app).get('/api/productos');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Token requerido');
    });

    it('✅ Debería permitir leer el inventario a un Admin con token válido', async () => {
        const res = await request(app)
            .get('/api/productos')
            .set('Authorization', `Bearer ${tokenAdmin}`); // Enviamos el token
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy(); // Debe devolver un arreglo
    });

    it('✅ Debería crear un producto nuevo en MongoDB', async () => {
        const nuevoProducto = {
            nombre: 'Filtro HEPA de Prueba',
            sku: `TEST-${Date.now()}`, // SKU único
            categoria: 'Carrocería',
            stock: 10,
            precio: 150
        };

        const res = await request(app)
            .post('/api/productos')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(nuevoProducto);

        expect(res.statusCode).toBe(201);
        expect(res.body.nombre).toBe(nuevoProducto.nombre);
        
        productoId = res.body._id; // Guardamos el ID para borrarlo en la siguiente prueba
    });

    it('🗑️ Debería eliminar el producto de prueba para limpiar la BD', async () => {
        const res = await request(app)
            .delete(`/api/productos/${productoId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Producto eliminado correctamente del inventario');
    });
});