"""Lectura de planillas FAFG: exporta únicamente campos deportivos públicos."""
import argparse
import hashlib
import json
import re
from pathlib import Path
import openpyxl


def positive(value):
    return isinstance(value, (int, float)) and value > 0


def extract(source, slug, label, destination):
    book = openpyxl.load_workbook(source, data_only=True, read_only=True)
    formulas = openpyxl.load_workbook(source, data_only=False, read_only=True)
    date_map = {}
    for col in range(36, 46):
        header = book['POSICIONES'].cell(6, col).value
        formula = formulas['POSICIONES'].cell(7, col).value
        match = re.search(r"['\"]?RE(\d+)['\"]?!", str(formula))
        if match and re.fullmatch(r'F\d+', str(header)):
            date_map[int(match[1])] = int(header[1:])
    assert len(date_map) == 10, 'No se pudo verificar la correspondencia de fechas'
    positions = []
    for r in book['POSICIONES'].iter_rows(min_row=5, max_col=16, values_only=True):
        if isinstance(r[2], (int, float)) and isinstance(r[3], str):
            assert isinstance(r[15], (int, float))
            positions.append(dict(pos=int(r[2]), nombre=r[3].strip(), categoria=r[4], puntosTour=r[15]))
    assert [x['pos'] for x in positions] == list(range(1, len(positions) + 1))
    results, cards, registrations, dates = [], [], [], []
    for sheet_number in range(1, 11):
        date = date_map[sheet_number]
        re_sheet, ac_sheet = 'RE' + str(sheet_number), 'AC' + str(sheet_number)
        indexed = {}
        for row, r in enumerate(book[re_sheet].iter_rows(min_row=5, max_col=8, values_only=True), 5):
            if not isinstance(r[1], (int, float)) or not isinstance(r[2], str) or not r[2].strip():
                continue
            item = dict(fecha=date, pos=int(r[1]), nombre=r[2].strip(), score=r[3], par=r[4], puntosTour=r[5], puntosRanking=r[6], observaciones=r[7], source=re_sheet, row=row)
            results.append(item)
            assert item['nombre'] not in indexed, 'Nombre repetido en resultados'
            indexed[item['nombre']] = item
        for row, r in enumerate(book[ac_sheet].iter_rows(min_row=5, max_col=33, values_only=True), 5):
            if not isinstance(r[4], str) or not r[4].strip():
                continue
            name = r[4].strip()
            registrations.append(dict(nombre=name, fecha=date, source=ac_sheet, row=row))
            holes = [v if positive(v) else None for v in list(r[12:21]) + list(r[22:31])]
            played = any(v is not None for v in holes)
            complete = all(v is not None for v in holes)
            total = sum(holes) if complete else None
            score = r[5] if positive(r[5]) else None
            status = r[5].strip() if isinstance(r[5], str) and r[5].strip() else 'Registrado' if score else 'Sin tarjeta'
            if played:
                cards.append(dict(fecha=date, nombre=name, hoyos=holes, scoreTarjeta=total, scoreAcreditacion=score, coincideTotal=complete and total == score, complete=complete, status=status, source=ac_sheet, row=row))
            if name not in indexed and (played or score is not None):
                results.append(dict(fecha=date, pos=None, nombre=name, score=score, par=None, puntosTour=None, puntosRanking=None, observaciones='Solo acreditación: sin fila vinculada en ' + re_sheet, source=ac_sheet, row=row, pending=True))
        if indexed:
            dates.append(date)
    metadata = dict(tour=label, season=2026, source=source.name, sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(), fechas=sorted(dates), sheetDateMap={str(k): v for k, v in date_map.items()})
    destination.mkdir(parents=True, exist_ok=True)
    payload = dict(**metadata, positions=positions, results=results, registrations=registrations)
    (destination / f'tour-{slug}-2026.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    (destination / f'tour-{slug}-2026-hoyos.json').write_text(json.dumps(dict(**metadata, results=cards), ensure_ascii=False, indent=2) + '\n')
    print(label, json.dumps(dict(posiciones=len(positions), resultados=len(results), filasRE=sum(x['source'].startswith('RE') for x in results), tarjetas=len(cards), completas=sum(x['complete'] for x in cards), diferencias=sum(not x['coincideTotal'] for x in cards), fechas=sorted(dates), mapa=date_map), ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('--slug', required=True)
    parser.add_argument('--label', required=True)
    parser.add_argument('--destination', type=Path, default=Path('data'))
    args = parser.parse_args()
    extract(args.source, args.slug, args.label, args.destination)
