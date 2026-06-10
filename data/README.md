# 数据目录说明

本目录保留用于学习和复现的地图源数据。

## `wenzhou-shape/`

温州区域 shapefile 数据，包含道路、河流、铁路、地名等图层。前端不会直接加载这些文件，而是加载已经转换好的：

```text
public/map-data/wenzhou-roads.json
```

如需重新生成前端地图数据，在项目根目录运行：

```bash
python tools/convert_wenzhou_shp.py
```

脚本会读取 `data/wenzhou-shape/` 并覆盖生成 `public/map-data/wenzhou-roads.json`。
