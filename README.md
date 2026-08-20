# AV Production Designer v0.2

This version incorporates the confirmed product decisions:

- Project dashboard with location/venue
- New room creation supports:
  1. dimensions
  2. manual draw
  3. uploaded floorplan
- Shared 2D/3D equipment behavior
- My Equipment + manufacturer/custom library direction
- Inventory asset/case/location fields
- Customizable Dada Bhagwan stage preset
- Quick Coverage vs Professional Prediction modes
- Design Mode vs Setup Mode
- Venue dimension editor
- Expanded stage/decor library

## Dada stage preset

The preset adds:
- 3 left photos
- 3 right photos
- center chair
- left/right devotional tables
- backdrop

Everything is deliberately represented as separate editable objects so tables, photos, spacing, backdrop and stage design can all change per event.

## Run

```bash
npm install
npm run dev
```

## Next milestone

1. True click-and-drag positioning in 2D
2. Grid/object snapping
3. Rotation + resize handles
4. Undo/redo history
5. Parametric stage editor
6. Chair/table seating generator
7. Floorplan image/PDF calibration workflow
8. Speaker coverage math + front-fill recommendation
9. Projector throw/FOV calculations
10. Cable routing and cable-length calculation
