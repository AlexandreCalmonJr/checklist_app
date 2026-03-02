/**
 * Seed script - Import locais data from SQL files into SQLite
 * Run with: node seed-locais.js
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDb } from './server/database.js';

const db = getDb();

// Check current count
const before = db.prepare('SELECT COUNT(*) as c FROM locais').get();
console.log(`📊 Locais antes do seed: ${before.c}`);

// Clear existing locais to avoid duplicates
db.prepare('DELETE FROM unidade_locais').run();
db.prepare('DELETE FROM locais').run();
console.log('🗑️  Locais e associações limpos');

const insert = db.prepare('INSERT INTO locais (tipo_checklist_id, setor, local, responsavel_id) VALUES (?, ?, ?, ?)');

const seedAll = db.transaction(() => {
    // ============================================
    // TOTENS E PAINÉIS
    // ============================================

    // Setor: TOTEM
    const totens = [
        ['totensepaineis', 'TOTEM', 'TOTEM ADT 01', 'ATENDIMENTO'],
        ['totensepaineis', 'TOTEM', 'TOTEM ADT 02', 'ATENDIMENTO'],
        ['totensepaineis', 'TOTEM', 'TOTEM ADT 03', 'ATENDIMENTO'],
        ['totensepaineis', 'TOTEM', 'TOTEM ADT 04', 'ATENDIMENTO'],
        ['totensepaineis', 'TOTEM', 'TOTEM ADT EXAME', 'ATENDIMENTO'],
        ['totensepaineis', 'TOTEM', 'TOTEM EMG PED 01', 'ATENDIMENTO'],
    ];
    for (const t of totens) insert.run(...t);

    // Setor: PAINÉIS
    const paineis = [
        ['totensepaineis', 'PAINÉIS', 'PAINEL ADULTO', 'ATENDIMENTO'],
        ['totensepaineis', 'PAINÉIS', 'PAINEL PEDIÁTRICO', 'ATENDIMENTO'],
        ['totensepaineis', 'PAINÉIS', 'PAINEL OBSTÉTRICO', 'ATENDIMENTO'],
        ['totensepaineis', 'PAINÉIS', 'PAINEL ORTOPÉDICO', 'ATENDIMENTO'],
        ['totensepaineis', 'PAINÉIS', 'PAINEL VIDA E IMAGEM', 'IMAGEM'],
    ];
    for (const p of paineis) insert.run(...p);

    // Setor: ONCOLOGIA
    insert.run('totensepaineis', 'ONCOLOGIA', 'TOTEM ONCOLOGIA 4º Andar', 'ONCOLOGIA');

    // ============================================
    // CENTRO CIRÚRGICO
    // ============================================
    const cc = [
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 01', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 02', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 03', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 04', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 05', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 06', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 07', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 08', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 09', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 10', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 11', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'SALA 12', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'BANCA MÉDICA', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'ESTAR MÉDICO', 'ENFERMAGEM'],
        ['centroCirurgico', 'Centro Cirúrgico', 'CRPA 01', 'ENFERMAGEM'],
    ];
    for (const c of cc) insert.run(...c);

    // ============================================
    // RACKS
    // ============================================
    const racks = [
        ['racks', 'Racks', 'Rack Principal Terreo', 'TI'],
        ['racks', 'Racks', 'Antessala Rack Principal Terreo', 'TI'],
        ['racks', 'Racks', 'Rack Pediatria Terreo', 'TI'],
        ['racks', 'Racks', 'Rack Ressonancia Terreo', 'TI'],
        ['racks', 'Racks', 'Rack 1º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 2º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 3º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 4º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 5º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 6º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 7º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 8º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 9º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 10º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 11º Andar', 'TI'],
        ['racks', 'Racks', 'Rack 12º Andar', 'TI'],
    ];
    for (const r of racks) insert.run(...r);

    // ============================================
    // EMERGÊNCIA - Emergência Adulta
    // ============================================
    const emgAdulta = [
        ['emergencia', 'Emergência Adulta', 'PAINEL Adulto', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'TOTEM ADT 01', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'TOTEM ADT 02', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'TOTEM ADT 03', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'TOTEM ADT 04', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'TOTEM ADT 05', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 1', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 2', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 3', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 4', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 5', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 6', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 7', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 8', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 9', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 10', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 11', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 12', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 13', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 14', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 15', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 16', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'CONSULTÓRIO ADULTO 17', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'Coleta ADT 01', 'IMAGEM'],
        ['emergencia', 'Emergência Adulta', 'Coleta ADT 02', 'IMAGEM'],
        ['emergencia', 'Emergência Adulta', 'RECEPÇÃO ADULTO Computador 1', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'RECEPÇÃO ADULTO Computador 2', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'RECEPÇÃO ADULTO Computador 1 Supervisão', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'RECEPÇÃO ADULTO Computador 2 Supervisão', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'AUTORIZAÇÃO Computador 1', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'AUTORIZAÇÃO Computador 2', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'AUTORIZAÇÃO Computador 3', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Adulta', 'Farmácia ADT 01', 'FARMACIA'],
        ['emergencia', 'Emergência Adulta', 'Farmácia ADT 02', 'FARMACIA'],
        ['emergencia', 'Emergência Adulta', 'ALA VERDE - ALA B Computador 1 Médico', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ALA VERDE - ALA B Computador 2 Médico', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ALA VERDE - ALA B Computador 3 Médico', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ALA VERDE - ALA B Computador 4 Posto', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ALA VERDE - ALA B Computador 5 Posto', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'Estabilização PC 1', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'Estabilização PC 2', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ECG', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ALA AMARELA - ALA C Computador 1', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Adulta', 'ALA AMARELA - ALA C Computador 2', 'ENFERMAGEM'],
    ];
    for (const e of emgAdulta) insert.run(...e);

    // ============================================
    // EMERGÊNCIA - Emergência Pediátrica
    // ============================================
    const emgPed = [
        ['emergencia', 'Emergência Pediátrica', 'PAINEL Pediatria', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'TOTEM EMG PED 01', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 1', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 2', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 3', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 4', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 5', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 6', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 7', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'CONSULTÓRIOS PEDIÁTRICOS 8', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'Coleta Ped', 'IMAGEM'],
        ['emergencia', 'Emergência Pediátrica', 'RECEPÇÃO PEDIÁTRICA Computador 1', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'RECEPÇÃO PEDIÁTRICA Computador 2', 'ATENDIMENTO'],
        ['emergencia', 'Emergência Pediátrica', 'POSTO PEDIATRIA Computador 1', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Pediátrica', 'POSTO PEDIATRIA Computador 2', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Pediátrica', 'MÉDICO PEDIÁTRICO 1', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Pediátrica', 'MÉDICO PEDIÁTRICO 2', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Pediátrica', 'POSTO PEDIÁTRICO OBS3 - Computador 1', 'ENFERMAGEM'],
        ['emergencia', 'Emergência Pediátrica', 'POSTO PEDIÁTRICO OBS3 - Computador 2', 'ENFERMAGEM'],
    ];
    for (const e of emgPed) insert.run(...e);

    // ============================================
    // EMERGÊNCIA - Ortopedia
    // ============================================
    const emgOrto = [
        ['emergencia', 'Ortopedia', 'PAINEL Traumatologia', 'ATENDIMENTO'],
        ['emergencia', 'Ortopedia', 'CONSULTÓRIOS TRAUMATOLOGIA 1', 'ATENDIMENTO'],
        ['emergencia', 'Ortopedia', 'CONSULTÓRIOS TRAUMATOLOGIA 2', 'ATENDIMENTO'],
        ['emergencia', 'Ortopedia', 'CONSULTÓRIOS TRAUMATOLOGIA 3', 'ATENDIMENTO'],
        ['emergencia', 'Ortopedia', 'RAIO X Computador 1', 'IMAGEM'],
        ['emergencia', 'Ortopedia', 'ULTRASSOM Computador 1', 'IMAGEM'],
        ['emergencia', 'Ortopedia', 'POSTO TRAUMA (SALA DE GESSO) Computador 1', 'ENFERMAGEM'],
    ];
    for (const e of emgOrto) insert.run(...e);

    // ============================================
    // EMERGÊNCIA - Obstetrícia
    // ============================================
    const emgObst = [
        ['emergencia', 'Obstetrícia', 'PAINEL Obstetrícia', 'ATENDIMENTO'],
        ['emergencia', 'Obstetrícia', 'RECEPÇÃO OBSTÉTRICA / TRAUMA Computador 1', 'ATENDIMENTO'],
        ['emergencia', 'Obstetrícia', 'CONSULTÓRIOS OBSTÉTRICOS 1', 'ATENDIMENTO'],
        ['emergencia', 'Obstetrícia', 'CONSULTÓRIOS OBSTÉTRICOS 2', 'ATENDIMENTO'],
        ['emergencia', 'Obstetrícia', 'CONSULTÓRIOS OBSTÉTRICOS 3', 'ATENDIMENTO'],
        ['emergencia', 'Obstetrícia', 'Farmácia Obst / Ped', 'FARMACIA'],
        ['emergencia', 'Obstetrícia', 'POSTO OBSTÉTRICO Computador 1', 'ENFERMAGEM'],
        ['emergencia', 'Obstetrícia', 'POSTO OBSTÉTRICO Computador 2', 'ENFERMAGEM'],
        ['emergencia', 'Obstetrícia', 'ADM Painel Sinais Vitais', 'ENFERMAGEM'],
    ];
    for (const e of emgObst) insert.run(...e);

    // ============================================
    // Associar todos os locais ao Hospital Teresa de Lisieux
    // ============================================
    const allLocais = db.prepare('SELECT id FROM locais').all();
    const insertUL = db.prepare('INSERT OR IGNORE INTO unidade_locais (unidade_id, local_id) VALUES (?, ?)');
    for (const l of allLocais) {
        insertUL.run('hteresa', l.id);
    }
});

seedAll();

const after = db.prepare('SELECT COUNT(*) as c FROM locais').get();
const ulCount = db.prepare('SELECT COUNT(*) as c FROM unidade_locais').get();

console.log(`✅ Seed concluído!`);
console.log(`📊 Locais inseridos: ${after.c}`);
console.log(`🔗 Associações unidade_locais: ${ulCount.c}`);

// Show breakdown by type
const breakdown = db.prepare(`
    SELECT tipo_checklist_id, COUNT(*) as total 
    FROM locais 
    GROUP BY tipo_checklist_id 
    ORDER BY tipo_checklist_id
`).all();
console.log('\n📋 Breakdown por tipo:');
for (const b of breakdown) {
    console.log(`   ${b.tipo_checklist_id}: ${b.total} locais`);
}

process.exit(0);
