const db = require('../db')

module.exports = {

    getAll: async (req, res) => res.json(await db.getAll()),

    get: async (req, res) => res.json(await db.get(req.params.id)),

    post: async (req, res) => res.json(await db.post(req.body)),

    put: async (req, res) => res.json(await db.put(req.params.id, req.body)),

    delete: async (req, res) => res.json(await db.delete(req.params.id))

}
