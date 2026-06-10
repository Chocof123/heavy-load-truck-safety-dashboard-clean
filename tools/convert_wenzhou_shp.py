#!/usr/bin/env python3
"""Convert the local Wenzhou OSM shapefiles into compact dashboard JSON."""

from __future__ import annotations

import argparse
import json
import math
import struct
from pathlib import Path


def decode_text(raw: bytes) -> str:
    value = raw.rstrip(b"\x00 ").lstrip()
    if not value:
        return ""
    for encoding in ("utf-8", "gb18030", "latin1"):
        try:
            return value.decode(encoding).strip()
        except UnicodeDecodeError:
            pass
    return value.decode("utf-8", errors="replace").strip()


def read_dbf(path: Path) -> list[dict[str, object]]:
    with path.open("rb") as f:
        header = f.read(32)
        record_count = struct.unpack("<I", header[4:8])[0]
        header_length = struct.unpack("<H", header[8:10])[0]
        record_length = struct.unpack("<H", header[10:12])[0]

        fields = []
        offset = 1
        while f.tell() < header_length:
            descriptor = f.read(32)
            if not descriptor or descriptor[0] == 0x0D:
                break
            name = descriptor[:11].split(b"\x00", 1)[0].decode("ascii", "ignore")
            kind = chr(descriptor[11])
            length = descriptor[16]
            fields.append((name, kind, offset, length))
            offset += length

        f.seek(header_length)
        rows = []
        for _ in range(record_count):
            record = f.read(record_length)
            if not record or record[0:1] == b"*":
                continue
            row: dict[str, object] = {}
            for name, kind, start, length in fields:
                raw = record[start : start + length]
                text = decode_text(raw)
                if kind == "N":
                    row[name] = int(text) if text.lstrip("-").isdigit() else text
                else:
                    row[name] = text
            rows.append(row)
    return rows


def read_shapes(path: Path) -> tuple[list[list[list[float]]], list[float]]:
    features: list[list[list[float]]] = []
    with path.open("rb") as f:
        header = f.read(100)
        bbox = list(struct.unpack("<4d", header[36:68]))
        while True:
            record_header = f.read(8)
            if len(record_header) < 8:
                break
            content_length = struct.unpack(">i", record_header[4:8])[0] * 2
            content = f.read(content_length)
            if len(content) < 4:
                continue
            shape_type = struct.unpack("<i", content[:4])[0]
            if shape_type == 0:
                features.append([])
                continue
            if shape_type == 1:
                x, y = struct.unpack("<2d", content[4:20])
                features.append([[[x, y]]])
                continue
            if shape_type not in (3, 5):
                features.append([])
                continue

            num_parts = struct.unpack("<i", content[36:40])[0]
            num_points = struct.unpack("<i", content[40:44])[0]
            parts_start = 44
            points_start = parts_start + (num_parts * 4)
            parts = list(struct.unpack(f"<{num_parts}i", content[parts_start:points_start]))
            parts.append(num_points)
            points = [
                list(struct.unpack("<2d", content[points_start + i * 16 : points_start + i * 16 + 16]))
                for i in range(num_points)
            ]
            features.append([points[parts[i] : parts[i + 1]] for i in range(num_parts)])
    return features, bbox


def perpendicular_distance(point: list[float], start: list[float], end: list[float]) -> float:
    if start == end:
        return math.dist(point, start)
    x, y = point
    x1, y1 = start
    x2, y2 = end
    dx = x2 - x1
    dy = y2 - y1
    return abs(dy * x - dx * y + x2 * y1 - y2 * x1) / math.hypot(dx, dy)


def simplify_line(points: list[list[float]], tolerance: float) -> list[list[float]]:
    if len(points) <= 2:
        return points
    max_distance = 0.0
    index = 0
    for i in range(1, len(points) - 1):
        distance = perpendicular_distance(points[i], points[0], points[-1])
        if distance > max_distance:
            index = i
            max_distance = distance
    if max_distance > tolerance:
        left = simplify_line(points[: index + 1], tolerance)
        right = simplify_line(points[index:], tolerance)
        return left[:-1] + right
    return [points[0], points[-1]]


def rounded_line(points: list[list[float]], tolerance: float) -> list[list[float]]:
    simplified = simplify_line(points, tolerance)
    return [[round(x, 6), round(y, 6)] for x, y in simplified]


def add_type(types: list[str], value: object) -> int:
    text = str(value or "unknown")
    if text not in types:
        types.append(text)
    return types.index(text)


def convert_line_layer(
    shape_dir: Path,
    layer: str,
    types: list[str],
    tolerance_by_type: dict[str, float] | None = None,
    default_tolerance: float = 0.00008,
) -> tuple[list[list[object]], list[float]]:
    shapes, bbox = read_shapes(shape_dir / f"{layer}.shp")
    rows = read_dbf(shape_dir / f"{layer}.dbf")
    output = []
    tolerance_by_type = tolerance_by_type or {}
    for shape_parts, row in zip(shapes, rows):
        road_type = str(row.get("type") or "unknown")
        type_index = add_type(types, road_type)
        name = str(row.get("name") or row.get("ref") or "")
        tolerance = tolerance_by_type.get(road_type, default_tolerance)
        for part in shape_parts:
            if len(part) < 2:
                continue
            line = rounded_line(part, tolerance)
            if len(line) >= 2:
                output.append([type_index, name, line])
    return output, bbox


def convert_places(shape_dir: Path) -> list[list[object]]:
    shapes, _ = read_shapes(shape_dir / "places.shp")
    rows = read_dbf(shape_dir / "places.dbf")
    places = []
    for shape_parts, row in zip(shapes, rows):
        if not shape_parts or not shape_parts[0]:
            continue
        name = str(row.get("name") or "")
        if not name:
            continue
        x, y = shape_parts[0][0]
        places.append([name, str(row.get("type") or ""), round(x, 6), round(y, 6)])
    return places


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--shape-dir", default="../data/wenzhou-shape")
    parser.add_argument("--out", default="../public/map-data/wenzhou-roads.json")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    shape_dir = (script_dir / args.shape_dir).resolve()
    out_path = (script_dir / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    types: list[str] = []
    road_tolerances = {
        "motorway": 0.00003,
        "trunk": 0.00003,
        "primary": 0.00004,
        "secondary": 0.00005,
        "tertiary": 0.00006,
        "residential": 0.00009,
        "service": 0.00011,
        "footway": 0.00013,
        "path": 0.00013,
        "track": 0.00013,
    }
    roads, bbox = convert_line_layer(shape_dir, "roads", types, road_tolerances)
    waterways, _ = convert_line_layer(shape_dir, "waterways", types, default_tolerance=0.00008)
    railways, _ = convert_line_layer(shape_dir, "railways", types, default_tolerance=0.00005)
    places = convert_places(shape_dir)

    data = {
        "source": "OpenStreetMap contributors / BBBike extract, created 2026-06-08",
        "bbox": [round(v, 6) for v in bbox],
        "types": types,
        "roads": roads,
        "waterways": waterways,
        "railways": railways,
        "places": places,
        "counts": {
            "roads": len(roads),
            "waterways": len(waterways),
            "railways": len(railways),
            "places": len(places),
        },
    }
    out_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {out_path}")
    print(json.dumps(data["counts"], ensure_ascii=False))


if __name__ == "__main__":
    main()
