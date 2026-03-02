import { Router } from 'express';
import { login, verifyToken } from './auth.js';
import * as db from './database.js';

const router = Router();

// ============================================
// AUTH ROUTES
// ============================================

router.post('/auth/login', (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = login(email, password);

    if (result.error) {
        return res.status(401).json({ error: result.error });
    }

    return res.json(result);
});

router.get('/auth/verify', (req, res) => {
    const { user, error } = verifyToken(req);

    if (error) {
        return res.status(401).json({ error, valid: false });
    }

    return res.json({ valid: true, user });
});

// ============================================
// AUTH MIDDLEWARE (for protected routes)
// ============================================

function requireAuth(req, res, next) {
    const { user, error } = verifyToken(req);
    if (error) {
        return res.status(401).json({ error });
    }
    req.user = user;
    next();
}

// ============================================
// CONFIG: UNIDADES
// ============================================

router.get('/config/unidades', (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            const unidade = db.getUnidadeById(id);
            if (!unidade) return res.status(404).json({ error: 'Unidade não encontrada' });
            return res.json(unidade);
        }
        return res.json(db.getAllUnidades());
    } catch (err) {
        console.error('Unidades GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/unidades', requireAuth, (req, res) => {
    try {
        const { id, nome, sigla } = req.body || {};
        if (!id || !nome || !sigla) {
            return res.status(400).json({ error: 'ID, nome e sigla são obrigatórios' });
        }
        const created = db.createUnidade({ id, nome, sigla });
        return res.status(201).json(created);
    } catch (err) {
        console.error('Unidades POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.put('/config/unidades', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        const updated = db.updateUnidade(id, req.body || {});
        return res.json(updated);
    } catch (err) {
        console.error('Unidades PUT error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/unidades', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        db.deleteUnidade(id);
        return res.json({ success: true, message: 'Unidade removida' });
    } catch (err) {
        console.error('Unidades DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// ============================================
// CONFIG: RESPONSÁVEIS
// ============================================

router.get('/config/responsaveis', (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            const resp = db.getResponsavelById(id);
            if (!resp) return res.status(404).json({ error: 'Responsável não encontrado' });
            return res.json(resp);
        }
        return res.json(db.getAllResponsaveis());
    } catch (err) {
        console.error('Responsaveis GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/responsaveis', requireAuth, (req, res) => {
    try {
        const { id, nome } = req.body || {};
        if (!id || !nome) {
            return res.status(400).json({ error: 'ID e nome são obrigatórios' });
        }
        const created = db.createResponsavel({ id, nome });
        return res.status(201).json(created);
    } catch (err) {
        console.error('Responsaveis POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.put('/config/responsaveis', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        const updated = db.updateResponsavel(id, req.body || {});
        return res.json(updated);
    } catch (err) {
        console.error('Responsaveis PUT error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/responsaveis', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        db.deleteResponsavel(id);
        return res.json({ success: true, message: 'Responsável removido' });
    } catch (err) {
        console.error('Responsaveis DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// ============================================
// CONFIG: TÉCNICOS
// ============================================

router.get('/config/tecnicos', (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            const tec = db.getTecnicoById(Number(id));
            if (!tec) return res.status(404).json({ error: 'Técnico não encontrado' });
            return res.json(tec);
        }
        return res.json(db.getAllTecnicos());
    } catch (err) {
        console.error('Tecnicos GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/tecnicos', requireAuth, (req, res) => {
    try {
        const { nome } = req.body || {};
        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }
        const created = db.createTecnico(req.body);
        return res.status(201).json(created);
    } catch (err) {
        console.error('Tecnicos POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.put('/config/tecnicos', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        const updated = db.updateTecnico(Number(id), req.body || {});
        return res.json(updated);
    } catch (err) {
        console.error('Tecnicos PUT error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/tecnicos', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        db.deleteTecnico(Number(id));
        return res.json({ success: true, message: 'Técnico removido' });
    } catch (err) {
        console.error('Tecnicos DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// ============================================
// CONFIG: TIPOS CHECKLIST
// ============================================

router.get('/config/tipos', (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            const tipo = db.getTipoById(id);
            if (!tipo) return res.status(404).json({ error: 'Tipo não encontrado' });
            return res.json(tipo);
        }
        return res.json(db.getAllTipos());
    } catch (err) {
        console.error('Tipos GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/tipos', requireAuth, (req, res) => {
    try {
        const { id, nome } = req.body || {};
        if (!id || !nome) {
            return res.status(400).json({ error: 'ID e nome são obrigatórios' });
        }
        const created = db.createTipo({ id, nome });
        return res.status(201).json(created);
    } catch (err) {
        console.error('Tipos POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.put('/config/tipos', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        const updated = db.updateTipo(id, req.body || {});
        return res.json(updated);
    } catch (err) {
        console.error('Tipos PUT error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/tipos', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        db.deleteTipo(id);
        return res.json({ success: true, message: 'Tipo removido' });
    } catch (err) {
        console.error('Tipos DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// ============================================
// CONFIG: LOCAIS
// ============================================

router.get('/config/locais', (req, res) => {
    try {
        const { id, tipo, unidade } = req.query;

        // Se tem unidade, buscar locais associados
        if (unidade) {
            const locais = db.getLocaisByUnidade(unidade, tipo);
            return res.json(locais);
        }

        if (id) {
            const local = db.getLocalById(Number(id));
            if (!local) return res.status(404).json({ error: 'Local não encontrado' });
            return res.json(local);
        }

        return res.json(db.getAllLocais(tipo));
    } catch (err) {
        console.error('Locais GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/locais', requireAuth, (req, res) => {
    try {
        const { tipo_checklist_id, setor, local } = req.body || {};
        if (!tipo_checklist_id || !setor || !local) {
            return res.status(400).json({ error: 'Tipo, setor e local são obrigatórios' });
        }
        const created = db.createLocal(req.body);
        return res.status(201).json(created);
    } catch (err) {
        console.error('Locais POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.put('/config/locais', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        const updated = db.updateLocal(Number(id), req.body || {});
        return res.json(updated);
    } catch (err) {
        console.error('Locais PUT error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/locais', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        db.deleteLocal(Number(id));
        return res.json({ success: true, message: 'Local removido' });
    } catch (err) {
        console.error('Locais DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// ============================================
// CONFIG: ITENS
// ============================================

router.get('/config/itens', (req, res) => {
    try {
        const { id, tipo } = req.query;
        if (id) {
            const item = db.getItemById(Number(id));
            if (!item) return res.status(404).json({ error: 'Item não encontrado' });
            return res.json(item);
        }
        return res.json(db.getAllItens(tipo));
    } catch (err) {
        console.error('Itens GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/itens', requireAuth, (req, res) => {
    try {
        const { tipo_checklist_id, label, name } = req.body || {};
        if (!tipo_checklist_id || !label || !name) {
            return res.status(400).json({ error: 'Tipo, label e name são obrigatórios' });
        }
        const created = db.createItem(req.body);
        return res.status(201).json(created);
    } catch (err) {
        console.error('Itens POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.put('/config/itens', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        const updated = db.updateItem(Number(id), req.body || {});
        return res.json(updated);
    } catch (err) {
        console.error('Itens PUT error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/itens', requireAuth, (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
        db.deleteItem(Number(id));
        return res.json({ success: true, message: 'Item removido' });
    } catch (err) {
        console.error('Itens DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// ============================================
// CONFIG: UNIDADE-LOCAIS
// ============================================

router.get('/config/unidade-locais', (req, res) => {
    try {
        const unidade = req.query.unidade;
        if (!unidade) {
            return res.status(400).json({ error: 'unidade é obrigatório' });
        }
        return res.json(db.getUnidadeLocais(unidade));
    } catch (err) {
        console.error('UnidadeLocais GET error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/config/unidade-locais', requireAuth, (req, res) => {
    try {
        const { unidade_id, local_ids } = req.body || {};
        if (!unidade_id || !local_ids || !Array.isArray(local_ids)) {
            return res.status(400).json({ error: 'unidade_id e local_ids são obrigatórios' });
        }
        db.setUnidadeLocais(unidade_id, local_ids);
        return res.json({ success: true, message: 'Locais associados com sucesso' });
    } catch (err) {
        console.error('UnidadeLocais POST error:', err);
        return res.status(400).json({ error: err.message });
    }
});

router.delete('/config/unidade-locais', requireAuth, (req, res) => {
    try {
        const { unidade, local } = req.query;
        if (!unidade || !local) {
            return res.status(400).json({ error: 'unidade e local são obrigatórios' });
        }
        db.deleteUnidadeLocal(unidade, Number(local));
        return res.json({ success: true, message: 'Associação removida' });
    } catch (err) {
        console.error('UnidadeLocais DELETE error:', err);
        return res.status(400).json({ error: err.message });
    }
});

export default router;
