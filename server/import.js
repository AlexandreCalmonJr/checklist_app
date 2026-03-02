import { getDb } from './database.js';
import XLSX from 'xlsx';

/**
 * IMPORT MODULE - Importação de dados completos de hospital
 * Reconhece e importa: hospital, responsáveis, técnicos, tipos_checklist, locais
 */

/**
 * Generate hospital ID slug from name
 * "Hospital Teresa de Lisieux" → "hteresa"
 * "Hospital Francisca de Sande" → "hfrancisca"
 */
function generateHospitalSlug(nome) {
    const parts = nome.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .split(/\s+/);

    // Try to find the distinctive word (skip "hospital", "de", "do", "da", etc)
    const skipWords = ['hospital', 'de', 'do', 'da', 'dos', 'das', 'e', 'a', 'o'];
    const distinctive = parts.find(p => !skipWords.includes(p) && p.length > 2);

    if (distinctive) {
        return 'h' + distinctive;
    }
    // Fallback: first letters
    return parts.filter(p => !skipWords.includes(p)).map(p => p[0]).join('');
}

/**
 * Parse CSV content with sections (## HOSPITAL, ## RESPONSAVEIS, etc)
 */
export function parseCSV(content) {
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('##'));

    // Find section markers in original content
    const rawLines = content.split(/\r?\n/);
    const sections = {};
    let currentSection = null;

    for (const line of rawLines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('## HOSPITAL')) {
            currentSection = 'hospital';
            sections[currentSection] = [];
        } else if (trimmed.startsWith('## RESPONSAVEIS')) {
            currentSection = 'responsaveis';
            sections[currentSection] = [];
        } else if (trimmed.startsWith('## TECNICOS')) {
            currentSection = 'tecnicos';
            sections[currentSection] = [];
        } else if (trimmed.startsWith('## LOCAIS')) {
            currentSection = 'locais';
            sections[currentSection] = [];
        } else if (trimmed && !trimmed.startsWith('##') && currentSection) {
            sections[currentSection].push(trimmed);
        }
    }

    const result = {
        hospital: { nome: '', sigla: '' },
        responsaveis: [],
        tecnicos: [],
        tipos_checklist: [],
        locais: []
    };

    // Parse hospital
    if (sections.hospital && sections.hospital.length >= 2) {
        // Skip header row
        const dataLine = sections.hospital[1];
        const parts = dataLine.split(',').map(p => p.trim());
        result.hospital.nome = parts[0] || '';
        result.hospital.sigla = parts[1] || '';
    }

    // Parse responsaveis
    if (sections.responsaveis) {
        for (let i = 1; i < sections.responsaveis.length; i++) {
            const parts = sections.responsaveis[i].split(',').map(p => p.trim());
            if (parts[0] && parts[1]) {
                result.responsaveis.push({ id: parts[0], nome: parts[1] });
            }
        }
    }

    // Parse tecnicos
    if (sections.tecnicos) {
        for (let i = 1; i < sections.tecnicos.length; i++) {
            const nome = sections.tecnicos[i].trim();
            if (nome) result.tecnicos.push(nome);
        }
    }

    // Parse locais and auto-detect tipos
    const tiposSet = {};
    if (sections.locais) {
        for (let i = 1; i < sections.locais.length; i++) {
            const parts = sections.locais[i].split(',').map(p => p.trim());
            if (parts[0] && parts[1] && parts[2]) {
                const tipoId = parts[0];
                tiposSet[tipoId] = true;
                result.locais.push({
                    tipo_checklist: tipoId,
                    setor: parts[1],
                    local: parts[2],
                    responsavel: parts[3] || null
                });
            }
        }
    }

    // Auto-generate tipos from locais if not explicit
    const tipoNames = {
        centroCirurgico: 'Centro Cirúrgico',
        racks: 'Racks',
        emergencia: 'Emergência',
        totensepaineis: 'Totens e Painéis'
    };
    for (const tipoId of Object.keys(tiposSet)) {
        result.tipos_checklist.push({
            id: tipoId,
            nome: tipoNames[tipoId] || tipoId
        });
    }

    return result;
}

/**
 * Parse JSON content
 */
export function parseJSON(content) {
    const data = typeof content === 'string' ? JSON.parse(content) : content;

    const result = {
        hospital: {
            nome: data.hospital?.nome || '',
            sigla: data.hospital?.sigla || ''
        },
        responsaveis: data.responsaveis || [],
        tecnicos: Array.isArray(data.tecnicos)
            ? data.tecnicos.map(t => typeof t === 'string' ? t : t.nome)
            : [],
        tipos_checklist: data.tipos_checklist || [],
        locais: data.locais || []
    };

    // Auto-detect tipos from locais if not provided
    if (result.tipos_checklist.length === 0 && result.locais.length > 0) {
        const tipoNames = {
            centroCirurgico: 'Centro Cirúrgico',
            racks: 'Racks',
            emergencia: 'Emergência',
            totensepaineis: 'Totens e Painéis'
        };
        const tiposSet = new Set(result.locais.map(l => l.tipo_checklist));
        result.tipos_checklist = Array.from(tiposSet).map(id => ({
            id,
            nome: tipoNames[id] || id
        }));
    }

    return result;
}

/**
 * Parse Excel (.xlsx) content from base64
 */
export function parseExcel(base64Content) {
    const buffer = Buffer.from(base64Content, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const result = {
        hospital: { nome: '', sigla: '' },
        responsaveis: [],
        tecnicos: [],
        tipos_checklist: [],
        locais: []
    };

    // Read Hospital sheet
    const hospitalSheet = workbook.Sheets['Hospital'] || workbook.Sheets[workbook.SheetNames[0]];
    if (hospitalSheet) {
        const hospitalData = XLSX.utils.sheet_to_json(hospitalSheet);
        if (hospitalData[0]) {
            result.hospital.nome = hospitalData[0].nome || hospitalData[0].Nome || '';
            result.hospital.sigla = hospitalData[0].sigla || hospitalData[0].Sigla || '';
        }
    }

    // Read Responsáveis sheet
    const respSheet = workbook.Sheets['Responsaveis'] || workbook.Sheets['Responsáveis'];
    if (respSheet) {
        const respData = XLSX.utils.sheet_to_json(respSheet);
        result.responsaveis = respData.map(r => ({
            id: r.id || r.ID || '',
            nome: r.nome || r.Nome || ''
        })).filter(r => r.id && r.nome);
    }

    // Read Técnicos sheet
    const tecSheet = workbook.Sheets['Tecnicos'] || workbook.Sheets['Técnicos'];
    if (tecSheet) {
        const tecData = XLSX.utils.sheet_to_json(tecSheet);
        result.tecnicos = tecData.map(t => t.nome || t.Nome || '').filter(n => n);
    }

    // Read Locais sheet
    const locaisSheet = workbook.Sheets['Locais'];
    if (locaisSheet) {
        const locaisData = XLSX.utils.sheet_to_json(locaisSheet);
        const tiposSet = {};
        result.locais = locaisData.map(l => {
            const tipoId = l.tipo_checklist || l['Tipo Checklist'] || '';
            if (tipoId) tiposSet[tipoId] = true;
            return {
                tipo_checklist: tipoId,
                setor: l.setor || l.Setor || '',
                local: l.local || l.Local || '',
                responsavel: l.responsavel || l.Responsavel || l['Responsável'] || null
            };
        }).filter(l => l.tipo_checklist && l.setor && l.local);

        // Auto-generate tipos
        const tipoNames = {
            centroCirurgico: 'Centro Cirúrgico',
            racks: 'Racks',
            emergencia: 'Emergência',
            totensepaineis: 'Totens e Painéis'
        };
        for (const tipoId of Object.keys(tiposSet)) {
            result.tipos_checklist.push({
                id: tipoId,
                nome: tipoNames[tipoId] || tipoId
            });
        }
    }

    return result;
}

/**
 * Generate Excel template buffer
 */
export function generateExcelTemplate() {
    const wb = XLSX.utils.book_new();

    // Hospital sheet
    const hospitalData = [{ nome: 'Hospital Exemplo', sigla: 'HEX' }];
    const wsHospital = XLSX.utils.json_to_sheet(hospitalData);
    wsHospital['!cols'] = [{ wch: 30 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsHospital, 'Hospital');

    // Responsáveis sheet
    const respData = [
        { id: 'ATENDIMENTO', nome: 'Supervisão de Atendimento' },
        { id: 'ENFERMAGEM', nome: 'Enfermagem' },
        { id: 'TI', nome: 'TI' },
        { id: 'IMAGEM', nome: 'Vida e Imagem' },
        { id: 'FARMACIA', nome: 'Farmácia' }
    ];
    const wsResp = XLSX.utils.json_to_sheet(respData);
    wsResp['!cols'] = [{ wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsResp, 'Responsaveis');

    // Técnicos sheet
    const tecData = [
        { nome: 'João Silva' },
        { nome: 'Maria Santos' },
        { nome: 'Carlos Oliveira' }
    ];
    const wsTec = XLSX.utils.json_to_sheet(tecData);
    wsTec['!cols'] = [{ wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsTec, 'Tecnicos');

    // Locais sheet
    const locaisData = [
        { tipo_checklist: 'centroCirurgico', setor: 'Centro Cirúrgico', local: 'SALA 01', responsavel: 'ENFERMAGEM' },
        { tipo_checklist: 'centroCirurgico', setor: 'Centro Cirúrgico', local: 'SALA 02', responsavel: 'ENFERMAGEM' },
        { tipo_checklist: 'racks', setor: 'Racks', local: 'Rack Principal Terreo', responsavel: 'TI' },
        { tipo_checklist: 'racks', setor: 'Racks', local: 'Rack 1º Andar', responsavel: 'TI' },
        { tipo_checklist: 'emergencia', setor: 'Emergência Adulta', local: 'CONSULTÓRIO ADULTO 1', responsavel: 'ATENDIMENTO' },
        { tipo_checklist: 'emergencia', setor: 'Emergência Adulta', local: 'Farmácia ADT 01', responsavel: 'FARMACIA' },
        { tipo_checklist: 'totensepaineis', setor: 'TOTEM', local: 'TOTEM ADT 01', responsavel: 'ATENDIMENTO' },
        { tipo_checklist: 'totensepaineis', setor: 'PAINÉIS', local: 'PAINEL ADULTO', responsavel: 'ATENDIMENTO' }
    ];
    const wsLocais = XLSX.utils.json_to_sheet(locaisData);
    wsLocais['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsLocais, 'Locais');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Validate import data
 */
export function validateImportData(data) {
    const errors = [];

    if (!data.hospital?.nome) errors.push('Nome do hospital é obrigatório');
    if (!data.hospital?.sigla) errors.push('Sigla do hospital é obrigatória');
    if (!data.locais || data.locais.length === 0) errors.push('Pelo menos um local é obrigatório');

    // Validate locais
    data.locais?.forEach((local, i) => {
        if (!local.tipo_checklist) errors.push(`Local ${i + 1}: tipo_checklist é obrigatório`);
        if (!local.setor) errors.push(`Local ${i + 1}: setor é obrigatório`);
        if (!local.local) errors.push(`Local ${i + 1}: local é obrigatório`);
    });

    return errors;
}

/**
 * Preview what will be imported (without actually importing)
 */
export function previewImport(data) {
    const hospitalId = generateHospitalSlug(data.hospital.nome);

    return {
        hospital: {
            id: hospitalId,
            nome: data.hospital.nome,
            sigla: data.hospital.sigla
        },
        responsaveis: data.responsaveis.length,
        tecnicos: data.tecnicos.length,
        tipos_checklist: data.tipos_checklist.length,
        locais: data.locais.length,
        locais_por_tipo: data.locais.reduce((acc, l) => {
            acc[l.tipo_checklist] = (acc[l.tipo_checklist] || 0) + 1;
            return acc;
        }, {}),
        locais_por_setor: data.locais.reduce((acc, l) => {
            acc[l.setor] = (acc[l.setor] || 0) + 1;
            return acc;
        }, {})
    };
}

/**
 * Execute the import into the database
 */
export function executeImport(data) {
    const db = getDb();
    const hospitalId = generateHospitalSlug(data.hospital.nome);
    const results = { created: {}, errors: [] };

    const importTransaction = db.transaction(() => {
        // 1. Create hospital/unidade
        try {
            db.prepare('INSERT OR IGNORE INTO unidades (id, nome, sigla) VALUES (?, ?, ?)')
                .run(hospitalId, data.hospital.nome, data.hospital.sigla);
            results.created.hospital = hospitalId;
        } catch (err) {
            results.errors.push(`Hospital: ${err.message}`);
        }

        // 2. Create responsáveis
        let respCount = 0;
        for (const resp of data.responsaveis) {
            try {
                db.prepare('INSERT OR IGNORE INTO responsaveis (id, nome) VALUES (?, ?)')
                    .run(resp.id, resp.nome);
                respCount++;
            } catch (err) {
                results.errors.push(`Responsável ${resp.id}: ${err.message}`);
            }
        }
        results.created.responsaveis = respCount;

        // 3. Create técnicos
        let tecCount = 0;
        for (const nome of data.tecnicos) {
            try {
                // Check if already exists
                const exists = db.prepare('SELECT id FROM tecnicos WHERE nome = ?').get(nome);
                if (!exists) {
                    db.prepare('INSERT INTO tecnicos (nome, ativo) VALUES (?, 1)').run(nome);
                }
                tecCount++;
            } catch (err) {
                results.errors.push(`Técnico ${nome}: ${err.message}`);
            }
        }
        results.created.tecnicos = tecCount;

        // 4. Create tipos_checklist
        let tipoCount = 0;
        for (const tipo of data.tipos_checklist) {
            try {
                db.prepare('INSERT OR IGNORE INTO tipos_checklist (id, nome) VALUES (?, ?)')
                    .run(tipo.id, tipo.nome);
                tipoCount++;
            } catch (err) {
                results.errors.push(`Tipo ${tipo.id}: ${err.message}`);
            }
        }
        results.created.tipos_checklist = tipoCount;

        // 5. Create locais and associate with hospital (with deduplication)
        let localCount = 0;
        let reusedCount = 0;
        const findExisting = db.prepare('SELECT id FROM locais WHERE tipo_checklist_id = ? AND setor = ? AND local = ?');
        const insertLocal = db.prepare('INSERT INTO locais (tipo_checklist_id, setor, local, responsavel_id) VALUES (?, ?, ?, ?)');
        const insertUL = db.prepare('INSERT OR IGNORE INTO unidade_locais (unidade_id, local_id) VALUES (?, ?)');

        for (const local of data.locais) {
            try {
                // Check if this exact local already exists (same type + setor + name)
                const existing = findExisting.get(local.tipo_checklist, local.setor, local.local);

                let localId;
                if (existing) {
                    // Reuse existing local — just associate with this hospital
                    localId = existing.id;
                    reusedCount++;
                } else {
                    // Create new local
                    const result = insertLocal.run(
                        local.tipo_checklist,
                        local.setor,
                        local.local,
                        local.responsavel || null
                    );
                    localId = result.lastInsertRowid;
                    localCount++;
                }

                // Associate with hospital
                insertUL.run(hospitalId, localId);
            } catch (err) {
                results.errors.push(`Local "${local.local}": ${err.message}`);
            }
        }
        results.created.locais = localCount;
        results.created.locais_reusados = reusedCount;
    });

    importTransaction();
    return results;
}
